import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const QuizResults = ({ 
  results, 
  onRetakeQuiz, 
  onViewReview, 
  onBackToDashboard 
}) => {
  const { 
    score, 
    totalQuestions, 
    correctAnswers, 
    timeSpent, 
    subjectBreakdown, 
    recommendations,
    performanceLevel 
  } = results;

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getPerformanceColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceIcon = () => {
    if (percentage >= 80) return 'Trophy';
    if (percentage >= 60) return 'Target';
    return 'TrendingDown';
  };

  const chartColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            percentage >= 80 ? 'bg-success/10' : percentage >= 60 ? 'bg-warning/10' : 'bg-error/10'
          }`}>
            <Icon 
              name={getPerformanceIcon()} 
              size={32} 
              color={percentage >= 80 ? 'var(--color-success)' : percentage >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Quiz Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        {/* Score Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${getPerformanceColor()}`}>
              {percentage}%
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {correctAnswers} out of {totalQuestions} correct
              </p>
              <p className="text-sm text-muted-foreground">
                Performance Level: <span className={`font-medium ${getPerformanceColor()}`}>
                  {performanceLevel}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-lg font-medium text-foreground">
                  {formatTime(timeSpent)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={20} color="var(--color-success)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-lg font-medium text-foreground">
                  {correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="XCircle" size={20} color="var(--color-error)" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
                <p className="text-lg font-medium text-foreground">
                  {totalQuestions - correctAnswers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Performance by Subject
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="subject" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Bot" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-medium text-foreground">
              AI Study Recommendations
            </h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Lightbulb" size={14} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {recommendation.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendation.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onViewReview}
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
          >
            Review Answers
          </Button>
          
          <Button
            variant="secondary"
            onClick={onRetakeQuiz}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
          >
            Retake Quiz
          </Button>
          
          <Button
            variant="default"
            onClick={onBackToDashboard}
            iconName="Home"
            iconPosition="left"
            iconSize={16}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;