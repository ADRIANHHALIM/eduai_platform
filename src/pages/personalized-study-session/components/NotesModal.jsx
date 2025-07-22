import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotesModal = ({ isOpen, onClose, cardId, existingNote, onSaveNote }) => {
  const [noteText, setNoteText] = useState('');
  const [noteColor, setNoteColor] = useState('yellow');
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    if (existingNote) {
      setNoteText(existingNote.text || '');
      setNoteColor(existingNote.color || 'yellow');
      setIsPrivate(existingNote.isPrivate !== false);
    } else {
      setNoteText('');
      setNoteColor('yellow');
      setIsPrivate(true);
    }
  }, [existingNote, isOpen]);

  const noteColors = [
    { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', label: 'Yellow' },
    { name: 'green', bg: 'bg-green-100', border: 'border-green-300', label: 'Green' },
    { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', label: 'Blue' },
    { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', label: 'Pink' },
    { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', label: 'Purple' }
  ];

  const handleSave = () => {
    if (noteText.trim()) {
      onSaveNote({
        id: existingNote?.id || Date.now(),
        cardId,
        text: noteText.trim(),
        color: noteColor,
        isPrivate,
        timestamp: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (existingNote) {
      onSaveNote(null); // Pass null to delete
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elevation-3 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="StickyNote" size={16} color="var(--color-accent)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {existingNote ? 'Edit Note' : 'Add Note'}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Note Text */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Note
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              className={`w-full h-32 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-colors duration-200 ${
                noteColors.find(c => c.name === noteColor)?.bg || 'bg-background'
              } ${
                noteColors.find(c => c.name === noteColor)?.border || 'border-border'
              }`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {noteText.length}/500 characters
            </p>
          </div>

          {/* Note Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Note Color
            </label>
            <div className="flex space-x-2">
              {noteColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setNoteColor(color.name)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                    color.bg
                  } ${
                    noteColor === color.name 
                      ? 'border-foreground scale-110 shadow-elevation-1' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={isPrivate ? "Lock" : "Users"} 
                size={16} 
                className="text-muted-foreground" 
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isPrivate ? 'Private Note' : 'Shared Note'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPrivate ? 'Only you can see this note' : 'Visible to study group'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isPrivate ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isPrivate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div>
            {existingNote && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!noteText.trim()}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;