import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, Menu, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/login');
    }
  };

  // Preview mode banner when not authenticated
  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-primary">
                EduPlatform
              </Link>
              <div className="hidden lg:block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Preview Mode
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button className="lg:hidden">
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            
            <Link to="/" className="text-xl font-bold text-primary">
              EduPlatform
            </Link>

            {/* Welcome text */}
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{userProfile?.full_name || user?.email}</span>
              </p>
            </div>
          </div>

          {/* Center Section - Search (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                placeholder="Search topics, quizzes, or sessions..."
                className="w-full bg-muted border-0 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="hidden lg:block text-sm font-medium text-foreground">
                  {userProfile?.full_name?.split(' ')[0] || 'User'}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{userProfile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-primary capitalize">{userProfile?.role}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;