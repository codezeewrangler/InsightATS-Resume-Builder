import { apiRequest } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

export interface AIAnalysisResult {
  atsScore: number;
  keywordMatchScore: number;
  formatQualityScore: number;
  impactScore: number;
  detectedSkills: string[];
  missingSkills: string[];
  foundKeywords: Array<{ word: string; count: number; relevance: 'high' | 'medium' | 'low' }>;
  missingKeywords: string[];
  atsIssues: Array<{ type: string; severity: 'high' | 'medium' | 'low'; message: string }>;
  improvementSuggestions: string[];
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  jobMatchScore?: number;
  matchingSkills?: string[];
  missingRequirements?: string[];
}

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription?: string,
): Promise<AIAnalysisResult> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error('Authentication required for AI analysis');
  }

  const response = await apiRequest<{ analysis: AIAnalysisResult }>(
    '/ai/resume-analysis',
    {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription }),
    },
    accessToken,
  );

  return response.analysis;
}
