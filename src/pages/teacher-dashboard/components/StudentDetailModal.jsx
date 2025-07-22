import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentDetailModal = ({ student, isOpen, onClose, onScheduleSession, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !student) return null;

  const performanceHistory = [
    { date: '2025-01-15', math: 78, science: 82, english: 85 },
    { date: '2025-01-16', math: 82, science: 79, english: 88 },
    { date: '2025-01-17', math: 85, science: 84, english: 90 },
    { date: '2025-01-18', math: 88, science: 87, english: 92 },
    { date: '2025-01-19', math: 91, science: 89, english: 94 },
    { date: '2025-01-20', math: 89, science: 92, english: 96 },
    { date: '2025-01-21', math: 93, science: 94, english: 98 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quiz',
      title: 'Algebra Quiz #5',
      score: 92,
      timestamp: new Date(Date.now() - 300000),
      duration: '15 min'
    },
    {
      id: 2,
      type: 'study',
      title: 'Linear Equations Chapter',
      progress: 85,
      timestamp: new Date(Date.now() - 1800000),
      duration: '45 min'
    },
    {
      id: 3,
      type: 'help',
      title: 'Asked for help with Quadratic Equations',
      resolved: true,
      timestamp: new Date(Date.now() - 3600000),
      duration: '10 min'
    }
  ];

  const strengths = ['Problem Solving', 'Mathematical Reasoning', 'Quick Learning'];
  const weaknesses = ['Geometry Concepts', 'Word Problems', 'Time Management'];
  const recommendations = [
    'Focus on geometry visualization exercises',
    'Practice more word problem scenarios',
    'Use timer-based practice sessions'
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'performance', label: 'Performance', icon: 'BarChart3' },
    { id: 'activities', label: 'Activities', icon: 'Clock' },
    { id: 'insights', label: 'AI Insights', icon: 'Brain' }
  ];

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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz': return 'Brain';
      case 'study': return 'BookOpen';
      case 'help': return 'HelpCircle';
      default: return 'Circle';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Student Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-primary">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{student.name}</h3>
          <p className="text-muted-foreground">Student ID: {student.id}</p>
          <p className="text-sm text-muted-foreground">Last active: {formatTimeAgo(new Date(Date.now() - 300000))}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-foreground">{student.progress}%</p>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-foreground">87%</p>
          <p className="text-sm text-muted-foreground">Average Score</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-foreground">24</p>
          <p className="text-sm text-muted-foreground">Quizzes Taken</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2">Current Status</h4>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            student.status === 'online' ? 'bg-success' :
            student.status === 'studying' ? 'bg-primary' :
            student.status === 'needs-help' ? 'bg-warning' : 'bg-muted-foreground'
          }`}></div>
          <span className="text-sm text-foreground capitalize">{student.status.replace('-', ' ')}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{student.currentActivity}</p>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="h-64">
        <h4 className="font-semibold text-foreground mb-4">Performance Trend</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }} 
            />
            <Line type="monotone" dataKey="math" stroke="var(--color-primary)" strokeWidth={2} />
            <Line type="monotone" dataKey="science" stroke="var(--color-accent)" strokeWidth={2} />
            <Line type="monotone" dataKey="english" stroke="var(--color-warning)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Subject Performance</h4>
        {[
          { subject: 'Mathematics', score: 93, improvement: 15, color: 'bg-primary' },
          { subject: 'Science', score: 94, improvement: 12, color: 'bg-accent' },
          { subject: 'English', score: 98, improvement: 13, color: 'bg-warning' }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="font-medium text-foreground">{item.subject}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground">{item.score}%</span>
              <span className="text-sm text-success">+{item.improvement}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground">Recent Activities</h4>
      {recentActivities.map(activity => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name={getActivityIcon(activity.type)} size={14} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{activity.title}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
              <span className="text-sm text-muted-foreground">{activity.duration}</span>
              {activity.score && (
                <span className="text-sm text-success">{activity.score}%</span>
              )}
              {activity.progress && (
                <span className="text-sm text-primary">{activity.progress}% complete</span>
              )}
              {activity.resolved && (
                <span className="text-sm text-success">Resolved</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Strengths */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Strengths</h4>
        <div className="space-y-2">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-foreground">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Areas for Improvement</h4>
        <div className="space-y-2">
          {weaknesses.map((weakness, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <span className="text-sm text-foreground">{weakness}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">AI Recommendations</h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
              <span className="text-sm text-foreground">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-elevation-3 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Student Details</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(student)}
              iconName="MessageCircle"
              iconPosition="left"
            >
              Message
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onScheduleSession(student)}
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'activities' && renderActivities()}
          {activeTab === 'insights' && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;