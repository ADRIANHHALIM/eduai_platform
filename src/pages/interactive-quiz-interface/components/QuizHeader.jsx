import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizHeader = ({ 
  quizTitle, 
  currentQuestion, 
  totalQuestions, 
  timeRemaining, 
  onExit, 
  onPause,
  isPaused 
}) => {
  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 300) return 'text-foreground'; // > 5 minutes
    if (timeRemaining > 120) return 'text-warning'; // > 2 minutes
    return 'text-error'; // < 2 minutes
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Quiz Info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={16} color="var(--color-warning)" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-medium text-foreground truncate">
              {quizTitle}
            </h1>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Time Left</p>
            <p className={`text-sm font-mono font-medium ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPause}
              iconName={isPaused ? "Play" : "Pause"}
              iconSize={16}
            >
              <span className="hidden sm:inline ml-1">
                {isPaused ? 'Resume' : 'Pause'}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onExit}
              iconName="X"
              iconSize={16}
            >
              <span className="hidden sm:inline ml-1">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;