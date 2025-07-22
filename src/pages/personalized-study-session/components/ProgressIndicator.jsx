import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ 
  currentCard, 
  totalCards, 
  completedCards, 
  estimatedTimeRemaining,
  sessionStartTime,
  difficulty 
}) => {
  const progressPercentage = (completedCards / totalCards) * 100;
  const timeElapsed = Math.floor((Date.now() - sessionStartTime) / 1000 / 60); // in minutes

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'easy': return 'TrendingUp';
      case 'medium': return 'BarChart3';
      case 'hard': return 'TrendingUp';
      default: return 'BarChart3';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-card-elevation border border-border p-4 lg:p-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Session Progress</h3>
        <div className="flex items-center space-x-2">
          <Icon 
            name={getDifficultyIcon(difficulty)} 
            size={16} 
            className={getDifficultyColor(difficulty)}
          />
          <span className={`text-sm font-medium capitalize ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {completedCards} of {totalCards} completed
          </span>
          <span className="text-foreground font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Clock" size={16} className="text-muted-foreground mr-1" />
          </div>
          <p className="text-sm text-muted-foreground">Time Elapsed</p>
          <p className="text-lg font-semibold text-foreground">{formatTime(timeElapsed)}</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Timer" size={16} className="text-muted-foreground mr-1" />
          </div>
          <p className="text-sm text-muted-foreground">Est. Remaining</p>
          <p className="text-lg font-semibold text-foreground">{formatTime(estimatedTimeRemaining)}</p>
        </div>
      </div>

      {/* Current Card Info */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Card</p>
            <p className="text-foreground font-medium">
              Card {currentCard + 1}: {
                currentCard % 3 === 0 ? 'Concept' :
                currentCard % 3 === 1 ? 'Example': 'Practice'
              }
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon 
              name={
                currentCard % 3 === 0 ? 'BookOpen' :
                currentCard % 3 === 1 ? 'FileText': 'Brain'
              } 
              size={20} 
              className="text-primary"
            />
          </div>
        </div>
      </div>

      {/* Achievement Indicators */}
      {completedCards > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="text-sm text-foreground">
              {completedCards >= totalCards * 0.8 ? 'Excellent progress!' :
               completedCards >= totalCards * 0.5 ? 'Great work!': 'Keep going!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;