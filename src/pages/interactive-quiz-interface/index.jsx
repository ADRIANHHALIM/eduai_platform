import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionContextBar from '../../components/ui/SessionContextBar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import QuizHeader from './components/QuizHeader';
import QuizProgress from './components/QuizProgress';
import QuestionCard from './components/QuestionCard';
import QuizNavigation from './components/QuizNavigation';
import QuizSidebar from './components/QuizSidebar';
import QuizResults from './components/QuizResults';
import ExitConfirmationModal from './components/ExitConfirmationModal';
import PauseModal from './components/PauseModal';

const InteractiveQuizInterface = () => {
  const navigate = useNavigate();
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFeedback, setShowFeedback] = useState({});

  // Mock quiz data
  const quizData = {
    id: "math-linear-equations-001",
    title: "Linear Equations Assessment",
    subject: "Mathematics",
    difficulty: "Intermediate",
    timeLimit: 1800, // 30 minutes
    totalQuestions: 15,
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        subject: "Algebra",
        difficulty: "Medium",
        text: "Solve for x: 3x + 7 = 22",
        description: "Find the value of x that satisfies the equation.",
        options: [
          { id: "a", label: "A", text: "x = 3" },
          { id: "b", label: "B", text: "x = 5" },
          { id: "c", label: "C", text: "x = 7" },
          { id: "d", label: "D", text: "x = 9" }
        ],
        correctAnswer: "b",
        explanation: "To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15, then divide by 3: x = 5"
      },
      {
        id: 2,
        type: "numerical",
        subject: "Algebra",
        difficulty: "Medium",
        text: "What is the slope of the line passing through points (2, 3) and (6, 11)?",
        description: "Use the slope formula: m = (y₂ - y₁) / (x₂ - x₁)",
        unit: "decimal form",
        correctAnswer: "2",
        explanation: "Using the slope formula: m = (11 - 3) / (6 - 2) = 8 / 4 = 2"
      },
      {
        id: 3,
        type: "drag-drop",
        subject: "Algebra",
        difficulty: "Hard",
        text: "Match each equation with its corresponding graph type:",
        items: [
          { id: "item1", text: "y = x²" },
          { id: "item2", text: "y = 2x + 1" },
          { id: "item3", text: "y = 1/x" }
        ],
        dropZones: [
          { id: "zone1", placeholder: "Parabola" },
          { id: "zone2", placeholder: "Linear" },
          { id: "zone3", placeholder: "Hyperbola" }
        ],
        correctAnswer: { zone1: "item1", zone2: "item2", zone3: "item3" },
        explanation: "y = x² creates a parabola, y = 2x + 1 is linear, and y = 1/x forms a hyperbola"
      },
      {
        id: 4,
        type: "multiple-choice",
        subject: "Algebra",
        difficulty: "Easy",
        text: "Which of the following is the y-intercept of the line y = -2x + 5?",
        options: [
          { id: "a", label: "A", text: "-2" },
          { id: "b", label: "B", text: "2" },
          { id: "c", label: "C", text: "5" },
          { id: "d", label: "D", text: "-5" }
        ],
        correctAnswer: "c",
        explanation: "In the equation y = mx + b, the y-intercept is b. Here, b = 5"
      },
      {
        id: 5,
        type: "image-based",
        subject: "Geometry",
        difficulty: "Medium",
        text: "Click on the point that represents the solution to the system of equations shown in the graph:",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        imageAlt: "Graph showing intersection of two lines",
        clickableAreas: [
          { id: "point1", x: 30, y: 40, width: 20, height: 20 },
          { id: "point2", x: 50, y: 60, width: 20, height: 20 },
          { id: "point3", x: 70, y: 30, width: 20, height: 20 }
        ],
        correctAnswer: "point2",
        explanation: "The solution to a system of equations is where the lines intersect"
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (!isPaused && !isCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isCompleted, timeRemaining]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (questionNumber) => {
    setCurrentQuestion(questionNumber);
    setShowSidebar(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    navigate('/student-dashboard');
  };

  const handleSubmitQuiz = () => {
    setIsCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setFlaggedQuestions([]);
    setTimeRemaining(1800);
    setTimeSpent(0);
    setIsCompleted(false);
    setIsPaused(false);
  };

  const handleViewReview = () => {
    console.log('View detailed review');
  };

  const handleBackToDashboard = () => {
    navigate('/student-dashboard');
  };

  // Calculate results
  const getQuizResults = () => {
    const correctAnswers = Object.entries(answers).filter(([questionId, answer]) => {
      const question = quizData.questions.find(q => q.id === parseInt(questionId));
      return question && question.correctAnswer === answer;
    }).length;

    const subjectBreakdown = [
      { subject: 'Algebra', percentage: 75, total: 8, correct: 6 },
      { subject: 'Geometry', percentage: 80, total: 4, correct: 3 },
      { subject: 'Statistics', percentage: 60, total: 3, correct: 2 }
    ];

    const recommendations = [
      {
        title: "Focus on Linear Equations",
        description: "Practice more problems involving solving for variables in linear equations. Consider reviewing the fundamentals of algebraic manipulation."
      },
      {
        title: "Strengthen Graph Interpretation",
        description: "Work on identifying key features of graphs such as intercepts, slopes, and intersection points. Visual learning resources recommended."
      },
      {
        title: "Review System of Equations",
        description: "Practice solving systems using different methods: substitution, elimination, and graphical approaches."
      }
    ];

    const percentage = Math.round((correctAnswers / quizData.totalQuestions) * 100);
    let performanceLevel = 'Needs Improvement';
    if (percentage >= 80) performanceLevel = 'Excellent';
    else if (percentage >= 70) performanceLevel = 'Good';
    else if (percentage >= 60) performanceLevel = 'Fair';

    return {
      score: percentage,
      totalQuestions: quizData.totalQuestions,
      correctAnswers,
      timeSpent,
      subjectBreakdown,
      recommendations,
      performanceLevel
    };
  };

  const answeredQuestions = Object.keys(answers).map(id => parseInt(id));
  const currentQuestionData = quizData.questions.find(q => q.id === currentQuestion);
  const canGoNext = currentQuestion < quizData.totalQuestions;
  const canGoPrevious = currentQuestion > 1;
  const isLastQuestion = currentQuestion === quizData.totalQuestions;

  if (isCompleted) {
    return (
      <QuizResults
        results={getQuizResults()}
        onRetakeQuiz={handleRetakeQuiz}
        onViewReview={handleViewReview}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionContextBar />
      
      <div className="pt-32 lg:pt-28">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Quiz Header */}
            <QuizHeader
              quizTitle={quizData.title}
              currentQuestion={currentQuestion}
              totalQuestions={quizData.totalQuestions}
              timeRemaining={timeRemaining}
              onExit={handleExit}
              onPause={handlePause}
              isPaused={isPaused}
            />

            {/* Progress Bar */}
            <QuizProgress
              currentQuestion={currentQuestion}
              totalQuestions={quizData.totalQuestions}
              answeredQuestions={answeredQuestions}
              flaggedQuestions={flaggedQuestions}
            />

            {/* Question Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                {currentQuestionData && (
                  <QuestionCard
                    question={currentQuestionData}
                    onAnswer={(answer) => handleAnswer(currentQuestion, answer)}
                    onFlag={() => handleFlag(currentQuestion)}
                    selectedAnswer={answers[currentQuestion]}
                    isFlagged={flaggedQuestions.includes(currentQuestion)}
                    showFeedback={showFeedback[currentQuestion]}
                    feedback={showFeedback[currentQuestion]}
                  />
                )}
              </div>
            </div>

            {/* Navigation */}
            <QuizNavigation
              currentQuestion={currentQuestion}
              totalQuestions={quizData.totalQuestions}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmitQuiz}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              isLastQuestion={isLastQuestion}
            />
          </div>

          {/* Sidebar */}
          <QuizSidebar
            questions={quizData.questions}
            currentQuestion={currentQuestion}
            answeredQuestions={answeredQuestions}
            flaggedQuestions={flaggedQuestions}
            onQuestionSelect={handleQuestionSelect}
            isVisible={showSidebar}
            onToggle={() => setShowSidebar(!showSidebar)}
          />
        </div>
      </div>

      {/* Modals */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleConfirmExit}
        progress={{
          answered: answeredQuestions.length,
          total: quizData.totalQuestions,
          timeSpent
        }}
      />

      <PauseModal
        isOpen={showPauseModal}
        onResume={handleResume}
        onExit={handleConfirmExit}
        timeSpent={timeSpent}
      />

      <QuickActionButton />
    </div>
  );
};

export default InteractiveQuizInterface;