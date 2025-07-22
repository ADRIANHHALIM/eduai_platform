import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const StudyCard = ({ 
  card, 
  isActive, 
  onNext, 
  onPrevious, 
  onBookmark, 
  onTakeNote,
  onShowHint,
  showHint,
  currentCardIndex,
  totalCards
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(card.isBookmarked || false);

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
  };

  const handleTextAnswer = (value) => {
    setUserAnswer(value);
  };

  const handleSubmitAnswer = () => {
    setShowFeedback(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(card.id, !isBookmarked);
  };

  const renderContent = () => {
    switch (card.type) {
      case 'concept':
        return (
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold text-foreground mb-4">{card.title}</h3>
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {card.content}
              </div>
            </div>
            
            {card.diagram && (
              <div className="bg-muted rounded-lg p-4 overflow-hidden">
                <Image 
                  src={card.diagram} 
                  alt={card.diagramAlt || "Concept diagram"}
                  className="w-full h-48 object-contain"
                />
              </div>
            )}

            {card.keyPoints && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h4 className="font-medium text-accent mb-3 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {card.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-foreground">
                      <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'example':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">{card.title}</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-foreground mb-2">Problem:</p>
                <p className="text-foreground whitespace-pre-line">{card.problem}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center">
                <Icon name="ArrowRight" size={16} className="mr-2 text-primary" />
                Step-by-Step Solution
              </h4>
              {card.steps.map((step, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{step.title}</p>
                      <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">{step.explanation}</p>
                      {step.calculation && (
                        <div className="bg-background border rounded p-2 mt-2 font-mono text-sm">
                          {step.calculation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {card.finalAnswer && (
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <p className="font-medium text-success mb-2">Final Answer:</p>
                <p className="text-foreground font-mono">{card.finalAnswer}</p>
              </div>
            )}
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">{card.title}</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-foreground whitespace-pre-line">{card.question}</p>
              </div>
            </div>

            {card.questionType === 'multiple-choice' && (
              <div className="space-y-3">
                {card.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === option.id
                        ? showFeedback
                          ? option.isCorrect
                            ? 'border-success bg-success/5 text-success' :'border-error bg-error/5 text-error' :'border-primary bg-primary/5'
                        : showFeedback && option.isCorrect
                        ? 'border-success bg-success/5 text-success' :'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === option.id
                          ? showFeedback
                            ? option.isCorrect
                              ? 'border-success bg-success text-success-foreground'
                              : 'border-error bg-error text-error-foreground' :'border-primary bg-primary text-primary-foreground'
                          : showFeedback && option.isCorrect
                          ? 'border-success bg-success text-success-foreground'
                          : 'border-muted-foreground'
                      }`}>
                        {showFeedback && (selectedAnswer === option.id || option.isCorrect) && (
                          <Icon 
                            name={option.isCorrect ? "Check" : "X"} 
                            size={14} 
                          />
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                      <span className="flex-1">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {card.questionType === 'text-input' && (
              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={showFeedback}
                  className="w-full h-32 p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
                {!showFeedback && (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim()}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            )}

            {card.questionType === 'numeric' && (
              <div className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  disabled={showFeedback}
                  className="w-full p-4 text-center text-lg font-mono border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                {!showFeedback && (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            )}

            {showFeedback && card.feedback && (
              <div className={`rounded-lg p-4 ${
                card.feedback.isCorrect 
                  ? 'bg-success/5 border border-success/20' :'bg-warning/5 border border-warning/20'
              }`}>
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={card.feedback.isCorrect ? "CheckCircle" : "AlertCircle"} 
                    size={20} 
                    className={card.feedback.isCorrect ? 'text-success' : 'text-warning'}
                  />
                  <div>
                    <p className={`font-medium ${
                      card.feedback.isCorrect ? 'text-success' : 'text-warning'
                    }`}>
                      {card.feedback.isCorrect ? 'Correct!' : 'Not quite right'}
                    </p>
                    <p className="text-foreground text-sm mt-1 whitespace-pre-line">
                      {card.feedback.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showHint && card.hint && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-primary">Hint</p>
                    <p className="text-foreground text-sm mt-1 whitespace-pre-line">{card.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <div className="bg-card rounded-lg shadow-card-elevation border border-border overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            card.type === 'concept' ? 'bg-accent/10' :
            card.type === 'example'? 'bg-primary/10' : 'bg-warning/10'
          }`}>
            <Icon 
              name={
                card.type === 'concept' ? 'BookOpen' :
                card.type === 'example'? 'FileText' : 'Brain'
              } 
              size={16} 
              color={
                card.type === 'concept' ? 'var(--color-accent)' :
                card.type === 'example' ? 'var(--color-primary)' :
                'var(--color-warning)'
              }
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground capitalize">{card.type}</p>
            <p className="text-xs text-muted-foreground">
              {currentCardIndex + 1} of {totalCards}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {card.type === 'practice' && !showFeedback && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShowHint(card.id)}
            >
              <Icon name="HelpCircle" size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
          >
            <Icon 
              name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
              size={16}
              className={isBookmarked ? 'text-warning' : ''}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTakeNote(card.id)}
          >
            <Icon name="StickyNote" size={16} />
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Card Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentCardIndex === 0}
          iconName="ChevronLeft"
          iconPosition="left"
          iconSize={16}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: Math.min(totalCards, 5) }, (_, i) => {
            const cardIndex = currentCardIndex <= 2 ? i : 
                            currentCardIndex >= totalCards - 3 ? totalCards - 5 + i :
                            currentCardIndex - 2 + i;
            
            return (
              <div
                key={cardIndex}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  cardIndex === currentCardIndex 
                    ? 'bg-primary w-6' :'bg-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>

        <Button
          variant="default"
          onClick={onNext}
          disabled={currentCardIndex === totalCards - 1}
          iconName="ChevronRight"
          iconPosition="right"
          iconSize={16}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StudyCard;