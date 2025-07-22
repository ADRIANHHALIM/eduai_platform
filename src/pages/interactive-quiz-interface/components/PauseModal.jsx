import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PauseModal = ({ 
  isOpen, 
  onResume, 
  onExit,
  timeSpent 
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-lg border border-border shadow-elevation-3 animate-scale-in">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Pause" size={32} color="var(--color-primary)" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            Quiz Paused
          </h3>
          <p className="text-sm text-muted-foreground">
            Take your time. The timer is stopped.
          </p>
        </div>

        {/* Time Info */}
        <div className="px-6 pb-6">
          <div className="bg-muted/30 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Time Elapsed</p>
            <p className="text-2xl font-mono font-medium text-foreground">
              {formatTime(timeSpent)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border">
          <div className="space-y-3">
            <Button
              variant="default"
              onClick={onResume}
              fullWidth
              iconName="Play"
              iconPosition="left"
              iconSize={16}
            >
              Resume Quiz
            </Button>
            <Button
              variant="outline"
              onClick={onExit}
              fullWidth
              iconName="LogOut"
              iconPosition="left"
              iconSize={16}
            >
              Exit Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;