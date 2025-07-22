import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on certain screens for distraction-free learning
  const hiddenPaths = [
    '/interactive-quiz-interface',
    '/personalized-study-session',
    '/ai-assessment-onboarding'
  ];

  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path));

  const tabItems = [
    {
      label: 'Dashboard',
      path: '/student-dashboard',
      icon: 'Home',
      activeIcon: 'Home'
    },
    {
      label: 'Learn',
      path: '/personalized-study-session',
      icon: 'BookOpen',
      activeIcon: 'BookOpen'
    },
    {
      label: 'Quiz',
      path: '/interactive-quiz-interface',
      icon: 'Brain',
      activeIcon: 'Brain'
    },
    {
      label: 'Collaborate',
      path: '/collaborative-whiteboard',
      icon: 'Users',
      activeIcon: 'Users'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    return location.pathname === path || 
           (path === '/student-dashboard' && location.pathname === '/');
  };

  if (shouldHide) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border backdrop-blur-subtle">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {tabItems.map((item) => {
          const isActive = isActivePath(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-all duration-150 ease-out ${
                isActive 
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon 
                  name={isActive ? item.activeIcon : item.icon} 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-150 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;