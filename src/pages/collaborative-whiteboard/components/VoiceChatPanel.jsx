import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VoiceChatPanel = ({ 
  participants, 
  isVoiceEnabled, 
  onToggleVoice,
  isMuted,
  onToggleMute,
  isDeafened,
  onToggleDeafen,
  currentUserId = 'current-user'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioLevels, setAudioLevels] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Mock audio levels simulation
  useEffect(() => {
    if (!isVoiceEnabled) return;

    const interval = setInterval(() => {
      const newLevels = {};
      participants?.forEach(participant => {
        if (participant.status === 'online' && participant.id !== currentUserId) {
          // Simulate random audio levels
          newLevels[participant.id] = Math.random() * 100;
        }
      });
      setAudioLevels(newLevels);
    }, 100);

    return () => clearInterval(interval);
  }, [isVoiceEnabled, participants, currentUserId]);

  const getVoiceStatus = (participantId) => {
    const participant = participants?.find(p => p.id === participantId);
    if (!participant || participant.status !== 'online') return 'offline';
    if (participant.isMuted) return 'muted';
    if (audioLevels[participantId] > 30) return 'speaking';
    return 'connected';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'speaking': return 'text-success';
      case 'connected': return 'text-primary';
      case 'muted': return 'text-muted-foreground';
      case 'offline': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'speaking': return 'Mic';
      case 'connected': return 'Mic';
      case 'muted': return 'MicOff';
      case 'offline': return 'MicOff';
      default: return 'MicOff';
    }
  };

  if (!isVoiceEnabled) {
    return (
      <div className="fixed bottom-24 lg:bottom-6 left-4 z-40">
        <Button
          variant="outline"
          onClick={onToggleVoice}
          iconName="Phone"
          iconSize={20}
          className="shadow-elevation-2"
        >
          <span className="hidden sm:inline ml-2">Join Voice</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Voice Control Bar - Mobile */}
      <div className="lg:hidden fixed bottom-24 left-0 right-0 z-40 bg-card/90 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-error'
            }`} />
            <span className="text-sm text-muted-foreground">
              Voice {connectionStatus}
            </span>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={isMuted ? "destructive" : "ghost"}
              size="icon"
              onClick={onToggleMute}
              className="w-10 h-10"
            >
              <Icon name={isMuted ? "MicOff" : "Mic"} size={18} />
            </Button>
            
            <Button
              variant={isDeafened ? "destructive" : "ghost"}
              size="icon"
              onClick={onToggleDeafen}
              className="w-10 h-10"
            >
              <Icon name={isDeafened ? "VolumeX" : "Volume2"} size={18} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10"
            >
              <Icon name={isExpanded ? "ChevronDown" : "ChevronUp"} size={18} />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={onToggleVoice}
              className="w-10 h-10"
            >
              <Icon name="PhoneOff" size={18} />
            </Button>
          </div>
        </div>

        {/* Expanded Participants */}
        {isExpanded && (
          <div className="border-t border-border bg-card">
            <div className="p-4 space-y-3 max-h-40 overflow-y-auto">
              {participants?.filter(p => p.status === 'online').map((participant) => {
                const voiceStatus = getVoiceStatus(participant.id);
                return (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {voiceStatus === 'speaking' && (
                        <div className="absolute inset-0 rounded-full border-2 border-success animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {participant.name}
                        {participant.id === currentUserId && ' (You)'}
                      </p>
                    </div>
                    <Icon 
                      name={getStatusIcon(voiceStatus)} 
                      size={16} 
                      className={getStatusColor(voiceStatus)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Voice Panel - Desktop */}
      <div className="hidden lg:block fixed bottom-6 left-20 z-40">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-elevation-2 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-error'
              }`} />
              <h3 className="font-medium text-foreground">Voice Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? "ChevronDown" : "ChevronUp"} size={16} />
            </Button>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              onClick={onToggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              <Icon name={isMuted ? "MicOff" : "Mic"} size={20} />
            </Button>
            
            <Button
              variant={isDeafened ? "destructive" : "secondary"}
              size="icon"
              onClick={onToggleDeafen}
              title={isDeafened ? "Undeafen" : "Deafen"}
            >
              <Icon name={isDeafened ? "VolumeX" : "Volume2"} size={20} />
            </Button>

            <Button
              variant="destructive"
              onClick={onToggleVoice}
              iconName="PhoneOff"
              iconSize={20}
            >
              Leave Voice
            </Button>
          </div>

          {/* Participants List */}
          {isExpanded && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                In Voice ({participants?.filter(p => p.status === 'online').length})
              </h4>
              {participants?.filter(p => p.status === 'online').map((participant) => {
                const voiceStatus = getVoiceStatus(participant.id);
                const audioLevel = audioLevels[participant.id] || 0;
                
                return (
                  <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="relative">
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {voiceStatus === 'speaking' && (
                        <div className="absolute inset-0 rounded-full border-2 border-success animate-pulse" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {participant.name}
                        {participant.id === currentUserId && ' (You)'}
                      </p>
                      
                      {/* Audio Level Indicator */}
                      {voiceStatus === 'speaking' && (
                        <div className="w-full bg-muted rounded-full h-1 mt-1">
                          <div 
                            className="bg-success h-1 rounded-full transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Icon 
                      name={getStatusIcon(voiceStatus)} 
                      size={16} 
                      className={getStatusColor(voiceStatus)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Voice Quality Indicator */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Connection Quality</span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-3 bg-success rounded-full" />
                <div className="w-1 h-3 bg-success rounded-full" />
                <div className="w-1 h-3 bg-success rounded-full" />
                <div className="w-1 h-3 bg-muted rounded-full" />
                <span className="ml-1">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceChatPanel;