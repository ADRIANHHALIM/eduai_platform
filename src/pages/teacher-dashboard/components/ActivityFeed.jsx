import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = ({ onScheduleSession, onSendMessage }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'quiz_completed',
      student: 'Emma Wilson',
      action: 'completed Math Quiz #5',
      score: '92%',
      timestamp: new Date(Date.now() - 300000),
      priority: 'normal'
    },
    {
      id: 2,
      type: 'help_request',
      student: 'James Chen',
      action: 'requested help with Algebra',
      topic: 'Linear Equations',
      timestamp: new Date(Date.now() - 600000),
      priority: 'high'
    },
    {
      id: 3,
      type: 'session_joined',
      student: 'Sarah Davis',
      action: 'joined collaborative session',
      session: 'Physics Study Group',
      timestamp: new Date(Date.now() - 900000),
      priority: 'normal'
    },
    {
      id: 4,
      type: 'assignment_submitted',
      student: 'Michael Brown',
      action: 'submitted Chemistry Lab Report',
      status: 'pending_review',
      timestamp: new Date(Date.now() - 1200000),
      priority: 'normal'
    },
    {
      id: 5,
      type: 'low_performance',
      student: 'Lisa Johnson',
      action: 'scored below threshold',
      subject: 'Mathematics',
      score: '45%',
      timestamp: new Date(Date.now() - 1800000),
      priority: 'high'
    },
    {
      id: 6,
      type: 'milestone_achieved',
      student: 'David Kim',
      action: 'completed 50 practice problems',
      subject: 'Physics',
      timestamp: new Date(Date.now() - 2400000),
      priority: 'normal'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: 'Algebra Review Session',
      time: '2:00 PM',
      date: 'Today',
      students: 8,
      type: 'group'
    },
    {
      id: 2,
      title: '1-on-1 with Emma Wilson',
      time: '3:30 PM',
      date: 'Today',
      students: 1,
      type: 'individual'
    },
    {
      id: 3,
      title: 'Physics Problem Solving',
      time: '10:00 AM',
      date: 'Tomorrow',
      students: 12,
      type: 'group'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz_completed': return 'CheckCircle';
      case 'help_request': return 'HelpCircle';
      case 'session_joined': return 'Users';
      case 'assignment_submitted': return 'FileText';
      case 'low_performance': return 'AlertTriangle';
      case 'milestone_achieved': return 'Trophy';
      default: return 'Circle';
    }
  };

  const getActivityColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    switch (type) {
      case 'quiz_completed': return 'text-success';
      case 'help_request': return 'text-warning';
      case 'session_joined': return 'text-primary';
      case 'assignment_submitted': return 'text-accent';
      case 'milestone_achieved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return activity.priority === 'high';
    return activity.type === activeFilter;
  });

  const filters = [
    { key: 'all', label: 'All', count: activities.length },
    { key: 'urgent', label: 'Urgent', count: activities.filter(a => a.priority === 'high').length },
    { key: 'help_request', label: 'Help', count: activities.filter(a => a.type === 'help_request').length }
  ];

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Activity Feed</h2>
        
        {/* Filters */}
        <div className="flex space-x-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeFilter === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredActivities.map(activity => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border transition-all duration-150 hover:shadow-sm ${
                activity.priority === 'high' ?'border-error/20 bg-error/5' :'border-border bg-card'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.priority === 'high' ? 'bg-error/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={getActivityIcon(activity.type)} 
                    size={14} 
                    className={getActivityColor(activity.type, activity.priority)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.student}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.action}
                  </p>
                  
                  {activity.score && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Score: {activity.score}
                      </span>
                    </div>
                  )}
                  
                  {activity.topic && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                        {activity.topic}
                      </span>
                    </div>
                  )}
                  
                  {activity.priority === 'high' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onSendMessage(activity.student)}
                        iconName="MessageCircle"
                        iconSize={12}
                      >
                        Message
                      </Button>
                      <Button
                        variant="default"
                        size="xs"
                        onClick={() => onScheduleSession(activity.student)}
                        iconName="Calendar"
                        iconSize={12}
                      >
                        Schedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="border-t border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Upcoming Sessions</h3>
            <Button variant="ghost" size="xs" iconName="Plus" iconSize={12}>
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {upcomingSessions.slice(0, 3).map(session => (
              <div key={session.id} className="p-2 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={session.type === 'group' ? 'Users' : 'User'} 
                      size={12} 
                      className="text-primary" 
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {session.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {session.students}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {session.date} at {session.time}
                </p>
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-3" iconName="Calendar" iconPosition="left">
            View All Sessions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;