import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionButton = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Determine visibility and actions based on current path
  const getContextualActions = () => {
    const path = location.pathname;
    
    if (path.includes('/student-dashboard')) {
      return {
        show: true,
        primary: { icon: 'MessageCircle', label: 'AI Tutor', action: 'chat' },
        secondary: [
          { icon: 'BookOpen', label: 'Quick Study', action: 'study' },
          { icon: 'Brain', label: 'Practice Quiz', action: 'quiz' }
        ]
      };
    }
    
    if (path.includes('/personalized-study-session')) {
      return {
        show: true,
        primary: { icon: 'MessageCircle', label: 'Ask AI', action: 'chat' },
        secondary: [
          { icon: 'Bookmark', label: 'Save Progress', action: 'save' },
          { icon: 'RotateCcw', label: 'Review', action: 'review' }
        ]
      };
    }
    
    if (path.includes('/interactive-quiz-interface')) {
      return {
        show: true,
        primary: { icon: 'HelpCircle', label: 'Hint', action: 'hint' },
        secondary: [
          { icon: 'MessageCircle', label: 'Ask AI', action: 'chat' },
          { icon: 'Flag', label: 'Flag Question', action: 'flag' }
        ]
      };
    }
    
    if (path.includes('/collaborative-whiteboard')) {
      return {
        show: true,
        primary: { icon: 'MessageCircle', label: 'Group Chat', action: 'chat' },
        secondary: [
          { icon: 'Share', label: 'Share Screen', action: 'share' },
          { icon: 'Camera', label: 'Screenshot', action: 'screenshot' }
        ]
      };
    }
    
    if (path.includes('/teacher-dashboard')) {
      return {
        show: true,
        primary: { icon: 'Plus', label: 'Quick Add', action: 'add' },
        secondary: [
          { icon: 'Users', label: 'Message Students', action: 'message' },
          { icon: 'BarChart3', label: 'Quick Report', action: 'report' }
        ]
      };
    }
    
    return { show: false };
  };

  const contextActions = getContextualActions();

  const handlePrimaryAction = () => {
    const action = contextActions.primary?.action;
    
    switch (action) {
      case 'chat':
        setShowChat(true);
        break;
      case 'hint': console.log('Show hint for current question');
        break;
      case 'add': console.log('Quick add menu');
        break;
      default:
        console.log('Primary action:', action);
    }
    
    setIsExpanded(false);
  };

  const handleSecondaryAction = (action) => {
    switch (action) {
      case 'study': console.log('Navigate to quick study');
        break;
      case 'quiz': console.log('Navigate to practice quiz');
        break;
      case 'save': console.log('Save current progress');
        break;
      case 'review': console.log('Review previous topics');
        break;
      case 'flag': console.log('Flag current question');
        break;
      case 'share': console.log('Share screen');
        break;
      case 'screenshot': console.log('Take screenshot');
        break;
      case 'message': console.log('Message students');
        break;
      case 'report': console.log('Generate quick report');
        break;
      default:
        console.log('Secondary action:', action);
    }
    
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!contextActions.show) {
    return null;
  }

  return (
    <>
      {/* Quick Action Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50">
        {/* Secondary Actions */}
        {isExpanded && contextActions.secondary && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-scale-in">
            {contextActions.secondary.map((action, index) => (
              <div
                key={action.action}
                className="flex items-center space-x-3"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleSecondaryAction(action.action)}
                  className="w-12 h-12 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200"
                >
                  <Icon name={action.icon} size={20} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="relative">
          <Button
            variant="default"
            size="icon"
            onClick={contextActions.secondary ? toggleExpanded : handlePrimaryAction}
            className="w-14 h-14 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 hover:scale-105"
          >
            <Icon 
              name={isExpanded ? "X" : contextActions.primary.icon} 
              size={24} 
            />
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
              {contextActions.primary.label}
            </span>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end lg:items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-t-2xl lg:rounded-2xl shadow-elevation-3 animate-slide-in-right lg:animate-scale-in">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={16} color="white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">AI Tutor</h3>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="h-96 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={12} color="white" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-foreground">
                      Hi! I'm your AI tutor. How can I help you with your studies today?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <Button size="icon" variant="default">
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionButton;