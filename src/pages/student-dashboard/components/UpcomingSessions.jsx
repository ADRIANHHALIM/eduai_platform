import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingSessions = ({ sessions }) => {
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'tutoring': return 'UserCheck';
      case 'group': return 'Users';
      case 'assessment': return 'ClipboardCheck';
      default: return 'Calendar';
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'tutoring': return 'bg-primary/10 text-primary';
      case 'group': return 'bg-success/10 text-success';
      case 'assessment': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleJoinSession = (session) => {
    if (session.type === 'group') {
      navigate('/collaborative-whiteboard');
    } else {
      // For tutoring and assessment sessions, could navigate to a video call interface
      navigate('/collaborative-whiteboard');
    }
  };

  const isSessionSoon = (dateString) => {
    const sessionTime = new Date(dateString);
    const now = new Date();
    const timeDiff = sessionTime.getTime() - now.getTime();
    return timeDiff <= 30 * 60 * 1000 && timeDiff > 0; // Within 30 minutes
  };

  return (
    <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Sessions</h2>
        <Icon name="Calendar" size={20} className="text-primary" />
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="CalendarX" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No upcoming sessions</p>
          <p className="text-sm text-muted-foreground mt-1">Schedule a tutoring session to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
                isSessionSoon(session.dateTime)
                  ? 'bg-primary/5 border-primary/20' :'bg-muted/50 border-transparent hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSessionTypeColor(session.type)}`}>
                  <Icon name={getSessionTypeIcon(session.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{session.title}</h3>
                    {isSessionSoon(session.dateTime) && (
                      <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full">
                        Starting Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{session.subject}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {formatDate(session.dateTime)} at {formatTime(session.dateTime)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Icon name="User" size={12} className="mr-1" />
                      {session.tutor}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant={isSessionSoon(session.dateTime) ? "default" : "outline"}
                size="sm"
                onClick={() => handleJoinSession(session)}
                className="ml-4"
              >
                {isSessionSoon(session.dateTime) ? 'Join Now' : 'Join'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;