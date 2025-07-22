import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { signIn, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (localError) setLocalError(null);
    if (authError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        navigate('/student-dashboard');
      } else {
        setLocalError(result?.error || 'Login failed');
      }
    } catch (error) {
      setLocalError('Something went wrong. Please try again.');
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your EduPlatform account
          </p>
        </div>

        {displayError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-destructive text-sm">{displayError}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Do not have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium text-foreground mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Student:</strong> alex.chen@student.edu / student123</p>
            <p><strong>Teacher:</strong> teacher@school.edu / teacher123</p>
            <p><strong>Admin:</strong> admin@eduplatform.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;