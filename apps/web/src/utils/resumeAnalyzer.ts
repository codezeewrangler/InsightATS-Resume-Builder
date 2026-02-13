import { analyzeResumeWithAI } from './groqClient';
import { ApiError } from '@/lib/apiClient';

export interface ResumeData {
  fileName: string;
  fileSize: number;
  uploadDate: Date;

  // Extracted content
  extractedText: string;

  // Personal info
  name?: string;
  email?: string;
  phone?: string;
  location?: string;

  // Analysis scores
  atsScore: number;
  keywordMatchScore: number;
  formatQualityScore: number;
  impactScore: number;

  // Skills
  detectedSkills: string[];
  missingSkills: string[];

  // Keywords
  foundKeywords: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>;
  missingKeywords: string[];

  // Structure analysis
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkillsSection: boolean;
  sectionCount: number;

  // Metrics
  wordCount: number;
  pageCount: number;
  bulletPoints: number;

  // ATS Compatibility
  atsIssues: Array<{ type: string; severity: 'high' | 'medium' | 'low'; message: string }>;

  // AI suggestions
  improvementSuggestions?: string[];

  // Job matching (if job description provided)
  jobMatchScore?: number;
  matchingSkills?: string[];
  missingRequirements?: string[];
}

// ──────────────────────────────────────────────
// Real text extraction from uploaded files
// ──────────────────────────────────────────────
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // Plain text files
  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return await file.text();
  }

  // PDF files — extract readable text from raw bytes
  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  }

  // DOCX files — extract from XML inside the zip
  if (fileName.endsWith('.docx')) {
    return await extractTextFromDOCX(file);
  }

  // Fallback: try reading as text
  return await file.text();
}

// Simple PDF text extraction without external libraries
// Parses the raw PDF byte stream looking for text objects
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Convert to string for text stream parsing
  let rawText = '';
  for (let i = 0; i < bytes.length; i++) {
    rawText += String.fromCharCode(bytes[i]);
  }

  const extractedParts: string[] = [];

  // Strategy 1: Extract text between BT...ET (text objects)
  const textObjectRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = textObjectRegex.exec(rawText)) !== null) {
    const block = match[1];
    // Extract strings inside parentheses: (text) Tj or (text) TJ
    const stringRegex = /\(([^)]*)\)/g;
    let strMatch;
    while ((strMatch = stringRegex.exec(block)) !== null) {
      const decoded = strMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
        .replace(/\\([()])/g, '$1');
      if (decoded.trim()) {
        extractedParts.push(decoded);
      }
    }
    // Also extract hex strings: <hex> Tj
    const hexRegex = /<([0-9A-Fa-f]+)>/g;
    let hexMatch;
    while ((hexMatch = hexRegex.exec(block)) !== null) {
      const hex = hexMatch[1];
      let decoded = '';
      for (let i = 0; i < hex.length; i += 2) {
        const charCode = parseInt(hex.substring(i, i + 2), 16);
        if (charCode >= 32 && charCode < 127) {
          decoded += String.fromCharCode(charCode);
        }
      }
      if (decoded.trim()) {
        extractedParts.push(decoded);
      }
    }
  }

  // Strategy 2: If BT/ET extraction found very little, try stream-based extraction
  if (extractedParts.join(' ').trim().length < 50) {
    const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
    while ((match = streamRegex.exec(rawText)) !== null) {
      const content = match[1];
      // Look for readable ASCII text runs
      const readableRegex = /[A-Za-z0-9@.\-,;:!? ]{4,}/g;
      let readMatch;
      while ((readMatch = readableRegex.exec(content)) !== null) {
        extractedParts.push(readMatch[0]);
      }
    }
  }

  const result = extractedParts.join(' ').replace(/\s+/g, ' ').trim();

  if (result.length < 20) {
    // If we couldn't extract meaningful text, try reading the entire file as text
    // and extracting readable content
    const fullText = rawText;
    const readableLines: string[] = [];
    const lineRegex = /[A-Za-z0-9@.\-,;:!?() ]{10,}/g;
    let lineMatch;
    while ((lineMatch = lineRegex.exec(fullText)) !== null) {
      readableLines.push(lineMatch[0].trim());
    }
    return readableLines.join('\n') || 'Unable to extract text from this PDF. Please try a text-based resume file.';
  }

  return result;
}

