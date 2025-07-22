import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ subjects }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-error';
  };

  const getSubjectIcon = (subject) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return 'Calculator';
      case 'physics': return 'Atom';
      case 'chemistry': return 'FlaskConical';
      case 'biology': return 'Dna';
      case 'english': return 'BookOpen';
      case 'history': return 'Scroll';
      default: return 'Book';
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Progress Overview</h2>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getSubjectIcon(subject.name)} size={16} className="text-primary" />
                </div>
                <h3 className="font-medium text-foreground text-sm">{subject.name}</h3>
              </div>
              <span className={`text-sm font-semibold ${getProgressColor(subject.progress)}`}>
                {subject.progress}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    subject.progress >= 80 ? 'bg-success' :
                    subject.progress >= 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>{subject.completedTopics}/{subject.totalTopics} topics</span>
              <span>{subject.weeklyHours}h this week</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOverview;