import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizSidebar = ({ 
  questions, 
  currentQuestion, 
  answeredQuestions, 
  flaggedQuestions, 
  onQuestionSelect,
  isVisible,
  onToggle 
}) => {
  const getQuestionStatus = (questionIndex) => {
    const questionNumber = questionIndex + 1;
    if (questionNumber === currentQuestion) return 'current';
    if (answeredQuestions.includes(questionNumber)) return 'answered';
    if (flaggedQuestions.includes(questionNumber)) return 'flagged';
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-primary text-primary-foreground';
      case 'answered': return 'bg-success text-success-foreground';
      case 'flagged': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return 'Check';
      case 'flagged': return 'Flag';
      default: return null;
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="lg:hidden fixed top-20 right-4 z-40 bg-card shadow-elevation-2"
      >
        <Icon name={isVisible ? "X" : "Grid3X3"} size={20} />
      </Button>

      {/* Sidebar */}
      <div className={`fixed lg:relative top-0 right-0 h-full w-80 bg-card border-l border-border transform transition-transform duration-300 ease-in-out z-30 ${
        isVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Quiz Overview</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          {/* Progress Summary */}
          <div className="bg-muted/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Answered</span>
              <span className="font-medium text-success">
                {answeredQuestions.length}/{questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Flagged</span>
              <span className="font-medium text-warning">
                {flaggedQuestions.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium text-foreground">
                {questions.length - answeredQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Grid */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Questions</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const questionNumber = index + 1;
                const status = getQuestionStatus(index);
                const statusIcon = getStatusIcon(status);
                
                return (
                  <button
                    key={questionNumber}
                    onClick={() => onQuestionSelect(questionNumber)}
                    className={`relative w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${getStatusColor(status)}`}
                  >
                    {statusIcon ? (
                      <Icon name={statusIcon} size={16} className="mx-auto" />
                    ) : (
                      questionNumber
                    )}
                    
                    {status === 'current' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-success rounded flex items-center justify-center">
                  <Icon name="Check" size={10} color="white" />
                </div>
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-warning rounded flex items-center justify-center">
                  <Icon name="Flag" size={10} color="white" />
                </div>
                <span className="text-muted-foreground">Flagged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <span className="text-muted-foreground">Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isVisible && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-20"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default QuizSidebar;