import { create } from 'zustand';
import type { ResumeSummary } from '@/lib/resumeApi';

interface EditorState {
  resumes: ResumeSummary[];
  activeResumeId: string | null;
  setResumes: (resumes: ResumeSummary[]) => void;
  setActiveResumeId: (id: string | null) => void;
  updateResumeTitle: (id: string, title: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  resumes: [],
  activeResumeId: null,
  setResumes: (resumes) => set({ resumes }),
  setActiveResumeId: (activeResumeId) => set({ activeResumeId }),
  updateResumeTitle: (id, title) =>
    set((state) => ({
      resumes: state.resumes.map((resume) =>
        resume.id === id ? { ...resume, title } : resume,
      ),
    })),
}));
