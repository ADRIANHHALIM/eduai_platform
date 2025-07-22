import React from 'react';

const QuizProgress = ({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions,
  flaggedQuestions 
}) => {
  const progressPercentage = ((currentQuestion - 1) / totalQuestions) * 100;
  
  return (
    <div className="bg-card border-b border-border px-4 py-3">
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-3">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground">
            Progress: {currentQuestion - 1}/{totalQuestions}
          </span>
          <span className="text-accent">
            Answered: {answeredQuestions.length}
          </span>
          <span className="text-warning">
            Flagged: {flaggedQuestions.length}
          </span>
        </div>
        
        <span className="text-muted-foreground">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
    </div>
  );
};

export default QuizProgress;