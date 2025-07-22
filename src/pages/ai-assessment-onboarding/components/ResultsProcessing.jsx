import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsProcessing = ({ assessmentData }) => {
  const navigate = useNavigate();
  const [processingStep, setProcessingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const processingSteps = [
    {
      icon: 'Brain',
      title: 'Analyzing Responses',
      description: 'AI is evaluating your answers and identifying patterns',
      duration: 2000
    },
    {
      icon: 'TrendingUp',
      title: 'Identifying Strengths',
      description: 'Discovering your academic strengths and preferred learning style',
      duration: 2500
    },
    {
      icon: 'Target',
      title: 'Finding Focus Areas',
      description: 'Pinpointing areas that need additional attention and practice',
      duration: 2000
    },
    {
      icon: 'Route',
      title: 'Creating Learning Path',
      description: 'Designing your personalized study plan and recommendations',
      duration: 3000
    }
  ];

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
      }
      setIsComplete(true);
    };

    processSteps();
  }, []);

  const handleViewResults = () => {
    navigate('/student-dashboard');
  };

  if (isComplete) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-card rounded-2xl shadow-elevation-1 border border-border p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-2xl flex items-center justify-center">
            <Icon name="CheckCircle" size={32} color="var(--color-success)" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Assessment Complete!
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your personalized learning path has been created. Ready to start your AI-powered learning journey?
          </p>

          {/* Results Summary */}
          <div className="bg-muted rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{assessmentData?.totalQuestions || 24}</p>
                <p className="text-xs text-muted-foreground">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{assessmentData?.accuracy || '78%'}</p>
                <p className="text-xs text-muted-foreground">Overall Accuracy</p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="text-left mb-8">
            <h3 className="text-sm font-medium text-foreground mb-4">Key Insights:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Icon name="TrendingUp" size={16} color="var(--color-success)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Strong in Mathematics</p>
                  <p className="text-xs text-muted-foreground">Algebra and geometry concepts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="Target" size={16} color="var(--color-warning)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Focus on Science</p>
                  <p className="text-xs text-muted-foreground">Physics and chemistry fundamentals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="BookOpen" size={16} color="var(--color-accent)" />
                <div>
                  <p className="text-sm font-medium text-foreground">Visual Learner</p>
                  <p className="text-xs text-muted-foreground">Responds well to diagrams and examples</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="default"
            size="lg"
            onClick={handleViewResults}
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full"
          >
            View My Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-2xl shadow-elevation-1 border border-border p-8 text-center">
        {/* Processing Animation */}
        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
          <div className="animate-spin">
            <Icon name={processingSteps[processingStep].icon} size={32} color="var(--color-primary)" />
          </div>
        </div>

        {/* Current Step */}
        <h2 className="text-xl font-bold text-foreground mb-3">
          {processingSteps[processingStep].title}
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {processingSteps[processingStep].description}
        </p>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {processingSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < processingStep ? 'bg-success text-white' :
                index === processingStep ? 'bg-primary text-white': 'bg-muted text-muted-foreground'
              }`}>
                {index < processingStep ? (
                  <Icon name="Check" size={16} />
                ) : index === processingStep ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <div className="text-left flex-1">
                <p className={`text-sm font-medium ${
                  index <= processingStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Processing Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          This may take a few moments while we personalize your experience...
        </p>
      </div>
    </div>
  );
};

export default ResultsProcessing;