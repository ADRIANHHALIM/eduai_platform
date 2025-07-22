import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceAnalytics = ({ classData, selectedTimeframe, onTimeframeChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const performanceData = [
    { subject: 'Math', average: 85, improvement: 12 },
    { subject: 'Science', average: 78, improvement: 8 },
    { subject: 'English', average: 92, improvement: 5 },
    { subject: 'History', average: 76, improvement: 15 },
    { subject: 'Physics', average: 82, improvement: -3 }
  ];

  const weeklyProgress = [
    { week: 'Week 1', completed: 45, accuracy: 78 },
    { week: 'Week 2', completed: 52, accuracy: 82 },
    { week: 'Week 3', completed: 48, accuracy: 85 },
    { week: 'Week 4', completed: 58, accuracy: 88 }
  ];

  const engagementData = [
    { name: 'Active', value: 65, color: '#10B981' },
    { name: 'Moderate', value: 25, color: '#F59E0B' },
    { name: 'Low', value: 10, color: '#EF4444' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen' },
    { id: 'engagement', label: 'Engagement', icon: 'Users' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: '83%', change: '+5%', icon: 'TrendingUp', color: 'text-success' },
          { label: 'Completion Rate', value: '92%', change: '+8%', icon: 'CheckCircle', color: 'text-success' },
          { label: 'Active Students', value: '28/32', change: '+2', icon: 'Users', color: 'text-primary' },
          { label: 'Help Requests', value: '12', change: '-3', icon: 'HelpCircle', color: 'text-warning' }
        ].map((metric, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={metric.icon} size={16} className={metric.color} />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
              <span className={`text-xs ${metric.color}`}>{metric.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="completed" stroke="var(--color-primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="accuracy" stroke="var(--color-accent)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Subject Performance</h3>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="subject" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="average" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Subject Details */}
      <div className="space-y-3">
        {performanceData.map((subject, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={16} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">{subject.subject}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Avg: {subject.average}%</span>
              <span className={`text-sm ${subject.improvement >= 0 ? 'text-success' : 'text-error'}`}>
                {subject.improvement >= 0 ? '+' : ''}{subject.improvement}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Student Engagement</h3>
      <div className="flex items-center justify-center h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={engagementData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {engagementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {engagementData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-foreground">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground">Class 10A - Mathematics & Science</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export
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
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'engagement' && renderEngagement()}
        {activeTab === 'trends' && renderOverview()}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;