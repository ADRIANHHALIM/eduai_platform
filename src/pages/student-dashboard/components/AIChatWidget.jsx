import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIChatWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi! I'm your AI tutor. I can help you with:\n• Explaining difficult concepts\n• Creating practice problems\n• Study planning and tips\n\nWhat would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickSuggestions = [
    "Explain quadratic equations",
    "Create a physics quiz",
    "Help with essay writing",
    "Study schedule tips"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `I understand you're asking about "${inputValue}". Let me help you with that!\n\nThis is a simulated response. In a real application, this would connect to an AI service to provide personalized tutoring assistance.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 hover:scale-105"
        >
          <Icon name="MessageCircle" size={24} />
        </Button>
        
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
            AI Tutor
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-card rounded-2xl shadow-elevation-3 border border-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Tutor</h3>
              <p className="text-xs text-success flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                Online
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl p-3 ${
                    message.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              
              {message.type === 'ai' && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mr-2 order-0">
                  <Icon name="Bot" size={12} color="white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-muted hover:bg-muted/80 text-foreground px-2 py-1 rounded-lg transition-colors duration-150"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <Button 
              size="icon" 
              variant="default"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;