import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import SessionContextBar from '../../components/ui/SessionContextBar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import DrawingCanvas from './components/DrawingCanvas';
import DrawingToolbar from './components/DrawingToolbar';
import ParticipantPanel from './components/ParticipantPanel';
import VoiceChatPanel from './components/VoiceChatPanel';
import ChatPanel from './components/ChatPanel';
import SessionControls from './components/SessionControls';

const CollaborativeWhiteboard = () => {
  const navigate = useNavigate();
  
  // Canvas and drawing state
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#2563EB');
  const [currentThickness, setCurrentThickness] = useState(3);
  const [canvasData, setCanvasData] = useState(null);
  
  // UI state
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const [isParticipantPanelCollapsed, setIsParticipantPanelCollapsed] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  
  // Session state
  const [isRecording, setIsRecording] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(2700); // 45 minutes in seconds
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Mock participants data
  const participants = [
    {
      id: 'current-user',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      role: 'owner',
      cursor: { x: 250, y: 180 },
      currentTool: 'pen',
      color: '#2563EB',
      joinedAt: new Date(Date.now() - 1800000),
      isMuted: isMuted
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      role: 'participant',
      cursor: { x: 320, y: 240 },
      currentTool: 'text',
      color: '#059669',
      joinedAt: new Date(Date.now() - 900000),
      isMuted: false
    },
    {
      id: 'user3',
      name: 'Mike Rodriguez',
      email: 'mike.r@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      role: 'participant',
      cursor: { x: 180, y: 300 },
      currentTool: 'rectangle',
      color: '#DC2626',
      joinedAt: new Date(Date.now() - 600000),
      isMuted: false
    },
    {
      id: 'user4',
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      role: 'participant',
      cursor: null,
      currentTool: 'pen',
      color: '#7C3AED',
      joinedAt: new Date(Date.now() - 300000),
      isMuted: true
    }
  ];

  // Update session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setIsParticipantPanelCollapsed(true);
        setIsChatVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing tool handlers
  const handleToolChange = (tool) => {
    setCurrentTool(tool);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
  };

  const handleThicknessChange = (thickness) => {
    setCurrentThickness(thickness);
  };

  const handleCanvasUpdate = (data) => {
    setCanvasData(data);
    // Simulate real-time sync to other participants
    console.log('Canvas updated:', data);
  };

  // Session control handlers
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSaveSession = () => {
    console.log('Session saved');
    // Show success notification
  };

  const handleExportSession = (format) => {
    console.log('Exporting session as:', format);
    // Handle export logic
  };

  const handleEndSession = () => {
    console.log('Ending session');
    navigate('/student-dashboard');
  };

  // Voice chat handlers
  const handleToggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleDeafen = () => {
    setIsDeafened(!isDeafened);
  };

  // Participant handlers
  const handleInviteParticipant = (email) => {
    console.log('Inviting participant:', email);
    // Handle invite logic
  };

  const handleRemoveParticipant = (participantId) => {
    console.log('Removing participant:', participantId);
    // Handle remove logic
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    console.log('Undo action');
  };

  const handleRedo = () => {
    console.log('Redo action');
  };

  const handleClear = () => {
    console.log('Clear canvas');
  };

  const handleSave = () => {
    console.log('Save canvas');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Session Context Bar */}
      <SessionContextBar />

      {/* Main Content */}
      <div className={`pt-32 lg:pt-20 ${
        isToolbarCollapsed ? '' : 'lg:pl-16'
      } ${
        isParticipantPanelCollapsed ? '' : 'lg:pr-80'
      } ${
        isChatVisible && !isParticipantPanelCollapsed ? 'lg:pr-160' : ''
      } transition-all duration-300 ease-out`}>
        
        {/* Drawing Canvas */}
        <div className="h-screen pb-20 lg:pb-0">
          <DrawingCanvas
            currentTool={currentTool}
            currentColor={currentColor}
            currentThickness={currentThickness}
            isErasing={currentTool === 'eraser'}
            participants={participants}
            onCanvasUpdate={handleCanvasUpdate}
            canvasData={canvasData}
            isRecording={isRecording}
          />
        </div>
      </div>

      {/* Drawing Toolbar */}
      <DrawingToolbar
        currentTool={currentTool}
        onToolChange={handleToolChange}
        currentColor={currentColor}
        onColorChange={handleColorChange}
        currentThickness={currentThickness}
        onThicknessChange={handleThicknessChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        isCollapsed={isToolbarCollapsed}
        onToggleCollapse={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
      />

      {/* Participant Panel */}
      <ParticipantPanel
        participants={participants}
        isCollapsed={isParticipantPanelCollapsed}
        onToggleCollapse={() => setIsParticipantPanelCollapsed(!isParticipantPanelCollapsed)}
        onInviteParticipant={handleInviteParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        currentUserId="current-user"
      />

      {/* Voice Chat Panel */}
      <VoiceChatPanel
        participants={participants}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={handleToggleVoice}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isDeafened={isDeafened}
        onToggleDeafen={handleToggleDeafen}
        currentUserId="current-user"
      />

      {/* Chat Panel */}
      <ChatPanel
        participants={participants}
        isVisible={isChatVisible}
        onToggleVisibility={() => setIsChatVisible(!isChatVisible)}
        currentUserId="current-user"
      />

      {/* Session Controls */}
      <SessionControls
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        onSaveSession={handleSaveSession}
        onExportSession={handleExportSession}
        onEndSession={handleEndSession}
        sessionDuration={sessionDuration}
        participantCount={participants.filter(p => p.status === 'online').length}
      />

      {/* Bottom Navigation */}
      <BottomTabNavigation />

      {/* Quick Action Button */}
      <QuickActionButton />
    </div>
  );
};

export default CollaborativeWhiteboard;