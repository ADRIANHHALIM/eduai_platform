import React from 'react';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  onPrevious, 
  onNext, 
  onSkip, 
  canGoBack, 
  canGoNext, 
  isLastQuestion,
  selectedAnswer,
  showFeedback,
  isLoading
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between space-x-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="default"
          onClick={onPrevious}
          disabled={!canGoBack || isLoading}
          iconName="ChevronLeft"
          iconPosition="left"
          className="min-w-[100px]"
        >
          Previous
        </Button>

        {/* Skip Button */}
        {!showFeedback && (
          <Button
            variant="ghost"
            size="default"
            onClick={onSkip}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Question
          </Button>
        )}

        {/* Next/Submit Button */}
        <Button
          variant="default"
          size="default"
          onClick={onNext}
          disabled={(!selectedAnswer && !showFeedback) || isLoading}
          loading={isLoading}
          iconName={isLastQuestion ? "Check" : "ChevronRight"}
          iconPosition="right"
          className="min-w-[100px]"
        >
          {isLastQuestion ? 'Complete' : 'Next'}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center mt-4">
        {!selectedAnswer && !showFeedback && (
          <p className="text-xs text-muted-foreground">
            Select an answer to continue, or skip if you're unsure
          </p>
        )}
        {selectedAnswer && !showFeedback && (
          <p className="text-xs text-muted-foreground">
            Click Next to see the explanation and continue
          </p>
        )}
        {showFeedback && (
          <p className="text-xs text-muted-foreground">
            {isLastQuestion ? 'Click Complete to finish the assessment' : 'Click Next to continue to the next question'}
          </p>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;