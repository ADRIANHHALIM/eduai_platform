import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentQuizResults = ({ quizResults }) => {
  const navigate = useNavigate();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      case 'stable': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRetakeQuiz = (quiz) => {
    navigate('/interactive-quiz-interface');
  };

  const handleViewDetails = (quiz) => {
    // Could navigate to a detailed quiz results page
    console.log('View quiz details:', quiz.id);
  };

  return (
    <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Quiz Results</h2>
        <Icon name="BarChart3" size={20} className="text-primary" />
      </div>
      
      {quizResults.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="ClipboardX" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No quiz results yet</p>
          <p className="text-sm text-muted-foreground mt-1">Take your first quiz to see results here</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/interactive-quiz-interface')}
            className="mt-4"
          >
            Take Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {quizResults.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors duration-150"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreBgColor(quiz.score)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(quiz.score)}`}>
                    {quiz.score}%
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{quiz.title}</h3>
                    <Icon 
                      name={getTrendIcon(quiz.trend)} 
                      size={16} 
                      className={getTrendColor(quiz.trend)} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{quiz.subject}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Icon name="Calendar" size={12} className="mr-1" />
                      {formatDate(quiz.completedAt)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {quiz.timeSpent} min
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      {quiz.correctAnswers}/{quiz.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(quiz)}
                >
                  Details
                </Button>
                {quiz.score < 80 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetakeQuiz(quiz)}
                  >
                    Retake
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/interactive-quiz-interface')}
              iconName="Plus"
              iconPosition="left"
              className="w-full"
            >
              Take New Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentQuizResults;