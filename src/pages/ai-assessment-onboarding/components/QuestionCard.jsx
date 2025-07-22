import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Image from '../../../components/AppImage';

const QuestionCard = ({ question, onAnswer, selectedAnswer, showFeedback, isCorrect }) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleOptionSelect = (optionId) => {
    if (!showFeedback) {
      onAnswer(optionId);
    }
  };

  const getOptionStyle = (option) => {
    const baseStyle = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 cursor-pointer";
    
    if (showFeedback) {
      if (option.id === question.correctAnswer) {
        return `${baseStyle} border-success bg-success/10 text-success`;
      }
      if (option.id === selectedAnswer && option.id !== question.correctAnswer) {
        return `${baseStyle} border-error bg-error/10 text-error`;
      }
      return `${baseStyle} border-border bg-muted/50 text-muted-foreground cursor-not-allowed`;
    }
    
    if (selectedAnswer === option.id) {
      return `${baseStyle} border-primary bg-primary/10 text-primary`;
    }
    
    if (hoveredOption === option.id) {
      return `${baseStyle} border-primary/50 bg-primary/5 text-foreground`;
    }
    
    return `${baseStyle} border-border bg-card text-foreground hover:border-primary/30`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-elevation-1 border border-border overflow-hidden">
      {/* Question Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              question.subject === 'Math' ? 'bg-blue-100 text-blue-600' :
              question.subject === 'Science' ? 'bg-green-100 text-green-600' :
              question.subject === 'English'? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <Icon 
                name={
                  question.subject === 'Math' ? 'Calculator' :
                  question.subject === 'Science' ? 'Atom' :
                  question.subject === 'English'? 'BookOpen' : 'Brain'
                } 
                size={16} 
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{question.subject}</p>
              <p className="text-xs text-muted-foreground">{question.difficulty} Level</p>
            </div>
          </div>
          
          {question.timeEstimate && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span className="text-xs">{question.timeEstimate}</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-lg font-medium text-foreground mb-4 leading-relaxed">
          {question.text}
        </h2>

        {/* Question Image/Diagram */}
        {question.image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <Image
              src={question.image}
              alt="Question diagram"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Mathematical Expression */}
        {question.expression && (
          <div className="mb-6 p-4 bg-muted rounded-lg text-center">
            <div className="text-lg font-mono text-foreground">
              {question.expression}
            </div>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={getOptionStyle(option)}
              onClick={() => handleOptionSelect(option.id)}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={showFeedback}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  showFeedback && option.id === question.correctAnswer ? 'border-success bg-success' :
                  showFeedback && option.id === selectedAnswer && option.id !== question.correctAnswer ? 'border-error bg-error' :
                  selectedAnswer === option.id ? 'border-primary bg-primary': 'border-border'
                }`}>
                  {showFeedback && option.id === question.correctAnswer && (
                    <Icon name="Check" size={14} color="white" />
                  )}
                  {showFeedback && option.id === selectedAnswer && option.id !== question.correctAnswer && (
                    <Icon name="X" size={14} color="white" />
                  )}
                  {!showFeedback && selectedAnswer === option.id && (
                    <Icon name="Check" size={14} color="white" />
                  )}
                </div>
                <span className="text-sm font-medium">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`mt-4 p-4 rounded-lg ${
            isCorrect ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'
          }`}>
            <div className="flex items-start space-x-3">
              <Icon 
                name={isCorrect ? "CheckCircle" : "XCircle"} 
                size={20} 
                color={isCorrect ? "var(--color-success)" : "var(--color-error)"}
              />
              <div>
                <p className={`text-sm font-medium ${
                  isCorrect ? 'text-success' : 'text-error'
                }`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-sm text-foreground mt-1">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;