import { supabase } from './supabase';

const studyService = {
  // Get student's study sessions
  async getStudySessions(studentId = null) {
    try {
      let query = supabase
        .from('study_sessions').select(`*,subject:subjects(id, name, subject_type)`).order('created_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to load study sessions' };
    }
  },

  // Create a new study session
  async createStudySession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([sessionData])
        .select(`
          *,
          subject:subjects(id, name, subject_type)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to create study session' };
    }
  },

  // Update study session (e.g., mark as completed)
  async updateStudySession(sessionId, updates) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select(`
          *,
          subject:subjects(id, name, subject_type)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to update study session' };
    }
  },

  // Get quiz attempts
  async getQuizAttempts(studentId = null) {
    try {
      let query = supabase
        .from('quiz_attempts')
        .select(`
          *,
          subject:subjects(id, name, subject_type)
        `)
        .order('completed_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to load quiz attempts' };
    }
  },

  // Create quiz attempt
  async createQuizAttempt(attemptData) {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([attemptData])
        .select(`
          *,
          subject:subjects(id, name, subject_type)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to save quiz attempt' };
    }
  },

  // Get student progress analytics
  async getStudentProgress(studentId) {
    try {
      // Get study sessions grouped by subject
      const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select(`
          duration_minutes,
          subject:subjects(id, name, subject_type)
        `)
        .eq('student_id', studentId)
        .not('completed_at', 'is', null);

      if (sessionsError) {
        return { success: false, error: sessionsError.message };
      }

      // Get quiz attempts grouped by subject
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quiz_attempts')
        .select(`
          score,
          correct_answers,
          total_questions,
          subject:subjects(id, name, subject_type)
        `)
        .eq('student_id', studentId);

      if (quizzesError) {
        return { success: false, error: quizzesError.message };
      }

      // Process data to create progress overview
      const progressData = {};
      
      // Process study sessions
      sessions?.forEach(session => {
        const subjectName = session?.subject?.name;
        if (!progressData[subjectName]) {
          progressData[subjectName] = {
            name: subjectName,
            totalHours: 0,
            quizCount: 0,
            avgScore: 0,
            sessionCount: 0
          };
        }
        progressData[subjectName].totalHours += (session?.duration_minutes || 0) / 60;
        progressData[subjectName].sessionCount += 1;
      });

      // Process quiz attempts
      quizzes?.forEach(quiz => {
        const subjectName = quiz?.subject?.name;
        if (!progressData[subjectName]) {
          progressData[subjectName] = {
            name: subjectName,
            totalHours: 0,
            quizCount: 0,
            avgScore: 0,
            sessionCount: 0
          };
        }
        progressData[subjectName].quizCount += 1;
        progressData[subjectName].avgScore = 
          ((progressData[subjectName].avgScore * (progressData[subjectName].quizCount - 1)) + (quiz?.score || 0)) / 
          progressData[subjectName].quizCount;
      });

      const progress = Object.values(progressData);

      return { success: true, data: progress };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Please check your connection.'
        };
      }
      return { success: false, error: 'Failed to load progress data' };
    }
  }
};

export default studyService;