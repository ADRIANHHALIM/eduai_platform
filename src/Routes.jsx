import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
// Add your imports here
import AIAssessmentOnboarding from "pages/ai-assessment-onboarding";
import StudentDashboard from "pages/student-dashboard";
import TeacherDashboard from "pages/teacher-dashboard";
import InteractiveQuizInterface from "pages/interactive-quiz-interface";
import PersonalizedStudySession from "pages/personalized-study-session";
import CollaborativeWhiteboard from "pages/collaborative-whiteboard";
import Login from "pages/auth/Login";
import Signup from "pages/auth/Signup";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your routes here */}
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/ai-assessment-onboarding" element={<AIAssessmentOnboarding />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/interactive-quiz-interface" element={<InteractiveQuizInterface />} />
            <Route path="/personalized-study-session" element={<PersonalizedStudySession />} />
            <Route path="/collaborative-whiteboard" element={<CollaborativeWhiteboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;