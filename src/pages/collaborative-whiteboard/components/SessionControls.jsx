import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionControls = ({
  isRecording,
  onToggleRecording,
  onSaveSession,
  onExportSession,
  onEndSession,
  sessionDuration = 0,
  participantCount = 1
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportOptions = [
    { id: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { id: 'png', label: 'Export as PNG', icon: 'Image' },
    { id: 'svg', label: 'Export as SVG', icon: 'FileImage' },
    { id: 'video', label: 'Export Recording', icon: 'Video', disabled: !isRecording }
  ];

  const handleExport = (format) => {
    onExportSession?.(format);
    setShowExportOptions(false);
  };

  const handleEndSession = () => {
    onEndSession?.();
    setShowEndConfirm(false);
  };

  return (
    <>
      {/* Mobile Session Controls - Top Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Session Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                isRecording ? 'bg-error animate-pulse' : 'bg-success'
              }`} />
              <span className="text-sm font-medium text-foreground">
                {formatDuration(sessionDuration)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {participantCount} participant{participantCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              onClick={onToggleRecording}
              iconName={isRecording ? "Square" : "Circle"}
              iconSize={16}
            >
              <span className="hidden sm:inline ml-1">
                {isRecording ? 'Stop' : 'Record'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveSession}
              iconName="Save"
              iconSize={16}
            >
              <span className="hidden sm:inline ml-1">Save</span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportOptions(!showExportOptions)}
                iconName="Download"
                iconSize={16}
              >
                <span className="hidden sm:inline ml-1">Export</span>
              </Button>

              {showExportOptions && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-50">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option.id)}
                      disabled={option.disabled}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        option.disabled ? 'opacity-50 cursor-not-allowed' : 'text-foreground'
                      }`}
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEndConfirm(true)}
              iconName="X"
              iconSize={16}
            >
              <span className="hidden sm:inline ml-1">End</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Session Controls - Top Right */}
      <div className="hidden lg:block fixed top-20 right-4 z-30">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-elevation-2 p-4 min-w-80">
          {/* Session Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-foreground">
                Collaborative Session
              </h3>
              <p className="text-sm text-muted-foreground">
                Started at {currentTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isRecording ? 'bg-error animate-pulse' : 'bg-success'
                }`} />
                <span className="text-lg font-mono font-medium text-foreground">
                  {formatDuration(sessionDuration)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {participantCount} participant{participantCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-error/10 text-error rounded-lg">
              <Icon name="Circle" size={16} className="animate-pulse" />
              <span className="text-sm font-medium">Recording in progress</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isRecording ? "destructive" : "default"}
              onClick={onToggleRecording}
              iconName={isRecording ? "Square" : "Circle"}
              iconPosition="left"
              iconSize={16}
              className="w-full"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>

            <Button
              variant="outline"
              onClick={onSaveSession}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              className="w-full"
            >
              Save Session
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowExportOptions(!showExportOptions)}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                Export
              </Button>

              {showExportOptions && (
                <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-50">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option.id)}
                      disabled={option.disabled}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        option.disabled ? 'opacity-50 cursor-not-allowed' : 'text-foreground'
                      }`}
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="destructive"
              onClick={() => setShowEndConfirm(true)}
              iconName="PhoneOff"
              iconPosition="left"
              iconSize={16}
              className="w-full"
            >
              End Session
            </Button>
          </div>

          {/* Session Stats */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-foreground">47</p>
                <p className="text-xs text-muted-foreground">Objects</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Saves</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">3.2MB</p>
                <p className="text-xs text-muted-foreground">Size</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-elevation-3 animate-scale-in">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    End Session?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This will end the session for all participants
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Session Duration:</span>
                  <span className="font-medium text-foreground">
                    {formatDuration(sessionDuration)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Participants:</span>
                  <span className="font-medium text-foreground">
                    {participantCount}
                  </span>
                </div>
                {isRecording && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recording:</span>
                    <span className="font-medium text-error">Active</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowEndConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionControls;