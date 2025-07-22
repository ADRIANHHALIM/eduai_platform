import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const QuestionCard = ({ 
  question, 
  onAnswer, 
  onFlag, 
  selectedAnswer, 
  isFlagged,
  showFeedback,
  feedback 
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState({});

  const handleMultipleChoice = (optionId) => {
    onAnswer(optionId);
  };

  const handleNumericalInput = (value) => {
    onAnswer(value);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (draggedItem) {
      setDropZones(prev => ({
        ...prev,
        [zoneId]: draggedItem
      }));
      onAnswer({ ...dropZones, [zoneId]: draggedItem });
    }
    setDraggedItem(null);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleMultipleChoice(option.id)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option.id
                      ? 'border-primary bg-primary' :'border-muted-foreground'
                  }`}>
                    {selectedAnswer === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-sm text-foreground">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'numerical':
        return (
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter your answer"
              value={selectedAnswer || ''}
              onChange={(e) => handleNumericalInput(e.target.value)}
              className="text-center text-lg"
            />
            <div className="text-xs text-muted-foreground text-center">
              {question.unit && `Answer in ${question.unit}`}
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <div className="space-y-6">
            {/* Draggable Items */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Drag items:</h4>
              <div className="flex flex-wrap gap-2">
                {question.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="px-3 py-2 bg-card border border-border rounded-lg cursor-move hover:shadow-elevation-1 transition-all duration-200"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop Zones */}
            <div className="space-y-3">
              {question.dropZones.map((zone) => (
                <div
                  key={zone.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zone.id)}
                  className="min-h-12 p-3 border-2 border-dashed border-border rounded-lg bg-muted/10 flex items-center justify-center text-sm text-muted-foreground hover:border-primary/50 transition-colors duration-200"
                >
                  {dropZones[zone.id] ? (
                    <span className="text-foreground font-medium">
                      {dropZones[zone.id].text}
                    </span>
                  ) : (
                    zone.placeholder
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'image-based':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={question.imageUrl}
                alt={question.imageAlt}
                className="w-full max-w-md mx-auto rounded-lg"
              />
              {question.clickableAreas && question.clickableAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleMultipleChoice(area.id)}
                  className={`absolute border-2 rounded-full transition-all duration-200 ${
                    selectedAnswer === area.id
                      ? 'border-primary bg-primary/20' :'border-white bg-white/20 hover:border-primary/50'
                  }`}
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}px`,
                    height: `${area.height}px`
                  }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {question.subject}
            </span>
            <span className="text-xs text-muted-foreground">
              {question.difficulty}
            </span>
          </div>
          <h2 className="text-lg font-medium text-foreground leading-relaxed">
            {question.text}
          </h2>
          {question.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {question.description}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onFlag}
          className={isFlagged ? 'text-warning' : 'text-muted-foreground'}
        >
          <Icon name="Flag" size={20} />
        </Button>
      </div>

      {/* Question Image */}
      {question.imageUrl && question.type !== 'image-based' && (
        <div className="flex justify-center">
          <Image
            src={question.imageUrl}
            alt={question.imageAlt || 'Question illustration'}
            className="max-w-sm rounded-lg"
          />
        </div>
      )}

      {/* Question Content */}
      {renderQuestionContent()}

      {/* Feedback */}
      {showFeedback && feedback && (
        <div className={`p-4 rounded-lg border ${
          feedback.isCorrect 
            ? 'bg-success/10 border-success text-success' :'bg-error/10 border-error text-error'
        }`}>
          <div className="flex items-start space-x-2">
            <Icon 
              name={feedback.isCorrect ? "CheckCircle" : "XCircle"} 
              size={20} 
              className="flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium">
                {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm mt-1 opacity-90">
                {feedback.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;