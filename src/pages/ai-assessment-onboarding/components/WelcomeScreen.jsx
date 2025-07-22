import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeScreen = ({ onStart }) => {
  const features = [
    {
      icon: 'Brain',
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your responses to understand your learning style'
    },
    {
      icon: 'Route',
      title: 'Personalized Path',
      description: 'Get a customized learning journey tailored to your strengths and goals'
    },
    {
      icon: 'TrendingUp',
      title: 'Adaptive Learning',
      description: 'Questions adjust in real-time based on your performance and progress'
    },
    {
      icon: 'Target',
      title: 'Focus Areas',
      description: 'Identify specific topics that need attention for maximum improvement'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl shadow-elevation-1 border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center">
            <Icon name="GraduationCap" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Welcome to AI Assessment
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Let's discover your learning style and create a personalized study plan just for you
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Assessment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">25-30</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">15-20</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={feature.icon} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-accent/10 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-accent)" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Before You Begin:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Find a quiet space where you can focus</li>
                  <li>• Answer questions honestly for the best results</li>
                  <li>• You can skip questions if you're unsure</li>
                  <li>• Take your time - there's no rush</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              variant="default"
              size="lg"
              onClick={onStart}
              iconName="ArrowRight"
              iconPosition="right"
              className="px-8"
            >
              Start Assessment
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Your responses are private and used only to personalize your learning experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;