// Simple DOCX text extraction (DOCX = ZIP containing XML)
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // DOCX is a ZIP file, the main content is in word/document.xml
    // Simple approach: search for XML text content in the raw bytes
    let rawText = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    rawText = decoder.decode(bytes);

    // Extract text from <w:t> tags (Word XML)
    const textParts: string[] = [];
    const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wtRegex.exec(rawText)) !== null) {
      if (match[1].trim()) {
        textParts.push(match[1]);
      }
    }

    if (textParts.length > 0) {
      return textParts.join(' ');
    }

    // Fallback: extract any readable text
    const readable = rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = readable.split(' ').filter(w => /^[A-Za-z0-9@.\-,;:!?()]+$/.test(w));
    return words.join(' ') || 'Unable to extract text from this DOCX file.';
  } catch {
    return 'Unable to extract text from this file.';
  }
}

// ──────────────────────────────────────────────
// Local fallback analysis (no API needed)
// ──────────────────────────────────────────────
function extractSkills(text: string): string[] {
  const skillsKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Next.js',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS', 'LESS',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Supabase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform',
    'Git', 'JIRA', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices', 'Linux',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'Power BI', 'Tableau', 'Excel', 'Figma', 'Canva',
    'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'
  ];

  return skillsKeywords.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function analyzeStructure(text: string) {
  const lowerText = text.toLowerCase();

  return {
    hasSummary: lowerText.includes('summary') || lowerText.includes('objective') || lowerText.includes('profile'),
    hasExperience: lowerText.includes('experience') || lowerText.includes('employment') || lowerText.includes('work history'),
    hasEducation: lowerText.includes('education') || lowerText.includes('academic'),
    hasSkillsSection: lowerText.includes('skills') || lowerText.includes('technologies') || lowerText.includes('expertise'),
    sectionCount: (text.match(/^[A-Z\s]{3,}$/gm) || []).length,
    bulletPoints: (text.match(/[•*-]\s/g) || []).length
  };
}

function calculateATSScore(structure: ReturnType<typeof analyzeStructure>, skills: string[], wordCount: number): number {
  let score = 60;
  if (structure.hasSummary) score += 5;
  if (structure.hasExperience) score += 10;
  if (structure.hasEducation) score += 5;
  if (structure.hasSkillsSection) score += 5;
  if (skills.length > 15) score += 10;
  else if (skills.length > 10) score += 7;
  else if (skills.length > 5) score += 5;
  if (structure.bulletPoints > 20) score += 5;
  else if (structure.bulletPoints > 10) score += 3;
  if (wordCount > 400 && wordCount < 800) score += 5;
  return Math.min(100, score);
}

function extractKeywords(text: string) {
  const keywords = [
    { word: 'developed', relevance: 'high' as const },
    { word: 'led', relevance: 'high' as const },
    { word: 'implemented', relevance: 'high' as const },
    { word: 'improved', relevance: 'high' as const },
    { word: 'managed', relevance: 'high' as const },
    { word: 'optimized', relevance: 'medium' as const },
    { word: 'collaborated', relevance: 'medium' as const },
    { word: 'designed', relevance: 'high' as const },
    { word: 'built', relevance: 'medium' as const },
    { word: 'created', relevance: 'medium' as const },
    { word: 'achieved', relevance: 'high' as const },
    { word: 'reduced', relevance: 'high' as const },
    { word: 'increased', relevance: 'high' as const },
  ];

  const lowerText = text.toLowerCase();

  return keywords
    .map(kw => ({
      word: kw.word,
      count: (lowerText.match(new RegExp(kw.word, 'g')) || []).length,
      relevance: kw.relevance
    }))
    .filter(kw => kw.count > 0)
    .sort((a, b) => b.count - a.count);
}

