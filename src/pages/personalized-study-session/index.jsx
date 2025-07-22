import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import StudyCard from './components/StudyCard';
import ProgressIndicator from './components/ProgressIndicator';
import StudyToolbar from './components/StudyToolbar';
import NotesModal from './components/NotesModal';
import SessionHeader from './components/SessionHeader';
import ReferencePanel from './components/ReferencePanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const PersonalizedStudySession = () => {
  // Session state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedCards, setCompletedCards] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(5);
  
  // UI state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedCardForNote, setSelectedCardForNote] = useState(null);
  const [highlightMode, setHighlightMode] = useState(false);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [showHints, setShowHints] = useState({});
  
  // Data state
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Mock study session data
  const sessionData = {
    title: "Algebra Fundamentals",
    subtitle: "Chapter 3: Linear Equations",
    subject: "Mathematics",
    topic: "Linear Equations",
    difficulty: "medium",
    estimatedTime: 45
  };

  const studyCards = [
    {
      id: 1,
      type: 'concept',
      title: 'Understanding Linear Equations',
      content: `A linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable.\n\nLinear equations can be written in the form:\nax + b = c\n\nWhere:\n• a, b, and c are constants\n• x is the variable\n• a ≠ 0 (otherwise it wouldn't be linear)\n\nThe graph of a linear equation is always a straight line, which is why we call it "linear."`,
      diagram: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      diagramAlt: "Linear equation graph showing a straight line",
      keyPoints: [
        "Linear equations have variables with power of 1 only",
        "The graph is always a straight line",
        "They have at most one solution",
        "Can be solved using algebraic operations"
      ],
      isBookmarked: false
    },
    {
      id: 2,
      type: 'example',title: 'Solving a Linear Equation',
      problem: "Solve for x: 3x + 7 = 22",
      steps: [
        {
          title: "Isolate the variable term",
          explanation: "Subtract 7 from both sides to get the term with x by itself",
          calculation: "3x + 7 - 7 = 22 - 7\n3x = 15"
        },
        {
          title: "Solve for the variable",
          explanation: "Divide both sides by the coefficient of x",
          calculation: "3x ÷ 3 = 15 ÷ 3\nx = 5"
        },
        {
          title: "Verify the solution",
          explanation: "Substitute x = 5 back into the original equation",
          calculation: "3(5) + 7 = 15 + 7 = 22 ✓"
        }
      ],
      finalAnswer: "x = 5",
      isBookmarked: false
    },
    {
      id: 3,
      type: 'practice',title: 'Practice Problem 1',
      question: "Solve for x: 2x - 5 = 11",
      questionType: 'multiple-choice',
      options: [
        { id: 'a', label: 'A', text: 'x = 3', isCorrect: false },
        { id: 'b', label: 'B', text: 'x = 8', isCorrect: true },
        { id: 'c', label: 'C', text: 'x = 6', isCorrect: false },
        { id: 'd', label: 'D', text: 'x = 13', isCorrect: false }
      ],
      hint: "Start by adding 5 to both sides to isolate the term with x.",
      feedback: {
        isCorrect: true,
        explanation: "Correct! First add 5 to both sides: 2x - 5 + 5 = 11 + 5, which gives 2x = 16. Then divide by 2: x = 8."
      },
      isBookmarked: false
    },
    {
      id: 4,
      type: 'concept',title: 'Graphing Linear Equations',
      content: `Linear equations can be graphed on a coordinate plane. The most common forms are:\n\n1. Slope-Intercept Form: y = mx + b\n   • m is the slope (rise over run)\n   • b is the y-intercept (where line crosses y-axis)\n\n2. Standard Form: Ax + By = C\n   • A, B, and C are integers\n   • A and B are not both zero\n\n3. Point-Slope Form: y - y₁ = m(x - x₁)\n   • Used when you know a point and the slope`,
      diagram: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
      diagramAlt: "Coordinate plane with linear equation graph",
      keyPoints: [
        "Slope determines the steepness and direction",
        "Y-intercept is where the line crosses the y-axis",
        "Two points determine a unique line",
        "Parallel lines have the same slope"
      ],
      isBookmarked: false
    },
    {
      id: 5,
      type: 'example',title: 'Finding Slope and Y-Intercept',
      problem: "Find the slope and y-intercept of the line: y = -2x + 3",
      steps: [
        {
          title: "Identify the slope-intercept form",
          explanation: "The equation is already in y = mx + b form",
          calculation: "y = -2x + 3\nCompare with y = mx + b"
        },
        {
          title: "Find the slope (m)",
          explanation: "The coefficient of x is the slope",
          calculation: "m = -2\nThe slope is -2"
        },
        {
          title: "Find the y-intercept (b)",
          explanation: "The constant term is the y-intercept",
          calculation: "b = 3\nThe y-intercept is 3"
        }
      ],
      finalAnswer: "Slope = -2, Y-intercept = 3",
      isBookmarked: false
    },
    {
      id: 6,
      type: 'practice',title: 'Practice Problem 2',question: "What is the slope of the line passing through points (2, 5) and (6, 13)?",questionType: 'numeric',
      hint: "Use the slope formula: m = (y₂ - y₁) / (x₂ - x₁)",
      feedback: {
        isCorrect: true,
        explanation: "Correct! Using the slope formula: m = (13 - 5) / (6 - 2) = 8 / 4 = 2"
      },
      isBookmarked: false
    },
    {
      id: 7,
      type: 'practice',title: 'Practice Problem 3',question: "Explain in your own words what the slope of a line represents.",questionType: 'text-input',
      hint: "Think about how the line changes as you move from left to right.",
      feedback: {
        isCorrect: true,
        explanation: "Good explanation! The slope represents the rate of change - how much y changes for each unit change in x. It shows the steepness and direction of the line."
      },
      isBookmarked: false
    },
    {
      id: 8,
      type: 'concept',title: 'Applications of Linear Equations',
      content: `Linear equations are used in many real-world situations:\n\n1. Business and Economics\n   • Cost and revenue calculations\n   • Break-even analysis\n   • Supply and demand models\n\n2. Science and Engineering\n   • Distance-time relationships\n   • Temperature conversions\n   • Chemical reaction rates\n\n3. Everyday Life\n   • Cell phone plans\n   • Taxi fare calculations\n   • Salary and commission structures`,
      diagram: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      diagramAlt: "Business chart showing linear relationships",
      keyPoints: [
        "Linear relationships are common in real life",
        "Help predict future values",
        "Useful for making business decisions",
        "Foundation for more complex mathematical models"
      ],
      isBookmarked: false
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  // Session handlers
  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      if (currentCardIndex + 1 > completedCards) {
        setCompletedCards(currentCardIndex + 1);
      }
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
  };

  const handleExitSession = () => {
    // Save progress and exit
    console.log('Session completed, saving progress...');
  };

  // Study tools handlers
  const handleBookmark = (cardId, isBookmarked) => {
    if (isBookmarked) {
      setBookmarks(prev => [...prev, { cardId, timestamp: new Date().toISOString() }]);
    } else {
      setBookmarks(prev => prev.filter(b => b.cardId !== cardId));
    }
  };

  const handleTakeNote = (cardId) => {
    setSelectedCardForNote(cardId);
    setShowNotesModal(true);
  };

  const handleSaveNote = (note) => {
    if (note === null) {
      // Delete note
      setNotes(prev => prev.filter(n => n.cardId !== selectedCardForNote));
    } else {
      // Save or update note
      setNotes(prev => {
        const existingIndex = prev.findIndex(n => n.id === note.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = note;
          return updated;
        } else {
          return [...prev, note];
        }
      });
    }
  };

  const handleHighlight = (color) => {
    setHighlightMode(!highlightMode);
    console.log('Highlight mode:', !highlightMode, 'Color:', color);
  };

  const handleShowHint = (cardId) => {
    setShowHints(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSettings = () => {
    console.log('Open session settings');
  };

  const toggleReferencePanel = () => {
    setShowReferencePanel(!showReferencePanel);
  };

  const currentCard = studyCards[currentCardIndex];
  const existingNote = notes.find(n => n.cardId === selectedCardForNote);
  const estimatedTimeRemaining = Math.max(0, (sessionData.estimatedTime * 60) - sessionDuration);

  return (
    <>
      <Helmet>
        <title>Personalized Study Session - EduAI Platform</title>
        <meta name="description" content="AI-powered personalized study session with adaptive content and interactive learning materials" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Session Header */}
        <SessionHeader
          sessionTitle={sessionData.title}
          sessionSubtitle={sessionData.subtitle}
          onPause={handlePauseSession}
          onExit={handleExitSession}
          isPaused={isPaused}
          sessionDuration={sessionDuration}
          currentStreak={currentStreak}
        />

        {/* Main Content */}
        <div className={`pt-20 lg:pt-16 pb-20 lg:pb-6 transition-all duration-300 ${
          showReferencePanel ? 'lg:pr-80' : ''
        }`}>
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Progress Panel - Desktop Left */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="sticky top-24">
                  <ProgressIndicator
                    currentCard={currentCardIndex}
                    totalCards={studyCards.length}
                    completedCards={completedCards}
                    estimatedTimeRemaining={estimatedTimeRemaining}
                    sessionStartTime={sessionStartTime}
                    difficulty={sessionData.difficulty}
                  />
                </div>
              </div>

              {/* Study Card - Main Content */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="max-w-4xl mx-auto">
                  <StudyCard
                    card={currentCard}
                    isActive={true}
                    onNext={handleNextCard}
                    onPrevious={handlePreviousCard}
                    onBookmark={handleBookmark}
                    onTakeNote={handleTakeNote}
                    onShowHint={handleShowHint}
                    showHint={showHints[currentCard?.id]}
                    currentCardIndex={currentCardIndex}
                    totalCards={studyCards.length}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Toolbar */}
        <StudyToolbar
          onHighlight={handleHighlight}
          onTakeNote={() => handleTakeNote(currentCard?.id)}
          onBookmark={() => handleBookmark(currentCard?.id, true)}
          onSettings={handleSettings}
          highlightMode={highlightMode}
          noteCount={notes.length}
          bookmarkCount={bookmarks.length}
        />

        {/* Reference Panel */}
        <ReferencePanel
          subject={sessionData.subject}
          topic={sessionData.topic}
          isVisible={showReferencePanel}
          onToggle={toggleReferencePanel}
        />

        {/* Notes Modal */}
        <NotesModal
          isOpen={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          cardId={selectedCardForNote}
          existingNote={existingNote}
          onSaveNote={handleSaveNote}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl shadow-elevation-3 p-8 text-center max-w-sm mx-4">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Pause" size={32} className="text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Session Paused</h3>
              <p className="text-muted-foreground mb-6">
                Take your time. Your progress is saved automatically.
              </p>
              <Button
                variant="default"
                onClick={handlePauseSession}
                iconName="Play"
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                Resume Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PersonalizedStudySession;