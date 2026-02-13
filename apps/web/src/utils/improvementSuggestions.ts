import { ResumeData } from './resumeAnalyzer';

export interface ImprovementSuggestionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  source: 'heuristic' | 'ai';
}

const toTitleFromSentence = (value: string) => {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return 'Improve Resume Quality';
  }

  const clause = normalized.split(/[:.-]/)[0].trim();
  if (clause.length >= 12 && clause.length <= 64) {
    return clause;
  }

  const words = normalized.split(' ');
  return words.slice(0, 6).join(' ').replace(/[.,]$/, '');
};

const inferPriority = (value: string): 'high' | 'medium' | 'low' => {
  const lower = value.toLowerCase();
  if (/(missing|required|critical|must|urgent|no |lacks)/.test(lower)) {
    return 'high';
  }
  if (/(improve|enhance|increase|optimize|strengthen|consider)/.test(lower)) {
    return 'medium';
  }
  return 'low';
};

const dedupeSuggestions = (suggestions: ImprovementSuggestionItem[]) => {
  const seen = new Set<string>();
  return suggestions.filter((suggestion) => {
    const key = `${suggestion.title.toLowerCase()}|${suggestion.description
      .toLowerCase()
      .replace(/\s+/g, ' ')}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const buildHeuristicSuggestions = (resumeData: ResumeData): ImprovementSuggestionItem[] => {
  const suggestions: ImprovementSuggestionItem[] = [];
  let id = 1;

  if (resumeData.missingSkills.length > 0) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'high',
      title: 'Add Missing Skills',
      description: `Include ${resumeData.missingSkills.slice(0, 3).join(', ')} in your skills section to improve match rate.`,
      impact: `+${Math.min(15, resumeData.missingSkills.length * 3)}% match rate`,
      source: 'heuristic',
    });
  }

  if (resumeData.missingKeywords.length > 0) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'high',
      title: 'Incorporate Key Phrases',
      description: `Add phrases like "${resumeData.missingKeywords.slice(0, 2).join('" and "')}" to improve keyword density.`,
      impact: `+${Math.min(12, resumeData.missingKeywords.length * 2)}% ATS score`,
      source: 'heuristic',
    });
  }

  if (resumeData.impactScore < 80) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: resumeData.impactScore < 60 ? 'high' : 'medium',
      title: 'Quantify More Achievements',
      description:
        'Add specific metrics and numbers to your accomplishments (for example: "Increased efficiency by 35%").',
      impact: `+${Math.round((80 - resumeData.impactScore) * 0.5)}% impact score`,
      source: 'heuristic',
    });
  }

  if (resumeData.formatQualityScore < 85) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'medium',
      title: 'Improve Resume Formatting',
      description:
        'Use consistent formatting, clear section headings, and bullet points for better ATS parsing.',
      impact: `+${Math.round((85 - resumeData.formatQualityScore) * 0.4)}% format quality`,
      source: 'heuristic',
    });
  }

  if (!resumeData.hasSummary) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'medium',
      title: 'Add Professional Summary',
      description:
        'Include a concise professional summary at the top of your resume to communicate your value quickly.',
      impact: '+5% overall score',
      source: 'heuristic',
    });
  }

  if (!resumeData.hasSkillsSection) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'high',
      title: 'Add Skills Section',
      description: 'Create a dedicated skills section listing your technical and soft skills.',
      impact: '+10% keyword match',
      source: 'heuristic',
    });
  }

  if (resumeData.bulletPoints < 10) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'medium',
      title: 'Use More Bullet Points',
      description: `You currently have ${resumeData.bulletPoints} bullet points. Aim for 15-20 to improve readability.`,
      impact: '+5% readability',
      source: 'heuristic',
    });
  }

  if (resumeData.pageCount > 2) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'low',
      title: 'Shorten Your Resume',
      description: `Your resume is ${resumeData.pageCount} pages. Consider condensing it to 1-2 pages for ATS readability.`,
      impact: '+3% ATS score',
      source: 'heuristic',
    });
  }

  if (resumeData.missingRequirements?.length) {
    suggestions.push({
      id: `heuristic-${id++}`,
      priority: 'high',
      title: 'Address Job Requirements',
      description: `The job description highlights missing requirements: ${resumeData.missingRequirements
        .slice(0, 4)
        .join(', ')}.`,
      impact: '+8% job match score',
      source: 'heuristic',
    });
  }

  return suggestions;
};

export const buildImprovementSuggestions = (resumeData: ResumeData): ImprovementSuggestionItem[] => {
  const heuristic = buildHeuristicSuggestions(resumeData);
  const aiSuggestions = (resumeData.improvementSuggestions ?? [])
    .map((value, index) => {
      const description = value.trim();
      if (!description) {
        return null;
      }

      return {
        id: `ai-${index + 1}`,
        priority: inferPriority(description),
        title: toTitleFromSentence(description),
        description,
        impact: 'AI recommended',
        source: 'ai' as const,
      };
    })
    .filter((item): item is ImprovementSuggestionItem => Boolean(item));

  const merged = dedupeSuggestions([...aiSuggestions, ...heuristic]);
  if (merged.length > 0) {
    return merged.slice(0, 10);
  }

  return [
    {
      id: 'fallback-1',
      priority: 'low',
      title: 'Great Resume Foundation',
      description: 'Keep refining your latest achievements and keywords for each job you apply to.',
      impact: 'Well optimized',
      source: 'heuristic',
    },
  ];
};
