import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import { consumeAiQuota, ensureAiQuota } from '../usage/usage.service';

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export const analyzeResume = async (userId: string, resumeText: string, jobDescription?: string) => {
  const hasGroqApiKey = Boolean(env.GROQ_API_KEY);

  if (!hasGroqApiKey && env.NODE_ENV !== 'test') {
    throw new AppError('GROQ_API_KEY is not configured', 500);
  }

  await ensureAiQuota(userId);

  const jobContext = jobDescription
    ? `\n\nThe user also provided this Job Description to match against:\n"""${jobDescription}"""\n\nInclude jobMatchScore (0-100), matchingSkills (array of skills found in both resume and JD), and missingRequirements (skills in JD but not in resume).`
    : '';

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the given resume text and return a JSON object with the following fields. Be accurate and realistic in your scoring.\n\nReturn ONLY valid JSON, no markdown, no explanation, no code fences. The JSON must have these exact fields:\n{\n  "atsScore": <number 0-100, overall ATS compatibility>,\n  "keywordMatchScore": <number 0-100, how well keywords are used>,\n  "formatQualityScore": <number 0-100, resume structure/formatting quality>,\n  "impactScore": <number 0-100, strength of action verbs and quantified achievements>,\n  "detectedSkills": [<array of skills found in the resume>],\n  "missingSkills": [<array of important skills NOT in resume but commonly expected>],\n  "foundKeywords": [{"word": "<action verb>", "count": <times used>, "relevance": "<high|medium|low>"}],\n  "missingKeywords": [<important action verbs/keywords NOT found>],\n  "atsIssues": [{"type": "<issue_id>", "severity": "<high|medium|low>", "message": "<description>"}],\n  "improvementSuggestions": [<array of actionable improvement tips>],\n  "name": "<candidate name or null>",\n  "email": "<email or null>",\n  "phone": "<phone or null>",\n  "location": "<location or null>"\n  ${jobDescription ? ', "jobMatchScore": <number 0-100>, "matchingSkills": [<skills in both>], "missingRequirements": [<skills in JD not in resume>]' : ''}\n}`;

  const userPrompt = `Analyze this resume:\n\n"""${resumeText}"""${jobContext}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (hasGroqApiKey) {
    headers.Authorization = `Bearer ${env.GROQ_API_KEY}`;
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AppError('Groq API error', response.status, errorText);
  }

  const data = (await response.json()) as GroqResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new AppError('Empty Groq response', 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new AppError('Failed to parse Groq response', 502, error);
  }

  await consumeAiQuota(userId);
  return parsed;
};