function identifyATSIssues(text: string, structure: ReturnType<typeof analyzeStructure>) {
  const issues: Array<{ type: string; severity: 'high' | 'medium' | 'low'; message: string }> = [];

  if (!structure.hasSummary) {
    issues.push({ type: 'missing_summary', severity: 'medium', message: 'No professional summary found. Consider adding a brief summary at the top.' });
  }
  if (structure.bulletPoints < 10) {
    issues.push({ type: 'few_bullet_points', severity: 'low', message: 'Low number of bullet points. Use bullet points to highlight achievements.' });
  }
  if (!text.includes('@')) {
    issues.push({ type: 'missing_email', severity: 'high', message: 'No email address detected. Include contact information.' });
  }
  if (!structure.hasSkillsSection) {
    issues.push({ type: 'missing_skills', severity: 'medium', message: 'No dedicated skills section found. Add a skills section for better ATS parsing.' });
  }

  return issues;
}

function sectionCoverageScore(structure: ReturnType<typeof analyzeStructure>) {
  const sections = [
    structure.hasSummary,
    structure.hasExperience,
    structure.hasEducation,
    structure.hasSkillsSection,
  ];
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
}

function getKeywordHitCount(
  keywords: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>,
) {
  return keywords.reduce((total, keyword) => total + keyword.count, 0);
}

function getQuantifiedAchievementCount(text: string) {
  return (
    text.match(
      /(\b\d+%|\b\d+\+|\$\d+(?:,\d{3})*(?:\.\d+)?|\b\d+\s*(?:years|months|projects|clients|users|teams|k|m|million|billion))/gi,
    ) || []
  ).length;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseScore(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampScore(value);
  }

  if (typeof value === 'string') {
    const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(numeric)) {
      return clampScore(numeric);
    }
  }

  return clampScore(fallback);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function normalizeKeywords(
  value: unknown,
): Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const data = entry as Record<string, unknown>;
      const word = typeof data.word === 'string' ? data.word.trim() : '';
      const rawCount = typeof data.count === 'number' ? data.count : Number(data.count);
      const count = Number.isFinite(rawCount) ? Math.max(0, Math.round(rawCount)) : 0;
      const relevance =
        data.relevance === 'high' || data.relevance === 'medium' || data.relevance === 'low'
          ? data.relevance
          : 'medium';

      if (!word) {
        return null;
      }

      return { word, count, relevance };
    })
    .filter((item): item is { word: string; count: number; relevance: 'high' | 'medium' | 'low' } => Boolean(item));
}

function normalizeIssues(
  value: unknown,
): Array<{ type: string; severity: 'high' | 'medium' | 'low'; message: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const data = entry as Record<string, unknown>;
      const type = typeof data.type === 'string' ? data.type : 'general';
      const message =
        typeof data.message === 'string' && data.message.trim()
          ? data.message.trim()
          : 'Potential ATS compatibility issue detected.';
      const severity =
        data.severity === 'high' || data.severity === 'medium' || data.severity === 'low'
          ? data.severity
          : 'medium';

      return { type, severity, message };
    })
    .filter(
      (item): item is { type: string; severity: 'high' | 'medium' | 'low'; message: string } =>
        Boolean(item),
    );
}

function isSuspiciousAiScores(scores: {
  atsScore: number;
  keywordMatchScore: number;
  formatQualityScore: number;
  impactScore: number;
}, wordCount: number) {
  const allNearZero =
    scores.atsScore <= 5 &&
    scores.keywordMatchScore <= 5 &&
    scores.formatQualityScore <= 5 &&
    scores.impactScore <= 5;

  return allNearZero && wordCount >= 80;
}

function scoreSpread(scores: {
  atsScore: number;
  keywordMatchScore: number;
  formatQualityScore: number;
  impactScore: number;
}) {
  const values = [scores.atsScore, scores.keywordMatchScore, scores.formatQualityScore, scores.impactScore];
  return Math.max(...values) - Math.min(...values);
}

function hasSparseAiPayload(payload: {
  scores: { atsScore: number; keywordMatchScore: number; formatQualityScore: number; impactScore: number };
  detectedSkills: string[];
  foundKeywords: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>;
  atsIssues: Array<{ type: string; severity: 'high' | 'medium' | 'low'; message: string }>;
  improvementSuggestions: string[];
  wordCount: number;
}) {
  const keywordHits = getKeywordHitCount(payload.foundKeywords);
  const nonZeroScores = Object.values(payload.scores).filter((score) => score > 0).length;
  const meanScore =
    (payload.scores.atsScore +
      payload.scores.keywordMatchScore +
      payload.scores.formatQualityScore +
      payload.scores.impactScore) /
    4;
  const veryFlatLowScores = scoreSpread(payload.scores) <= 10 && meanScore <= 20;

  return (
    (payload.wordCount >= 80 && nonZeroScores <= 1 && keywordHits === 0 && payload.detectedSkills.length === 0) ||
    (veryFlatLowScores && payload.atsIssues.length === 0 && payload.improvementSuggestions.length === 0)
  );
}

