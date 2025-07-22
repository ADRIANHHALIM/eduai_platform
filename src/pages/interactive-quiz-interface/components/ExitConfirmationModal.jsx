import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExitConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirmExit, 
  progress 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-elevation-3 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                Exit Quiz?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your progress will be saved
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground">
            Are you sure you want to exit this quiz? You can resume from where you left off later.
          </p>

          {/* Progress Info */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Questions Answered</span>
              <span className="font-medium text-foreground">
                {progress.answered}/{progress.total}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time Spent</span>
              <span className="font-medium text-foreground">
                {Math.floor(progress.timeSpent / 60)}m {progress.timeSpent % 60}s
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.answered / progress.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent">
                Your answers and progress will be automatically saved. You can continue this quiz anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
              className="sm:w-auto"
            >
              Continue Quiz
            </Button>
            <Button
              variant="secondary"
              onClick={onConfirmExit}
              fullWidth
              className="sm:w-auto"
              iconName="LogOut"
              iconPosition="left"
              iconSize={16}
            >
              Exit & Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;