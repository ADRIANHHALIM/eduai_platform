import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import studyService from '../../utils/studyService';
import authService from '../../utils/authService';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import QuickActionButton from '../../components/ui/QuickActionButton';
import WelcomeCard from './components/WelcomeCard';
import RecommendedActivities from './components/RecommendedActivities';
import ProgressOverview from './components/ProgressOverview';
import UpcomingSessions from './components/UpcomingSessions';
import RecentQuizResults from './components/RecentQuizResults';
import QuickStats from './components/QuickStats';
import AIChatWidget from './components/AIChatWidget';

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    subjects: [],
    studySessions: [],
    quizAttempts: [],
    progressData: []
  });
  const [error, setError] = useState(null);

  const { user, userProfile, loading: authLoading } = useAuth();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setError(null);
      
      if (!user?.id) {
        return;
      }

      // Load all required data
      const [subjectsResult, sessionsResult, quizzesResult, progressResult] = await Promise.all([
        authService.getSubjects(),
        studyService.getStudySessions(user.id),
        studyService.getQuizAttempts(user.id),
        studyService.getStudentProgress(user.id)
      ]);

      setDashboardData({
        subjects: subjectsResult?.data || [],
        studySessions: sessionsResult?.data || [],
        quizAttempts: quizzesResult?.data || [],
        progressData: progressResult?.data || []
      });

      if (!subjectsResult?.success || !sessionsResult?.success || !quizzesResult?.success) {
        setError('Some data could not be loaded. Please try refreshing.');
      }
    } catch (error) {
      setError('Failed to load dashboard data. Please try again.');
      console.log('Dashboard data load error:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      if (authLoading) return;
      
      try {
        setIsLoading(true);
        await loadDashboardData();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    // Simulate refresh delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-muted rounded-2xl"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-2xl"></div>
                ))}
              </div>
              <div className="h-64 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  // Show preview mode when not authenticated
  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-primary font-medium">Preview Mode</p>
              <p className="text-sm text-primary/80 mt-1">
                Sign in to see your personalized dashboard with real data from your study sessions and progress.
              </p>
            </div>
            {/* Render mock data for preview */}
            <PreviewDashboard />
          </div>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  // Calculate dashboard statistics
  const calculateStats = () => {
    const totalHours = dashboardData.studySessions.reduce(
      (sum, session) => sum + ((session?.duration_minutes || 0) / 60), 0
    );
    
    const completedQuizzes = dashboardData.quizAttempts.length;
    
    const averageScore = dashboardData.quizAttempts.length > 0 
      ? dashboardData.quizAttempts.reduce((sum, quiz) => sum + (quiz?.score || 0), 0) / dashboardData.quizAttempts.length
      : 0;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      hoursTrend: 2.5, // Mock trend for now
      completedQuizzes,
      quizzesTrend: 3, // Mock trend for now
      averageScore: Math.round(averageScore),
      scoreTrend: 5, // Mock trend for now
      currentRank: 7, // Mock data for now
      totalStudents: 45, // Mock data for now
      rankTrend: -1 // Mock trend for now
    };
  };

  // Transform data for components
  const transformQuizResults = () => {
    return dashboardData.quizAttempts.slice(0, 3).map(quiz => ({
      id: quiz?.id,
      title: quiz?.quiz_title,
      subject: quiz?.subject?.name,
      score: quiz?.score,
      correctAnswers: quiz?.correct_answers,
      totalQuestions: quiz?.total_questions,
      timeSpent: quiz?.time_spent_minutes,
      completedAt: quiz?.completed_at,
      trend: quiz?.score >= 80 ? 'up' : 'down' // Simple trend logic
    }));
  };

  const transformProgressData = () => {
    return dashboardData.progressData.map((subject, index) => ({
      id: index + 1,
      name: subject?.name,
      progress: Math.min(Math.round((subject?.avgScore || 0)), 100),
      completedTopics: subject?.sessionCount || 0,
      totalTopics: Math.max(subject?.sessionCount + 5, 10), // Mock calculation
      weeklyHours: Math.round((subject?.totalHours || 0) * 10) / 10
    }));
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Error banner */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Pull to refresh indicator */}
          {refreshing && (
            <div className="fixed top-16 left-0 right-0 z-30 bg-primary/10 text-primary text-center py-2 text-sm">
              Refreshing dashboard...
            </div>
          )}

          {/* Mobile Pull-to-Refresh */}
          <div 
            className="lg:hidden -mx-4 px-4"
            onTouchStart={(e) => {
              const startY = e.touches[0].clientY;
              e.currentTarget.dataset.startY = startY;
            }}
            onTouchMove={(e) => {
              const startY = parseFloat(e.currentTarget.dataset.startY);
              const currentY = e.touches[0].clientY;
              const diff = currentY - startY;
              
              if (diff > 100 && window.scrollY === 0 && !refreshing) {
                handleRefresh();
              }
            }}
          >
            {/* Welcome Section */}
            <WelcomeCard 
              userName={userProfile?.full_name || 'Student'}
              currentStreak={12} // Mock data for now
              todayGoal={45} // Mock data for now
            />

            {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Main Content Grid */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-8 space-y-6">
                <RecommendedActivities activities={dashboardData.subjects.slice(0, 3).map(subject => ({
                  id: subject?.id,
                  type: 'study',
                  title: `${subject?.name} Review`,
                  description: subject?.description || `Study ${subject?.name} concepts and practice problems`,
                  priority: 'high',
                  estimatedTime: 30,
                  points: 150,
                  subject: subject?.name
                }))} />
                <ProgressOverview subjects={transformProgressData()} />
                <RecentQuizResults quizResults={transformQuizResults()} />
              </div>

              {/* Right Column - Secondary Content */}
              <div className="lg:col-span-4 space-y-6">
                <UpcomingSessions sessions={[]} /> {/* Mock empty for now */}
                
                {/* Study Streak Widget */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">Study Streak</h3>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm font-bold">12</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You are on a 12-day study streak! Keep it up to reach your 30-day goal.
                  </p>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(12 / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    18 days to reach your goal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Content */}
          <div className="hidden lg:block">
            <WelcomeCard 
              userName={userProfile?.full_name || 'Student'}
              currentStreak={12}
              todayGoal={45}
            />

            <QuickStats stats={stats} />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 space-y-6">
                <RecommendedActivities activities={dashboardData.subjects.slice(0, 3).map(subject => ({
                  id: subject?.id,
                  type: 'study',
                  title: `${subject?.name} Review`,
                  description: subject?.description || `Study ${subject?.name} concepts and practice problems`,
                  priority: 'high',
                  estimatedTime: 30,
                  points: 150,
                  subject: subject?.name
                }))} />
                <ProgressOverview subjects={transformProgressData()} />
                <RecentQuizResults quizResults={transformQuizResults()} />
              </div>

              <div className="col-span-4 space-y-6">
                <UpcomingSessions sessions={[]} />
                
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">Study Streak</h3>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm font-bold">12</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You are on a 12-day study streak! Keep it up to reach your 30-day goal.
                  </p>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(12 / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    18 days to reach your goal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomTabNavigation />
      <QuickActionButton />
      <AIChatWidget />
    </div>
  );
};

// Preview dashboard component with mock data
const PreviewDashboard = () => {
  // Mock data for preview
  const mockUserData = {
    name: "Preview Student",
    currentStreak: 12,
    todayGoal: 45
  };

  const mockRecommendedActivities = [
    {
      id: 1,
      type: 'study',
      title: 'Linear Equations Review',
      description: 'Complete Chapter 3 exercises and practice problems',
      priority: 'high',
      estimatedTime: 30,
      points: 150,
      subject: 'Mathematics'
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Physics Motion Quiz',
      description: 'Test your understanding of velocity and acceleration',
      priority: 'medium',
      estimatedTime: 20,
      points: 100,
      subject: 'Physics'
    }
  ];

  const mockProgressData = [
    {
      id: 1,
      name: 'Mathematics',
      progress: 78,
      completedTopics: 14,
      totalTopics: 18,
      weeklyHours: 8.5
    },
    {
      id: 2,
      name: 'Physics',
      progress: 65,
      completedTopics: 11,
      totalTopics: 17,
      weeklyHours: 6.2
    }
  ];

  const mockQuizResults = [
    {
      id: 1,
      title: 'Quadratic Equations Quiz',
      subject: 'Mathematics',
      score: 85,
      correctAnswers: 17,
      totalQuestions: 20,
      timeSpent: 25,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      trend: 'up'
    }
  ];

  const mockStats = {
    totalHours: 32.1,
    hoursTrend: 2.5,
    completedQuizzes: 24,
    quizzesTrend: 3,
    averageScore: 82,
    scoreTrend: 5,
    currentRank: 7,
    totalStudents: 45,
    rankTrend: -1
  };

  return (
    <>
      <WelcomeCard 
        userName={mockUserData.name}
        currentStreak={mockUserData.currentStreak}
        todayGoal={mockUserData.todayGoal}
      />

      <QuickStats stats={mockStats} />

      <div className="lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8 space-y-6">
          <RecommendedActivities activities={mockRecommendedActivities} />
          <ProgressOverview subjects={mockProgressData} />
          <RecentQuizResults quizResults={mockQuizResults} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpcomingSessions sessions={[]} />
          
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Study Streak</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-sm font-bold">{mockUserData.currentStreak}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              You are on a {mockUserData.currentStreak}-day study streak! Keep it up to reach your 30-day goal.
            </p>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(mockUserData.currentStreak / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {30 - mockUserData.currentStreak} days to reach your goal
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;