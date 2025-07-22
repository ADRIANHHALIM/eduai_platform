import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DrawingToolbar = ({ 
  currentTool, 
  onToolChange, 
  currentColor, 
  onColorChange, 
  currentThickness, 
  onThicknessChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  isCollapsed,
  onToggleCollapse
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThicknessPicker, setShowThicknessPicker] = useState(false);

  const tools = [
    { id: 'pen', icon: 'Pen', label: 'Pen' },
    { id: 'eraser', icon: 'Eraser', label: 'Eraser' },
    { id: 'text', icon: 'Type', label: 'Text' },
    { id: 'rectangle', icon: 'Square', label: 'Rectangle' },
    { id: 'circle', icon: 'Circle', label: 'Circle' },
    { id: 'line', icon: 'Minus', label: 'Line' },
    { id: 'arrow', icon: 'ArrowRight', label: 'Arrow' },
    { id: 'pan', icon: 'Move', label: 'Pan' }
  ];

  const colors = [
    '#1E293B', // slate-800
    '#2563EB', // blue-600
    '#DC2626', // red-600
    '#059669', // emerald-600
    '#D97706', // amber-600
    '#7C3AED', // violet-600
    '#EC4899', // pink-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6'  // violet-500
  ];

  const thicknesses = [1, 2, 3, 5, 8, 12, 16, 20];

  const handleToolSelect = (toolId) => {
    onToolChange(toolId);
  };

  const handleColorSelect = (color) => {
    onColorChange(color);
    setShowColorPicker(false);
  };

  const handleThicknessSelect = (thickness) => {
    onThicknessChange(thickness);
    setShowThicknessPicker(false);
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-20 left-4 z-40">
        <Button
          variant="default"
          size="icon"
          onClick={onToggleCollapse}
          className="w-12 h-12 shadow-elevation-2"
        >
          <Icon name="Palette" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toolbar - Bottom */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 bg-card border-t border-border backdrop-blur-subtle">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Primary Tools */}
          <div className="flex items-center space-x-2">
            {tools.slice(0, 4).map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "ghost"}
                size="icon"
                onClick={() => handleToolSelect(tool.id)}
                className="w-10 h-10"
              >
                <Icon name={tool.icon} size={18} />
              </Button>
            ))}
          </div>

          {/* Color & Thickness */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
              
              {showColorPicker && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-2 p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowThicknessPicker(!showThicknessPicker)}
                className="w-10 h-10"
              >
                <div 
                  className="rounded-full bg-foreground"
                  style={{ 
                    width: `${Math.min(currentThickness + 4, 16)}px`, 
                    height: `${Math.min(currentThickness + 4, 16)}px` 
                  }}
                />
              </Button>
              
              {showThicknessPicker && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-2 p-3">
                  <div className="flex flex-col space-y-2">
                    {thicknesses.map((thickness) => (
                      <button
                        key={thickness}
                        onClick={() => handleThicknessSelect(thickness)}
                        className="flex items-center justify-center h-8 hover:bg-muted rounded-md transition-colors"
                      >
                        <div 
                          className="rounded-full bg-foreground"
                          style={{ width: `${thickness}px`, height: `${thickness}px` }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              className="w-10 h-10"
            >
              <Icon name="Undo" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-10 h-10"
            >
              <Icon name="ChevronDown" size={18} />
            </Button>
          </div>
        </div>

        {/* Extended Tools Row */}
        <div className="flex items-center justify-center space-x-2 px-4 pb-3">
          {tools.slice(4).map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleToolSelect(tool.id)}
              iconName={tool.icon}
              iconSize={16}
              className="px-3"
            >
              {tool.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Toolbar - Left Sidebar */}
      <div className="hidden lg:block fixed top-20 left-0 bottom-0 w-16 bg-card border-r border-border z-40">
        <div className="flex flex-col h-full">
          {/* Collapse Button */}
          <div className="p-2 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-12 h-12"
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
          </div>

          {/* Tools */}
          <div className="flex-1 p-2 space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? "default" : "ghost"}
                size="icon"
                onClick={() => handleToolSelect(tool.id)}
                className="w-12 h-12"
                title={tool.label}
              >
                <Icon name={tool.icon} size={20} />
              </Button>
            ))}
          </div>

          {/* Color & Thickness */}
          <div className="p-2 space-y-2 border-t border-border">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: currentColor }}
                title="Color"
              />
              
              {showColorPicker && (
                <div className="absolute left-full ml-2 top-0 bg-card border border-border rounded-lg shadow-elevation-2 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className="w-8 h-8 rounded-lg border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowThicknessPicker(!showThicknessPicker)}
                className="w-12 h-12"
                title="Thickness"
              >
                <div 
                  className="rounded-full bg-foreground"
                  style={{ 
                    width: `${Math.min(currentThickness * 2, 20)}px`, 
                    height: `${Math.min(currentThickness * 2, 20)}px` 
                  }}
                />
              </Button>
              
              {showThicknessPicker && (
                <div className="absolute left-full ml-2 top-0 bg-card border border-border rounded-lg shadow-elevation-2 p-3">
                  <div className="flex flex-col space-y-2">
                    {thicknesses.map((thickness) => (
                      <button
                        key={thickness}
                        onClick={() => handleThicknessSelect(thickness)}
                        className="flex items-center justify-center w-12 h-8 hover:bg-muted rounded-md transition-colors"
                      >
                        <div 
                          className="rounded-full bg-foreground"
                          style={{ width: `${thickness}px`, height: `${thickness}px` }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2 space-y-2 border-t border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              className="w-12 h-12"
              title="Undo"
            >
              <Icon name="Undo" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              className="w-12 h-12"
              title="Redo"
            >
              <Icon name="Redo" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="w-12 h-12"
              title="Clear All"
            >
              <Icon name="Trash2" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className="w-12 h-12"
              title="Save"
            >
              <Icon name="Save" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawingToolbar;