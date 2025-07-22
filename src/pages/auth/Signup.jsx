import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, School, Hash } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    school_name: '',
    grade_level: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { signUp, authError, clearError } = useAuth();
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
    if (!formData.full_name || !formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        full_name: formData.full_name,
        role: formData.role,
        school_name: formData.school_name || null,
        grade_level: formData.grade_level ? parseInt(formData.grade_level) : null
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result?.success) {
        navigate('/student-dashboard');
      } else {
        setLocalError(result?.error || 'Signup failed');
      }
    } catch (error) {
      setLocalError('Something went wrong. Please try again.');
      console.log('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join EduPlatform and start learning
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
              <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address *
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
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                Role *
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'teacher', label: 'Teacher' },
                ]}
              />
            </div>

            <div>
              <label htmlFor="school_name" className="block text-sm font-medium text-foreground mb-1">
                School Name
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="school_name"
                  name="school_name"
                  type="text"
                  placeholder="Enter your school name"
                  value={formData.school_name}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {formData.role === 'student' && (
              <div>
                <label htmlFor="grade_level" className="block text-sm font-medium text-foreground mb-1">
                  Grade Level
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Select
                    id="grade_level"
                    name="grade_level"
                    value={formData.grade_level}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10"
                    options={[
                      { value: '', label: 'Select grade level' },
                      { value: '9', label: 'Grade 9' },
                      { value: '10', label: 'Grade 10' },
                      { value: '11', label: 'Grade 11' },
                      { value: '12', label: 'Grade 12' },
                    ]}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
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
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;