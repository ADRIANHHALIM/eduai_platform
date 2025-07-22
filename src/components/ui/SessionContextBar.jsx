import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const SessionContextBar = () => {
  const location = useLocation();
  const [sessionData, setSessionData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [progress, setProgress] = useState(0);

  // Determine session type based on current path
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/personalized-study-session')) {
      setSessionData({
        type: 'study',
        title: 'Algebra Fundamentals',
        subtitle: 'Chapter 3: Linear Equations',
        totalTime: 45 * 60, // 45 minutes in seconds
        currentTime: 32 * 60 + 15, // 32:15 elapsed
        totalTopics: 8,
        completedTopics: 5
      });
    } else if (path.includes('/interactive-quiz-interface')) {
      setSessionData({
        type: 'quiz',
        title: 'Mathematics Quiz',
        subtitle: 'Linear Equations Assessment',
        totalQuestions: 15,
        currentQuestion: 8,
        timeLimit: 30 * 60, // 30 minutes
        timeElapsed: 12 * 60 + 30 // 12:30 elapsed
      });
    } else if (path.includes('/collaborative-whiteboard')) {
      setSessionData({
        type: 'collaboration',
        title: 'Study Group Session',
        subtitle: 'Physics Problem Solving',
        participants: 4,
        duration: '1h 23m',
        isRecording: true
      });
    } else {
      setSessionData(null);
    }
  }, [location.pathname]);

  // Calculate progress and time remaining
  useEffect(() => {
    if (!sessionData) return;

    if (sessionData.type === 'study') {
      const progressPercent = (sessionData.completedTopics / sessionData.totalTopics) * 100;
      setProgress(progressPercent);
      setTimeRemaining(sessionData.totalTime - sessionData.currentTime);
    } else if (sessionData.type === 'quiz') {
      const progressPercent = ((sessionData.currentQuestion - 1) / sessionData.totalQuestions) * 100;
      setProgress(progressPercent);
      setTimeRemaining(sessionData.timeLimit - sessionData.timeElapsed);
    }
  }, [sessionData]);

  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    // Pause session logic
    console.log('Session paused');
  };

  const handleExit = () => {
    // Exit session logic
    console.log('Exit session');
  };

  const handleHelp = () => {
    // Open AI tutor help
    console.log('AI tutor help requested');
  };

  if (!sessionData) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-card border-b border-border backdrop-blur-subtle">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Session Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            {sessionData.type === 'study' && (
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={16} color="var(--color-accent)" />
              </div>
            )}
            {sessionData.type === 'quiz' && (
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={16} color="var(--color-warning)" />
              </div>
            )}
            {sessionData.type === 'collaboration' && (
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={16} color="var(--color-primary)" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-foreground truncate">
              {sessionData.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {sessionData.subtitle}
            </p>
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="hidden md:flex items-center space-x-6">
          {sessionData.type === 'study' && (
            <>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-sm font-medium text-foreground">
                  {sessionData.completedTopics}/{sessionData.totalTopics}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time Left</p>
                <p className="text-sm font-medium text-foreground font-mono">
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </>
          )}

          {sessionData.type === 'quiz' && (
            <>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Question</p>
                <p className="text-sm font-medium text-foreground">
                  {sessionData.currentQuestion}/{sessionData.totalQuestions}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time Left</p>
                <p className="text-sm font-medium text-foreground font-mono">
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </>
          )}

          {sessionData.type === 'collaboration' && (
            <>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-medium text-foreground">
                  {sessionData.participants}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">
                  {sessionData.duration}
                </p>
              </div>
              {sessionData.isRecording && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-xs text-error font-medium">REC</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Progress Bar */}
        {(sessionData.type === 'study' || sessionData.type === 'quiz') && (
          <div className="hidden lg:block w-32 mx-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelp}
            iconName="HelpCircle"
            iconSize={16}
            className="hidden sm:flex"
          >
            Help
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePause}
            iconName="Pause"
            iconSize={16}
          >
            <span className="hidden sm:inline ml-1">Pause</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExit}
            iconName="X"
            iconSize={16}
          >
            <span className="hidden sm:inline ml-1">Exit</span>
          </Button>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      {(sessionData.type === 'study' || sessionData.type === 'quiz') && (
        <div className="lg:hidden px-4 pb-2">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionContextBar;