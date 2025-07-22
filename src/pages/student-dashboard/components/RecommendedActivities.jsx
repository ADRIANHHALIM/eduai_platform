import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendedActivities = ({ activities }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'study': return 'BookOpen';
      case 'quiz': return 'Brain';
      case 'review': return 'RotateCcw';
      case 'practice': return 'PenTool';
      default: return 'BookOpen';
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'study': navigate('/personalized-study-session');
        break;
      case 'quiz': navigate('/interactive-quiz-interface');
        break;
      case 'review': navigate('/personalized-study-session');
        break;
      case 'practice': navigate('/interactive-quiz-interface');
        break;
      default:
        navigate('/personalized-study-session');
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Today's Recommendations</h2>
        <Icon name="Sparkles" size={20} className="text-primary" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-150"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={getActivityIcon(activity.type)} size={20} className="text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{activity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                    {activity.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {activity.estimatedTime} min
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Icon name="Award" size={12} className="mr-1" />
                    +{activity.points} XP
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => handleActivityClick(activity)}
              className="ml-4"
            >
              Start
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedActivities;