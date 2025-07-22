import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ParticipantPanel = ({ 
  participants, 
  isCollapsed, 
  onToggleCollapse,
  onInviteParticipant,
  onRemoveParticipant,
  currentUserId = 'current-user'
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock participants data
  const mockParticipants = [
    {
      id: 'current-user',
      name: 'You',
      email: 'alex.chen@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      role: 'owner',
      cursor: { x: 250, y: 180 },
      currentTool: 'pen',
      color: '#2563EB',
      joinedAt: new Date(Date.now() - 1800000) // 30 minutes ago
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
      joinedAt: new Date(Date.now() - 900000) // 15 minutes ago
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
      joinedAt: new Date(Date.now() - 600000) // 10 minutes ago
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
      joinedAt: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ];

  const allParticipants = participants || mockParticipants;
  const onlineCount = allParticipants.filter(p => p.status === 'online').length;

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteParticipant?.(inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const getToolIcon = (tool) => {
    const toolIcons = {
      pen: 'Pen',
      eraser: 'Eraser',
      text: 'Type',
      rectangle: 'Square',
      circle: 'Circle',
      line: 'Minus',
      arrow: 'ArrowRight',
      pan: 'Move'
    };
    return toolIcons[tool] || 'Pen';
  };

  const formatJoinTime = (joinedAt) => {
    const now = new Date();
    const diff = Math.floor((now - joinedAt) / 60000); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="default"
          size="icon"
          onClick={onToggleCollapse}
          className="w-12 h-12 shadow-elevation-2 relative"
        >
          <Icon name="Users" size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground text-xs rounded-full flex items-center justify-center">
            {onlineCount}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Panel - Slide up from bottom */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border backdrop-blur-subtle max-h-80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} />
            <h3 className="font-medium text-foreground">
              Participants ({onlineCount})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              iconName="Plus"
              iconSize={16}
            >
              Invite
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
            >
              <Icon name="ChevronDown" size={20} />
            </Button>
          </div>
        </div>

        {/* Participants List */}
        <div className="overflow-y-auto max-h-48">
          {allParticipants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="relative">
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                      participant.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {participant.name}
                    {participant.id === currentUserId && ' (You)'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatJoinTime(participant.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {participant.status === 'online' && (
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: participant.color }}
                    />
                    <Icon name={getToolIcon(participant.currentTool)} size={14} />
                  </div>
                )}
                {participant.role === 'owner' && (
                  <Icon name="Crown" size={14} className="text-warning" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Panel - Right sidebar */}
      <div className="hidden lg:block fixed top-20 right-0 bottom-0 w-80 bg-card border-l border-border z-40">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={20} />
              <h3 className="font-medium text-foreground">
                Participants ({onlineCount})
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                iconName="Plus"
                iconSize={16}
              >
                Invite
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </div>

          {/* Participants List */}
          <div className="flex-1 overflow-y-auto">
            {allParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border/50"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative">
                    <Image
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        participant.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {participant.name}
                        {participant.id === currentUserId && ' (You)'}
                      </p>
                      {participant.role === 'owner' && (
                        <Icon name="Crown" size={14} className="text-warning" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {participant.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {formatJoinTime(participant.joinedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  {participant.status === 'online' && (
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: participant.color }}
                      />
                      <Icon name={getToolIcon(participant.currentTool)} size={14} />
                    </div>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    participant.status === 'online' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {participant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Session Info */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Session started: 2:30 PM</p>
              <p>Duration: 45 minutes</p>
              <p>Recording: Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-elevation-3 animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Invite Participant
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInviteModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                  >
                    Send Invite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantPanel;