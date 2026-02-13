import { ResumeData } from './resumeAnalyzer';
import { ImprovementSuggestionItem } from './improvementSuggestions';

type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
};

const textNode = (text: string): TipTapNode => ({ type: 'text', text });

const paragraphNode = (text: string): TipTapNode => ({
  type: 'paragraph',
  content: [textNode(text)],
});

const headingNode = (text: string, level: number): TipTapNode => ({
  type: 'heading',
  attrs: { level },
  content: [textNode(text)],
});

const bulletListNode = (items: string[]): TipTapNode => ({
  type: 'bulletList',
  content: items.map((item) => ({
    type: 'listItem',
    content: [paragraphNode(item)],
  })),
});

const normalizeResumeParagraphs = (text: string): string[] => {
  const normalized = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
  if (!normalized) {
    return [];
  }

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length > 1) {
    return blocks.slice(0, 30);
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return [normalized];
  }

  const grouped: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    grouped.push(sentences.slice(index, index + 2).join(' '));
  }
  return grouped.slice(0, 30);
};

const shouldAddSummary = (resumeData: ResumeData, suggestions: ImprovementSuggestionItem[]) =>
  !resumeData.hasSummary ||
  suggestions.some((suggestion) => suggestion.title.toLowerCase().includes('summary'));

const shouldAddSkillsSection = (resumeData: ResumeData, suggestions: ImprovementSuggestionItem[]) =>
  !resumeData.hasSkillsSection ||
  suggestions.some((suggestion) => suggestion.title.toLowerCase().includes('skills'));

const shouldAddKeywords = (suggestions: ImprovementSuggestionItem[]) =>
  suggestions.some((suggestion) => suggestion.title.toLowerCase().includes('phrase'));

const buildSummaryText = (resumeData: ResumeData) => {
  const roleHint = resumeData.detectedSkills.slice(0, 3).join(', ');
  if (roleHint) {
    return `Results-driven professional with experience in ${roleHint}. Focused on measurable outcomes and cross-functional collaboration.`;
  }
  return 'Results-driven professional focused on measurable outcomes, efficient execution, and clear communication.';
};

const stripExtension = (fileName: string) => fileName.replace(/\.[^.]+$/, '');

export const buildEditorContentFromAnalysis = (
  resumeData: ResumeData,
  suggestions: ImprovementSuggestionItem[],
) => {
  const content: TipTapNode[] = [];
  const title = resumeData.name?.trim() || stripExtension(resumeData.fileName) || 'Imported Resume';
  const contactParts = [resumeData.email, resumeData.phone, resumeData.location].filter(Boolean);

  content.push(headingNode(title, 1));

  if (contactParts.length > 0) {
    content.push(paragraphNode(contactParts.join(' | ')));
  }

  if (shouldAddSummary(resumeData, suggestions)) {
    content.push(headingNode('Professional Summary', 2));
    content.push(paragraphNode(buildSummaryText(resumeData)));
  }

  content.push(headingNode('Imported Resume Content', 2));
  const paragraphs = normalizeResumeParagraphs(resumeData.extractedText);
  if (paragraphs.length === 0) {
    content.push(paragraphNode('No readable content was extracted from the uploaded file.'));
  } else {
    paragraphs.forEach((paragraph) => {
      content.push(paragraphNode(paragraph));
    });
  }

  if (shouldAddSkillsSection(resumeData, suggestions)) {
    const skillCandidates = Array.from(
      new Set([...resumeData.detectedSkills, ...resumeData.missingSkills]),
    )
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 12);

    if (skillCandidates.length > 0) {
      content.push(headingNode('Target Skills', 2));
      content.push(bulletListNode(skillCandidates));
    }
  }

  if (shouldAddKeywords(suggestions) && resumeData.missingKeywords.length > 0) {
    content.push(headingNode('ATS Keywords To Weave In', 2));
    content.push(
      paragraphNode(
        `Include these keywords naturally in experience bullets: ${resumeData.missingKeywords
          .slice(0, 8)
          .join(', ')}.`,
      ),
    );
  }

  if (suggestions.length > 0) {
    content.push(headingNode('AI Improvement Checklist', 2));
    content.push(
      bulletListNode(
        suggestions.slice(0, 8).map((suggestion) => `${suggestion.title}: ${suggestion.description}`),
      ),
    );
  }

  return { type: 'doc', content };
};
