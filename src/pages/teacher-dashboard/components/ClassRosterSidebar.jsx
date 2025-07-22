import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassRosterSidebar = ({ students, selectedStudent, onStudentSelect, onMessageStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-success bg-success/10';
      case 'studying': return 'text-primary bg-primary/10';
      case 'needs-help': return 'text-warning bg-warning/10';
      case 'offline': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'Circle';
      case 'studying': return 'BookOpen';
      case 'needs-help': return 'AlertCircle';
      case 'offline': return 'Circle';
      default: return 'Circle';
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Class Roster</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', count: students.length },
            { key: 'online', label: 'Online', count: students.filter(s => s.status === 'online').length },
            { key: 'needs-help', label: 'Help', count: students.filter(s => s.status === 'needs-help').length }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filterStatus === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              onClick={() => onStudentSelect(student)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                selectedStudent?.id === student.id
                  ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${getStatusColor(student.status)}`}>
                      <Icon name={getStatusIcon(student.status)} size={8} />
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.currentActivity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {student.status === 'needs-help' && (
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessageStudent(student);
                    }}
                    className="w-6 h-6"
                  >
                    <Icon name="MessageCircle" size={12} />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full mb-2" iconName="UserPlus" iconPosition="left">
          Add Student
        </Button>
        <Button variant="ghost" size="sm" className="w-full" iconName="Download" iconPosition="left">
          Export Roster
        </Button>
      </div>
    </div>
  );
};

export default ClassRosterSidebar;