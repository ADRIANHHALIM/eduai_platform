import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeCard = ({ userName, currentStreak, todayGoal }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Ready to continue your learning journey?
          </p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Flame" size={16} color="white" />
              </div>
              <div>
                <p className="text-xs text-primary-foreground/80">Study Streak</p>
                <p className="text-lg font-semibold">{currentStreak} days</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Target" size={16} color="white" />
              </div>
              <div>
                <p className="text-xs text-primary-foreground/80">Today's Goal</p>
                <p className="text-lg font-semibold">{todayGoal} min</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <Icon name="BookOpen" size={32} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;