function mergeUniqueStrings(primary: string[], secondary: string[], limit = 20) {
  const deduped = Array.from(
    new Set(
      [...primary, ...secondary]
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
  return deduped.slice(0, limit);
}

function mergeKeywords(
  primary: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>,
  secondary: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>,
) {
  const map = new Map<string, { word: string; count: number; relevance: 'high' | 'medium' | 'low' }>();

  [...primary, ...secondary].forEach((keyword) => {
    const key = keyword.word.toLowerCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, keyword);
      return;
    }

    map.set(key, {
      word: existing.word,
      count: Math.max(existing.count, keyword.count),
      relevance:
        existing.relevance === 'high' || keyword.relevance === 'high'
          ? 'high'
          : existing.relevance === 'medium' || keyword.relevance === 'medium'
            ? 'medium'
            : 'low',
    });
  });

  return Array.from(map.values())
    .filter((keyword) => keyword.count > 0)
    .sort((a, b) => b.count - a.count);
}

function localFallbackAnalysis(extractedText: string, jobDescription?: string): Omit<ResumeData, 'fileName' | 'fileSize' | 'uploadDate' | 'extractedText'> {
  const emailMatch = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = extractedText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const skills = extractSkills(extractedText);
  const structure = analyzeStructure(extractedText);
  const wordCount = extractedText.split(/\s+/).length;
  const pageCount = Math.ceil(wordCount / 500);
  const foundKeywords = extractKeywords(extractedText);
  const keywordHits = getKeywordHitCount(foundKeywords);
  const quantifiedAchievements = getQuantifiedAchievementCount(extractedText);
  const structureCoverage = sectionCoverageScore(structure);
  const baselineAts = calculateATSScore(structure, skills, wordCount);

  const keywordMatchScore = clampScore(
    35 +
      foundKeywords.length * 8 +
      Math.min(keywordHits, 20) * 2 +
      (structure.hasSkillsSection ? 10 : 0) +
      (skills.length >= 8 ? 8 : skills.length >= 4 ? 4 : 0),
  );

  const formatQualityScore = clampScore(
    structureCoverage * 0.65 +
      (structure.bulletPoints >= 12 ? 20 : structure.bulletPoints >= 6 ? 12 : 4) +
      (pageCount <= 2 ? 12 : 5) +
      (wordCount >= 250 && wordCount <= 900 ? 8 : 0),
  );

  const impactScore = clampScore(
    28 +
      foundKeywords.filter((keyword) => keyword.relevance === 'high').length * 8 +
      Math.min(keywordHits, 18) * 2 +
      Math.min(quantifiedAchievements, 8) * 5 +
      (structure.bulletPoints >= 10 ? 8 : 0),
  );

  const atsScore = clampScore(
    baselineAts * 0.4 +
      formatQualityScore * 0.25 +
      keywordMatchScore * 0.2 +
      impactScore * 0.15,
  );

  const atsIssues = identifyATSIssues(extractedText, structure);

  let jobMatching: { jobMatchScore?: number; matchingSkills?: string[]; missingRequirements?: string[] } = {};
  if (jobDescription) {
    const jdSkills = extractSkills(jobDescription);
    const matchingSkills = skills.filter(skill =>
      jdSkills.some(jdSkill => jdSkill.toLowerCase() === skill.toLowerCase())
    );
    const missingRequirements = jdSkills.filter(jdSkill =>
      !skills.some(skill => skill.toLowerCase() === jdSkill.toLowerCase())
    );
    const matchPercentage = jdSkills.length > 0
      ? (matchingSkills.length / jdSkills.length) * 100
      : 85;
    jobMatching = {
      jobMatchScore: Math.round(matchPercentage),
      matchingSkills,
      missingRequirements
    };
  }

  const generatedSuggestions: string[] = [];
  if (!structure.hasSummary) {
    generatedSuggestions.push('Add a 2-3 line professional summary at the top of the resume.');
  }
  if (!structure.hasSkillsSection) {
    generatedSuggestions.push('Create a dedicated skills section with core technical and domain skills.');
  }
  if (quantifiedAchievements < 3) {
    generatedSuggestions.push('Add measurable outcomes to bullet points (percentages, counts, revenue, scale).');
  }
  if (keywordHits < 6) {
    generatedSuggestions.push('Increase action-verb usage across experience bullets for stronger ATS keyword density.');
  }
  if (generatedSuggestions.length === 0) {
    generatedSuggestions.push('Tailor summary and skills keywords for each role before applying.');
  }

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    atsScore,
    keywordMatchScore,
    formatQualityScore,
    impactScore,
    detectedSkills: skills,
    missingSkills: ['Cloud Architecture', 'System Design', 'Performance Optimization'].filter(s => !skills.includes(s)),
    foundKeywords,
    missingKeywords: ['achieved', 'spearheaded', 'transformed'].filter(kw => !extractedText.toLowerCase().includes(kw)),
    ...structure,
    wordCount,
    pageCount,
    bulletPoints: structure.bulletPoints,
    atsIssues,
    improvementSuggestions: generatedSuggestions,
    ...jobMatching
  };
}

