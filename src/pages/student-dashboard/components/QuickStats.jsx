import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      id: 'totalHours',
      label: 'Study Hours',
      value: stats.totalHours,
      unit: 'hrs',
      icon: 'Clock',
      color: 'text-primary bg-primary/10',
      trend: stats.hoursTrend
    },
    {
      id: 'completedQuizzes',
      label: 'Quizzes Completed',
      value: stats.completedQuizzes,
      unit: '',
      icon: 'Brain',
      color: 'text-success bg-success/10',
      trend: stats.quizzesTrend
    },
    {
      id: 'averageScore',
      label: 'Average Score',
      value: stats.averageScore,
      unit: '%',
      icon: 'Award',
      color: 'text-warning bg-warning/10',
      trend: stats.scoreTrend
    },
    {
      id: 'currentRank',
      label: 'Class Rank',
      value: stats.currentRank,
      unit: `/${stats.totalStudents}`,
      icon: 'Trophy',
      color: 'text-accent bg-accent/10',
      trend: stats.rankTrend
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const formatTrend = (trend) => {
    if (trend === 0) return '0';
    return trend > 0 ? `+${trend}` : `${trend}`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat) => (
        <div key={stat.id} className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Icon name={stat.icon} size={16} />
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(stat.trend)} 
                size={12} 
                className={getTrendColor(stat.trend)} 
              />
              <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                {formatTrend(stat.trend)}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              {stat.unit && (
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;