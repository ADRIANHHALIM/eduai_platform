import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SessionContextBar from '../../components/ui/SessionContextBar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ClassRosterSidebar from './components/ClassRosterSidebar';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ActivityFeed from './components/ActivityFeed';
import StudentDetailModal from './components/StudentDetailModal';

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);

  // Mock students data
  const students = [
    {
      id: 'STU001',
      name: 'Emma Wilson',
      status: 'online',
      currentActivity: 'Solving Algebra Quiz #5',
      progress: 92,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU002',
      name: 'James Chen',
      status: 'needs-help',
      currentActivity: 'Stuck on Linear Equations',
      progress: 78,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU003',
      name: 'Sarah Davis',
      status: 'studying',
      currentActivity: 'Reading Physics Chapter 3',
      progress: 85,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU004',
      name: 'Michael Brown',
      status: 'online',
      currentActivity: 'Chemistry Lab Simulation',
      progress: 88,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU005',
      name: 'Lisa Johnson',
      status: 'needs-help',
      currentActivity: 'Math Practice Problems',
      progress: 45,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU006',
      name: 'David Kim',
      status: 'offline',
      currentActivity: 'Last seen 2 hours ago',
      progress: 76,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU007',
      name: 'Rachel Martinez',
      status: 'studying',
      currentActivity: 'English Literature Essay',
      progress: 94,
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'STU008',
      name: 'Alex Thompson',
      status: 'online',
      currentActivity: 'History Timeline Project',
      progress: 82,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Mock class data
  const classData = {
    totalStudents: 32,
    activeStudents: 28,
    averageProgress: 83,
    completionRate: 92,
    helpRequests: 12
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleStudentDetail = (student) => {
    setModalStudent(student);
    setShowStudentModal(true);
  };

  const handleMessageStudent = (student) => {
    console.log('Messaging student:', student.name);
    // Implement messaging functionality
  };

  const handleScheduleSession = (student) => {
    console.log('Scheduling session with:', student.name);
    // Implement session scheduling functionality
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  // Auto-select first student on load
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionContextBar />
      
      <div className="pt-16 lg:pt-16">
        <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Class Roster */}
          <div className="hidden lg:block">
            <ClassRosterSidebar
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={handleStudentSelect}
              onMessageStudent={handleMessageStudent}
            />
          </div>

          {/* Main Content - Performance Analytics */}
          <PerformanceAnalytics
            classData={classData}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />

          {/* Right Sidebar - Activity Feed */}
          <div className="hidden xl:block">
            <ActivityFeed
              onScheduleSession={handleScheduleSession}
              onSendMessage={handleMessageStudent}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile tabs would go here for switching between roster, analytics, and activity */}
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border">
          <div className="flex">
            <button className="flex-1 py-3 text-center text-sm font-medium text-primary border-b-2 border-primary">
              Analytics
            </button>
            <button className="flex-1 py-3 text-center text-sm font-medium text-muted-foreground">
              Students
            </button>
            <button className="flex-1 py-3 text-center text-sm font-medium text-muted-foreground">
              Activity
            </button>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={modalStudent}
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onScheduleSession={handleScheduleSession}
        onSendMessage={handleMessageStudent}
      />

      <BottomTabNavigation />
      <QuickActionButton />
    </div>
  );
};

export default TeacherDashboard;