import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubjectTransition = ({ subject, onContinue, questionsRemaining, timeEstimate }) => {
  const subjectConfig = {
    Math: {
      icon: 'Calculator',
      color: 'blue',
      description: 'Test your mathematical reasoning and problem-solving skills',
      topics: ['Algebra', 'Geometry', 'Statistics', 'Calculus']
    },
    Science: {
      icon: 'Atom',
      color: 'green',
      description: 'Explore your understanding of scientific concepts and principles',
      topics: ['Physics', 'Chemistry', 'Biology', 'Earth Science']
    },
    English: {
      icon: 'BookOpen',
      color: 'purple',
      description: 'Evaluate your language comprehension and communication skills',
      topics: ['Reading Comprehension', 'Grammar', 'Writing', 'Literature']
    },
    History: {
      icon: 'Scroll',
      color: 'orange',
      description: 'Assess your knowledge of historical events and analysis',
      topics: ['World History', 'American History', 'Government', 'Geography']
    }
  };

  const config = subjectConfig[subject] || subjectConfig.Math;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-card rounded-2xl shadow-elevation-1 border border-border p-8 text-center">
        {/* Subject Icon */}
        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
          config.color === 'blue' ? 'bg-blue-100' :
          config.color === 'green' ? 'bg-green-100' :
          config.color === 'purple'? 'bg-purple-100' : 'bg-orange-100'
        }`}>
          <Icon 
            name={config.icon} 
            size={32} 
            color={
              config.color === 'blue' ? '#2563EB' :
              config.color === 'green' ? '#059669' :
              config.color === 'purple'? '#7C3AED' : '#D97706'
            }
          />
        </div>

        {/* Subject Title */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {subject} Assessment
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {config.description}
        </p>

        {/* Assessment Info */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{questionsRemaining}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{timeEstimate}</p>
              <p className="text-xs text-muted-foreground">Est. Time</p>
            </div>
          </div>
        </div>

        {/* Topics Covered */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-foreground mb-3">Topics Covered:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {config.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          variant="default"
          size="lg"
          onClick={onContinue}
          iconName="ArrowRight"
          iconPosition="right"
          className="w-full"
        >
          Start {subject} Questions
        </Button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={16} color="var(--color-accent)" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground mb-1">Assessment Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Take your time to read each question carefully</li>
                <li>• You can skip difficult questions and return later</li>
                <li>• The AI adapts to your responses in real-time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTransition;