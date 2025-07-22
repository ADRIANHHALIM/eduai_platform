import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentHeader from './components/AssessmentHeader';
import WelcomeScreen from './components/WelcomeScreen';
import SubjectTransition from './components/SubjectTransition';
import QuestionCard from './components/QuestionCard';
import NavigationControls from './components/NavigationControls';
import ResultsProcessing from './components/ResultsProcessing';

const AIAssessmentOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, transition, question, processing
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock assessment data
  const subjects = ['Math', 'Science', 'English', 'History'];
  
  const questions = {
    Math: [
      {
        id: 1,
        subject: 'Math',
        difficulty: 'Medium',
        timeEstimate: '2 min',
        text: 'If 3x + 7 = 22, what is the value of x?',
        options: [
          { id: 'a', text: 'x = 3' },
          { id: 'b', text: 'x = 5' },
          { id: 'c', text: 'x = 7' },
          { id: 'd', text: 'x = 9' }
        ],
        correctAnswer: 'b',
        explanation: 'To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15, then divide by 3: x = 5.'
      },
      {
        id: 2,
        subject: 'Math',
        difficulty: 'Hard',
        timeEstimate: '3 min',
        text: 'What is the area of a circle with radius 6 units?',
        expression: 'A = πr²',
        options: [
          { id: 'a', text: '12π square units' },
          { id: 'b', text: '36π square units' },
          { id: 'c', text: '18π square units' },
          { id: 'd', text: '24π square units' }
        ],
        correctAnswer: 'b',
        explanation: 'Using the formula A = πr², with r = 6: A = π(6)² = π(36) = 36π square units.'
      }
    ],
    Science: [
      {
        id: 3,
        subject: 'Science',
        difficulty: 'Medium',
        timeEstimate: '2 min',
        text: 'Which of the following is NOT a renewable energy source?',
        options: [
          { id: 'a', text: 'Solar power' },
          { id: 'b', text: 'Wind power' },
          { id: 'c', text: 'Natural gas' },
          { id: 'd', text: 'Hydroelectric power' }
        ],
        correctAnswer: 'c',
        explanation: 'Natural gas is a fossil fuel and is considered non-renewable. Solar, wind, and hydroelectric are all renewable energy sources.'
      },
      {
        id: 4,
        subject: 'Science',
        difficulty: 'Easy',
        timeEstimate: '1 min',
        text: 'What is the chemical symbol for water?',
        options: [
          { id: 'a', text: 'H2O' },
          { id: 'b', text: 'CO2' },
          { id: 'c', text: 'NaCl' },
          { id: 'd', text: 'O2' }
        ],
        correctAnswer: 'a',
        explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula H2O.'
      }
    ],
    English: [
      {
        id: 5,
        subject: 'English',
        difficulty: 'Medium',
        timeEstimate: '2 min',
        text: 'Which sentence uses the correct form of "their," "there," or "they\'re"?',
        options: [
          { id: 'a', text: 'Their going to the store later.' },
          { id: 'b', text: 'The books are over they\'re.' },
          { id: 'c', text: 'They\'re planning to visit there friends.' },
          { id: 'd', text: 'The students left their backpacks there.' }
        ],
        correctAnswer: 'd',
        explanation: '"Their" shows possession (their backpacks), and "there" indicates location (left them there).'
      }
    ],
    History: [
      {
        id: 6,
        subject: 'History',
        difficulty: 'Medium',
        timeEstimate: '2 min',
        text: 'In which year did World War II end?',
        options: [
          { id: 'a', text: '1944' },
          { id: 'b', text: '1945' },
          { id: 'c', text: '1946' },
          { id: 'd', text: '1947' }
        ],
        correctAnswer: 'b',
        explanation: 'World War II ended in 1945 with the surrender of Japan in September, following Germany\'s surrender in May.'
      }
    ]
  };

  const getCurrentQuestions = () => {
    const subjectName = subjects[currentSubject];
    return questions[subjectName] || [];
  };

  const getCurrentQuestion = () => {
    const subjectQuestions = getCurrentQuestions();
    return subjectQuestions[currentQuestion];
  };

  const getTotalSteps = () => {
    return Object.values(questions).reduce((total, subjectQuestions) => total + subjectQuestions.length, 0);
  };

  const getCurrentStepNumber = () => {
    let stepNumber = 0;
    for (let i = 0; i < currentSubject; i++) {
      const subjectName = subjects[i];
      stepNumber += questions[subjectName]?.length || 0;
    }
    return stepNumber + currentQuestion + 1;
  };

  const handleStart = () => {
    setCurrentStep('transition');
  };

  const handleSubjectStart = () => {
    setCurrentStep('question');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {
    if (!showFeedback && selectedAnswer) {
      // Show feedback first
      const question = getCurrentQuestion();
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      setUserAnswers(prev => [...prev, {
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        subject: question.subject
      }]);
      
      setShowFeedback(true);
      return;
    }

    // Move to next question or subject
    const subjectQuestions = getCurrentQuestions();
    
    if (currentQuestion < subjectQuestions.length - 1) {
      // Next question in same subject
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Move to next subject or finish
      if (currentSubject < subjects.length - 1) {
        setCurrentSubject(prev => prev + 1);
        setCurrentStep('transition');
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Assessment complete
        setCurrentStep('processing');
      }
    }
  };

  const handlePrevious = () => {
    if (showFeedback) {
      setShowFeedback(false);
      return;
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else if (currentSubject > 0) {
      setCurrentSubject(prev => prev - 1);
      const prevSubjectQuestions = questions[subjects[currentSubject - 1]] || [];
      setCurrentQuestion(prevSubjectQuestions.length - 1);
      setCurrentStep('question');
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleSkip = () => {
    const question = getCurrentQuestion();
    setUserAnswers(prev => [...prev, {
      questionId: question.id,
      selectedAnswer: null,
      correctAnswer: question.correctAnswer,
      isCorrect: false,
      subject: question.subject,
      skipped: true
    }]);

    // Move to next question
    const subjectQuestions = getCurrentQuestions();
    
    if (currentQuestion < subjectQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (currentSubject < subjects.length - 1) {
        setCurrentSubject(prev => prev + 1);
        setCurrentStep('transition');
        setCurrentQuestion(0);
      } else {
        setCurrentStep('processing');
      }
    }
    
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit the assessment? Your progress will be lost.')) {
      navigate('/student-dashboard');
    }
  };

  const canGoBack = () => {
    return currentQuestion > 0 || currentSubject > 0 || showFeedback;
  };

  const isLastQuestion = () => {
    const subjectQuestions = getCurrentQuestions();
    return currentSubject === subjects.length - 1 && currentQuestion === subjectQuestions.length - 1;
  };

  // Calculate assessment data for results
  const assessmentData = {
    totalQuestions: getTotalSteps(),
    accuracy: userAnswers.length > 0 ? 
      Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100) + '%' : '0%'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - only show during question phase */}
      {currentStep === 'question' && (
        <AssessmentHeader
          currentStep={getCurrentStepNumber()}
          totalSteps={getTotalSteps()}
          onExit={handleExit}
        />
      )}

      {/* Main Content */}
      <div className={`${currentStep === 'question' ? 'pt-24 lg:pt-20' : 'pt-16'} pb-20 px-4 lg:px-6`}>
        <div className="max-w-4xl mx-auto">
          {currentStep === 'welcome' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
              <WelcomeScreen onStart={handleStart} />
            </div>
          )}

          {currentStep === 'transition' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
              <SubjectTransition
                subject={subjects[currentSubject]}
                onContinue={handleSubjectStart}
                questionsRemaining={getCurrentQuestions().length}
                timeEstimate={`${getCurrentQuestions().length * 2} min`}
              />
            </div>
          )}

          {currentStep === 'question' && (
            <div className="space-y-6">
              <QuestionCard
                question={getCurrentQuestion()}
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                isCorrect={selectedAnswer === getCurrentQuestion()?.correctAnswer}
              />
              
              <NavigationControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSkip={handleSkip}
                canGoBack={canGoBack()}
                canGoNext={true}
                isLastQuestion={isLastQuestion()}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
              <ResultsProcessing assessmentData={assessmentData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssessmentOnboarding;