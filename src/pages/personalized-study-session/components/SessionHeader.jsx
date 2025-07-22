import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionHeader = ({ 
  sessionTitle, 
  sessionSubtitle, 
  onPause, 
  onExit, 
  isPaused,
  sessionDuration,
  currentStreak 
}) => {
  const navigate = useNavigate();

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit this study session? Your progress will be saved.')) {
      onExit();
      navigate('/student-dashboard');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-subtle">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section - Exit & Session Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            className="flex-shrink-0"
          >
            <Icon name="X" size={20} />
          </Button>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {sessionTitle}
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              {sessionSubtitle}
            </p>
          </div>
        </div>

        {/* Center Section - Session Stats (Desktop) */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium text-foreground font-mono">
              {formatDuration(sessionDuration)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Streak</p>
            <div className="flex items-center justify-center space-x-1">
              <Icon name="Flame" size={14} className="text-warning" />
              <p className="text-sm font-medium text-foreground">
                {currentStreak}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center justify-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-warning' : 'bg-success animate-pulse'
              }`}></div>
              <p className="text-sm font-medium text-foreground">
                {isPaused ? 'Paused' : 'Active'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPause}
            iconName={isPaused ? "Play" : "Pause"}
            iconSize={16}
            className="hidden sm:flex"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPause}
            className="sm:hidden"
          >
            <Icon name={isPaused ? "Play" : "Pause"} size={20} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExit}
            iconName="LogOut"
            iconSize={16}
            className="hidden sm:flex"
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Mobile Stats Bar */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              Duration: <span className="text-foreground font-mono">{formatDuration(sessionDuration)}</span>
            </span>
            <div className="flex items-center space-x-1">
              <Icon name="Flame" size={12} className="text-warning" />
              <span className="text-foreground font-medium">{currentStreak}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-1.5 h-1.5 rounded-full ${
              isPaused ? 'bg-warning' : 'bg-success animate-pulse'
            }`}></div>
            <span className="text-foreground font-medium">
              {isPaused ? 'Paused' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;