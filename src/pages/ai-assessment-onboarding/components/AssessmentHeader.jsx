import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentHeader = ({ currentStep, totalSteps, onExit }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-subtle">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="GraduationCap" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Assessment</h1>
            <p className="text-xs text-muted-foreground -mt-1">Personalized Learning Path</p>
          </div>
        </div>

        {/* Progress Info */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-sm font-medium text-foreground">
              {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="w-32">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Exit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          iconName="X"
          iconSize={16}
        >
          <span className="hidden sm:inline ml-1">Exit</span>
        </Button>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHeader;