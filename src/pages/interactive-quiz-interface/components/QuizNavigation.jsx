import React from 'react';

import Button from '../../../components/ui/Button';

const QuizNavigation = ({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit,
  canGoNext,
  canGoPrevious,
  isLastQuestion 
}) => {
  return (
    <div className="bg-card border-t border-border px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          iconName="ChevronLeft"
          iconPosition="left"
          iconSize={16}
        >
          Previous
        </Button>

        {/* Question Counter */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        {/* Next/Submit Button */}
        {isLastQuestion ? (
          <Button
            variant="default"
            onClick={onSubmit}
            iconName="Check"
            iconPosition="right"
            iconSize={16}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNext}
            disabled={!canGoNext}
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation;