import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudyToolbar = ({ 
  onHighlight, 
  onTakeNote, 
  onBookmark, 
  onSettings,
  highlightMode,
  noteCount,
  bookmarkCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightColor, setHighlightColor] = useState('yellow');

  const highlightColors = [
    { name: 'yellow', color: 'bg-yellow-200', label: 'Yellow' },
    { name: 'green', color: 'bg-green-200', label: 'Green' },
    { name: 'blue', color: 'bg-blue-200', label: 'Blue' },
    { name: 'pink', color: 'bg-pink-200', label: 'Pink' }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHighlight = (color) => {
    setHighlightColor(color);
    onHighlight(color);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-40">
      {/* Expanded Tools */}
      {isExpanded && (
        <div className="absolute bottom-16 left-0 space-y-3 animate-scale-in">
          {/* Highlight Colors */}
          <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
            <p className="text-xs text-muted-foreground mb-2">Highlight Colors</p>
            <div className="flex space-x-2">
              {highlightColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleHighlight(color.name)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    color.color
                  } ${
                    highlightColor === color.name 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Tool Buttons */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
                Take Note
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={onTakeNote}
                className="w-12 h-12 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 relative"
              >
                <Icon name="StickyNote" size={20} />
                {noteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {noteCount}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
                Bookmark
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={onBookmark}
                className="w-12 h-12 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 relative"
              >
                <Icon name="Bookmark" size={20} />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="bg-card text-foreground text-sm px-3 py-1 rounded-lg shadow-elevation-1 whitespace-nowrap">
                Settings
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={onSettings}
                className="w-12 h-12 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200"
              >
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Toolbar Button */}
      <Button
        variant={highlightMode ? "default" : "secondary"}
        size="icon"
        onClick={toggleExpanded}
        className="w-14 h-14 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 hover:scale-105"
      >
        <Icon 
          name={isExpanded ? "X" : "Palette"} 
          size={24} 
        />
      </Button>

      {/* Highlight Mode Indicator */}
      {highlightMode && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
          <Icon name="Highlighter" size={12} color="white" />
        </div>
      )}
    </div>
  );
};

export default StudyToolbar;