import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ChatPanel = ({ 
  participants, 
  isVisible, 
  onToggleVisibility,
  currentUserId = 'current-user'
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock chat messages
  const mockMessages = [
    {
      id: 1,
      userId: 'user2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: "Hey everyone! Ready to solve this physics problem together?",
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: 2,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: "Yes! I\'ve been struggling with momentum conservation.",
      timestamp: new Date(Date.now() - 1740000),
      type: 'text'
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Mike Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: "Let me draw the force diagram first",
      timestamp: new Date(Date.now() - 1680000),
      type: 'text'
    },
    {
      id: 4,
      userId: 'system',
      userName: 'System',
      userAvatar: null,
      content: "Mike Rodriguez started drawing",
      timestamp: new Date(Date.now() - 1620000),
      type: 'system'
    },
    {
      id: 5,
      userId: 'user4',
      userName: 'Emma Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: "Great! I think we need to consider the angle of the incline too.",
      timestamp: new Date(Date.now() - 1560000),
      type: 'text'
    },
    {
      id: 6,
      userId: 'user2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: "The formula we need is F = ma, but we need to break down the forces",
      timestamp: new Date(Date.now() - 1500000),
      type: 'text'
    },
    {
      id: 7,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: "So we have gravity, normal force, and friction?",
      timestamp: new Date(Date.now() - 1440000),
      type: 'text'
    }
  ];

  const [allMessages, setAllMessages] = useState(mockMessages);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: currentUserId,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: message.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setAllMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 60000); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-24 lg:bottom-6 right-4 z-40">
        <Button
          variant="outline"
          onClick={onToggleVisibility}
          iconName="MessageCircle"
          iconSize={20}
          className="shadow-elevation-2 relative"
        >
          <span className="hidden sm:inline ml-2">Chat</span>
          {/* Unread indicator */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Chat - Full Screen Overlay */}
      <div className="lg:hidden fixed inset-0 z-50 bg-card flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={20} />
            <h3 className="font-medium text-foreground">Group Chat</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((msg) => (
            <div key={msg.id} className={`flex space-x-3 ${
              msg.userId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {msg.type === 'system' ? (
                <div className="w-full text-center">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <>
                  {msg.userId !== currentUserId && (
                    <Image
                      src={msg.userAvatar}
                      alt={msg.userName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className={`flex-1 max-w-xs ${
                    msg.userId === currentUserId ? 'text-right' : ''
                  }`}>
                    {msg.userId !== currentUserId && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {msg.userName}
                      </p>
                    )}
                    <div className={`inline-block p-3 rounded-lg ${
                      msg.userId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <Button
              variant="default"
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Chat - Side Panel */}
      <div className="hidden lg:block fixed top-20 right-80 bottom-0 w-80 bg-card border-l border-border z-30">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={20} />
              <h3 className="font-medium text-foreground">Group Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMessages.map((msg) => (
              <div key={msg.id} className={`flex space-x-3 ${
                msg.userId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {msg.type === 'system' ? (
                  <div className="w-full text-center">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                ) : (
                  <>
                    {msg.userId !== currentUserId && (
                      <Image
                        src={msg.userAvatar}
                        alt={msg.userName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className={`flex-1 max-w-xs ${
                      msg.userId === currentUserId ? 'text-right' : ''
                    }`}>
                      {msg.userId !== currentUserId && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {msg.userName}
                        </p>
                      )}
                      <div className={`inline-block p-3 rounded-lg ${
                        msg.userId === currentUserId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPanel;