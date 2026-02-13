import { useState, useEffect } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { Sidebar } from './components/Sidebar';
import { MobileMenu } from './components/MobileMenu';
import { EmptyState } from './components/EmptyState';
import { ResumeAnalysis } from './components/ResumeAnalysis';
import { SavedResumes } from './components/SavedResumes';
import { SavedResumesEmpty } from './components/SavedResumesEmpty';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { FloatingActionButton } from './components/FloatingActionButton';
import { analyzeResume, ResumeData } from './utils/resumeAnalyzer';
import { ResumeEditorPage } from './features/editor/ResumeEditorPage';
import { useAuthStore } from './store/authStore';
import { useFreeTierStore } from './store/freeTierStore';
import { useEditorStore } from './store/editorStore';
import { FreeTierStatusCard } from './components/FreeTierStatusCard';
import { ApiError } from './lib/apiClient';
import { resumeApi } from './lib/resumeApi';
import { buildEditorContentFromAnalysis } from './utils/editorContentBuilder';
import {
  buildImprovementSuggestions,
  ImprovementSuggestionItem,
} from './utils/improvementSuggestions';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSavedResumes, setHasSavedResumes] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [darkMode, setDarkMode] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResumeId, setAnalysisResumeId] = useState<string | null>(null);
  const { user, accessToken, logout, bootstrap } = useAuthStore();
  const { data: freeTierUsage, refresh: refreshFreeTierUsage } = useFreeTierStore();
  const { setResumes: setEditorResumes, setActiveResumeId } = useEditorStore();
  const isAuthenticated = Boolean(user);
  const aiLimitReached = Boolean(
    accessToken &&
      freeTierUsage &&
      freeTierUsage.usage.aiUsedToday >= freeTierUsage.limits.aiPerDay,
  );

  // Handle system preference and auto mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      if (themeMode === 'auto') {
        setDarkMode(mediaQuery.matches);
      } else {
        setDarkMode(themeMode === 'dark');
      }
    };

    // Initial update
    updateTheme();

    // Listen for system theme changes
    const handler = () => {
      if (themeMode === 'auto') {
        setDarkMode(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  useEffect(() => {
    bootstrap().catch(() => undefined);
  }, [bootstrap]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    refreshFreeTierUsage(accessToken).catch(() => undefined);
  }, [accessToken, refreshFreeTierUsage]);

  const handleFileUpload = async (file: File) => {
    setAnalysisError(null);

    if (aiLimitReached) {
      setAnalysisError('Daily AI analysis limit reached (10/10). Please wait until UTC reset.');
      return;
    }

    setUploadedResume(file);
    setIsAnalyzing(true);

    // Analyze the resume
    try {
      const data = await analyzeResume(file, jobDescription);
      setResumeData(data);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Resume analysis failed. Please try again.';
      setAnalysisError(message);
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
      if (accessToken) {
        refreshFreeTierUsage(accessToken).catch(() => undefined);
      }
    }

    // When a resume is uploaded, mark that we now have saved resumes
    setHasSavedResumes(true);
  };

  // Re-analyze when job description changes
  useEffect(() => {
    if (uploadedResume && jobDescription && resumeData) {
      const reanalyze = async () => {
        if (aiLimitReached) {
          setAnalysisError('Daily AI analysis limit reached (10/10). Please wait until UTC reset.');
          return;
        }

        setIsAnalyzing(true);
        try {
          const data = await analyzeResume(uploadedResume, jobDescription);
          setResumeData(data);
          setAnalysisError(null);
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : 'Resume re-analysis failed. Please try again.';
          setAnalysisError(message);
          console.error('Error re-analyzing resume:', error);
        } finally {
          setIsAnalyzing(false);
          if (accessToken) {
            refreshFreeTierUsage(accessToken).catch(() => undefined);
          }
        }
      };

      // Debounce to avoid too many re-analyses
      const timeoutId = setTimeout(reanalyze, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [
    uploadedResume,
    jobDescription,
    resumeData,
    aiLimitReached,
    accessToken,
    refreshFreeTierUsage,
  ]);

  const handleReset = () => {
    setUploadedResume(null);
    setResumeData(null);
    setAnalysisError(null);
    setAnalysisResumeId(null);
  };

  const handleNewUpload = () => {
    // Switch to dashboard and reset upload
    setActiveSection('dashboard');
    setUploadedResume(null);
    setResumeData(null);
    setAnalysisError(null);
    setAnalysisResumeId(null);
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If navigating to dashboard, don't reset the upload (user might want to see their analysis)
    // User can click "New Upload" button if they want to upload a different file
  };

  const handleSignOut = () => {
    logout().catch(() => undefined);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // When toggling from header, set to specific mode (not auto)
    setThemeMode(!darkMode ? 'dark' : 'light');
  };

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  const handleApplySuggestionsInEditor = async (suggestions: ImprovementSuggestionItem[]) => {
    if (!resumeData || !uploadedResume) {
      setAnalysisError('Upload and analyze a resume before applying suggestions.');
      return;
    }

    if (!accessToken) {
      setAnalysisError('Sign in is required to apply suggestions in editor.');
      setActiveSection('auth');
      return;
    }

    const selectedSuggestions =
      suggestions.length > 0 ? suggestions : buildImprovementSuggestions(resumeData);
    const content = buildEditorContentFromAnalysis(resumeData, selectedSuggestions);
    const suggestedTitle = uploadedResume.name.replace(/\.[^.]+$/, '') || 'Imported Resume';

    try {
      let targetResumeId = analysisResumeId;

      if (!targetResumeId) {
        const resumeLimitReached = Boolean(
          freeTierUsage &&
            freeTierUsage.usage.resumesUsed >= freeTierUsage.limits.resumesPerUser,
        );

        if (resumeLimitReached) {
          setAnalysisError(
            'Cannot create an editor resume: free-tier resume limit reached (3/3).',
          );
          return;
        }

        const created = await resumeApi.create(accessToken, {
          title: `${suggestedTitle} (AI Improved)`,
          content,
        });
        targetResumeId = created.resume.id;
        setAnalysisResumeId(created.resume.id);
      } else {
        await resumeApi.update(accessToken, targetResumeId, {
          title: `${suggestedTitle} (AI Improved)`,
          content,
        });
      }

      const listResponse = await resumeApi.list(accessToken);
      setEditorResumes(listResponse.resumes);
      setActiveResumeId(targetResumeId);
      setActiveSection('editor');
      setAnalysisError(null);
      await refreshFreeTierUsage(accessToken, targetResumeId);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to apply suggestions in editor. Please try again.';
      setAnalysisError(message);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <FreeTierStatusCard
              data={isAuthenticated ? freeTierUsage : null}
              darkMode={darkMode}
            />
            {analysisError && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  darkMode
                    ? 'border-red-500/40 bg-red-500/10 text-red-200'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {analysisError}
              </div>
            )}
            {uploadedResume ? (
              <ResumeAnalysis
                fileName={uploadedResume.name}
                onReset={handleReset}
                darkMode={darkMode}
                jobDescription={jobDescription}
                resumeData={resumeData}
                isAnalyzing={isAnalyzing}
                onApplyInEditor={handleApplySuggestionsInEditor}
              />
            ) : (
              <EmptyState
                onFileUpload={handleFileUpload}
                onJobDescriptionChange={setJobDescription}
                jobDescription={jobDescription}
                darkMode={darkMode}
                aiAnalysisDisabled={aiLimitReached}
                aiDisabledReason={
                  aiLimitReached
                    ? 'Daily AI analysis quota reached for free tier (10/10).'
                    : undefined
                }
              />
            )}
          </div>
        );
      case 'saved':
        return hasSavedResumes ? (
          <SavedResumes fileName={uploadedResume?.name} onNewUpload={handleNewUpload} darkMode={darkMode} resumeData={resumeData} />
        ) : (
          <SavedResumesEmpty onUploadClick={handleNewUpload} darkMode={darkMode} />
        );
      case 'analytics':
        return <AnalyticsPage hasData={hasSavedResumes} darkMode={darkMode} resumeData={resumeData} />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} themeMode={themeMode} onThemeModeChange={handleThemeModeChange} />;
      case 'auth':
        return <ProfilePage darkMode={darkMode} />;
      case 'editor':
        return (
          <ResumeEditorPage
            darkMode={darkMode}
            onRequireAuth={() => setActiveSection('auth')}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <FreeTierStatusCard
              data={isAuthenticated ? freeTierUsage : null}
              darkMode={darkMode}
            />
            {analysisError && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  darkMode
                    ? 'border-red-500/40 bg-red-500/10 text-red-200'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {analysisError}
              </div>
            )}
            {uploadedResume ? (
              <ResumeAnalysis
                fileName={uploadedResume.name}
                onReset={handleReset}
                darkMode={darkMode}
                jobDescription={jobDescription}
                resumeData={resumeData}
                isAnalyzing={isAnalyzing}
                onApplyInEditor={handleApplySuggestionsInEditor}
              />
            ) : (
              <EmptyState
                onFileUpload={handleFileUpload}
                onJobDescriptionChange={setJobDescription}
                jobDescription={jobDescription}
                darkMode={darkMode}
                aiAnalysisDisabled={aiLimitReached}
                aiDisabledReason={
                  aiLimitReached
                    ? 'Daily AI analysis quota reached for free tier (10/10).'
                    : undefined
                }
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
      <DashboardHeader
        onMenuClick={() => setIsMobileMenuOpen(true)}
        user={user ? { email: user.email, full_name: user.fullName ?? undefined } : null}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} darkMode={darkMode} />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          darkMode={darkMode}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          {renderContent()}
        </main>
      </div>
      <FloatingActionButton darkMode={darkMode} />
    </div>
  );
}