// ──────────────────────────────────────────────
// Main analysis function
// ──────────────────────────────────────────────
export async function analyzeResume(file: File, jobDescription?: string): Promise<ResumeData> {
  // Step 1: Extract real text from the file
  const extractedText = await extractTextFromFile(file);

  console.log(`[ResumeAnalyzer] Extracted ${extractedText.length} characters from ${file.name}`);

  const baseData = {
    fileName: file.name,
    fileSize: file.size,
    uploadDate: new Date(),
    extractedText,
  };

  // Step 2: Try AI-powered analysis via Groq
  try {
    console.log('[ResumeAnalyzer] Calling Groq AI for analysis...');
    const aiResult = await analyzeResumeWithAI(extractedText, jobDescription);
    console.log('[ResumeAnalyzer] AI analysis complete');

    const aiRecord = aiResult as unknown as Record<string, unknown>;
    const fallback = localFallbackAnalysis(extractedText, jobDescription);

    // Merge AI results with local structural analysis + fallback safety
    const structure = analyzeStructure(extractedText);
    const wordCount = extractedText.split(/\s+/).length;
    const parsedScores = {
      atsScore: parseScore(aiRecord.atsScore, fallback.atsScore),
      keywordMatchScore: parseScore(aiRecord.keywordMatchScore, fallback.keywordMatchScore),
      formatQualityScore: parseScore(aiRecord.formatQualityScore, fallback.formatQualityScore),
      impactScore: parseScore(aiRecord.impactScore, fallback.impactScore),
    };

    const aiDetectedSkills = normalizeStringArray(aiRecord.detectedSkills);
    const aiMissingSkills = normalizeStringArray(aiRecord.missingSkills);
    const aiFoundKeywords = normalizeKeywords(aiRecord.foundKeywords);
    const aiMissingKeywords = normalizeStringArray(aiRecord.missingKeywords);
    const aiIssues = normalizeIssues(aiRecord.atsIssues);
    const aiImprovementSuggestions = normalizeStringArray(aiRecord.improvementSuggestions);
    const aiMatchingSkills = normalizeStringArray(aiRecord.matchingSkills);
    const aiMissingRequirements = normalizeStringArray(aiRecord.missingRequirements);

    const sparseAiPayload = hasSparseAiPayload({
      scores: parsedScores,
      detectedSkills: aiDetectedSkills,
      foundKeywords: aiFoundKeywords,
      atsIssues: aiIssues,
      improvementSuggestions: aiImprovementSuggestions,
      wordCount,
    });

    const useFallbackScores = isSuspiciousAiScores(parsedScores, wordCount) || sparseAiPayload;
    const finalScores = useFallbackScores
      ? {
          atsScore: fallback.atsScore,
          keywordMatchScore: fallback.keywordMatchScore,
          formatQualityScore: fallback.formatQualityScore,
          impactScore: fallback.impactScore,
        }
      : {
          atsScore: clampScore(parsedScores.atsScore * 0.85 + fallback.atsScore * 0.15),
          keywordMatchScore: clampScore(
            parsedScores.keywordMatchScore * 0.85 + fallback.keywordMatchScore * 0.15,
          ),
          formatQualityScore: clampScore(
            parsedScores.formatQualityScore * 0.85 + fallback.formatQualityScore * 0.15,
          ),
          impactScore: clampScore(parsedScores.impactScore * 0.85 + fallback.impactScore * 0.15),
        };

    const detectedSkills = useFallbackScores
      ? mergeUniqueStrings(fallback.detectedSkills, aiDetectedSkills, 24)
      : mergeUniqueStrings(aiDetectedSkills, fallback.detectedSkills, 24);
    const missingSkills = useFallbackScores
      ? mergeUniqueStrings(fallback.missingSkills, aiMissingSkills, 16)
      : mergeUniqueStrings(aiMissingSkills, fallback.missingSkills, 16);
    const foundKeywords = useFallbackScores
      ? mergeKeywords(fallback.foundKeywords, aiFoundKeywords)
      : mergeKeywords(aiFoundKeywords, fallback.foundKeywords);
    const missingKeywords = useFallbackScores
      ? mergeUniqueStrings(fallback.missingKeywords, aiMissingKeywords, 20)
      : mergeUniqueStrings(aiMissingKeywords, fallback.missingKeywords, 20);
    const improvementSuggestions = useFallbackScores
      ? mergeUniqueStrings(fallback.improvementSuggestions ?? [], aiImprovementSuggestions, 12)
      : mergeUniqueStrings(aiImprovementSuggestions, fallback.improvementSuggestions ?? [], 12);
    const atsIssues = useFallbackScores
      ? [...fallback.atsIssues, ...aiIssues].slice(0, 12)
      : [...aiIssues, ...fallback.atsIssues].slice(0, 12);
    const jobMatchScore = jobDescription
      ? useFallbackScores
        ? fallback.jobMatchScore
        : parseScore(aiRecord.jobMatchScore, fallback.jobMatchScore ?? 0)
      : undefined;
    const matchingSkills = jobDescription
      ? useFallbackScores
        ? mergeUniqueStrings(fallback.matchingSkills ?? [], aiMatchingSkills, 18)
        : mergeUniqueStrings(aiMatchingSkills, fallback.matchingSkills ?? [], 18)
      : undefined;
    const missingRequirements = jobDescription
      ? useFallbackScores
        ? mergeUniqueStrings(fallback.missingRequirements ?? [], aiMissingRequirements, 18)
        : mergeUniqueStrings(aiMissingRequirements, fallback.missingRequirements ?? [], 18)
      : undefined;

    return {
      ...baseData,
      name: typeof aiRecord.name === 'string' ? aiRecord.name : undefined,
      email: typeof aiRecord.email === 'string' ? aiRecord.email : fallback.email,
      phone: typeof aiRecord.phone === 'string' ? aiRecord.phone : fallback.phone,
      location: typeof aiRecord.location === 'string' ? aiRecord.location : undefined,
      atsScore: finalScores.atsScore,
      keywordMatchScore: finalScores.keywordMatchScore,
      formatQualityScore: finalScores.formatQualityScore,
      impactScore: finalScores.impactScore,
      detectedSkills,
      missingSkills,
      foundKeywords,
      missingKeywords,
      ...structure,
      wordCount,
      pageCount: Math.ceil(wordCount / 500),
      bulletPoints: structure.bulletPoints,
      atsIssues,
      improvementSuggestions,
      jobMatchScore,
      matchingSkills,
      missingRequirements,
    };
  } catch (error) {
    if (error instanceof ApiError && error.code === 'FREE_TIER_LIMIT_REACHED') {
      throw error;
    }

    console.warn('[ResumeAnalyzer] AI analysis failed, using local fallback:', error);

    // Step 3: Fallback to local heuristic analysis
    const fallback = localFallbackAnalysis(extractedText, jobDescription);
    return {
      ...baseData,
      ...fallback,
    };
  }
}
