import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CourseProgress {
  courseId: string;
  progress: number;
  completedLessons: string[];
  lastAccessed: Date;
  points: number;
  badges: string[];
}

interface ProgressContextType {
  progress: Record<string, CourseProgress>;
  updateProgress: (courseId: string, lessonId: string, progress: number) => void;
  addPoints: (courseId: string, points: number) => void;
  addBadge: (courseId: string, badge: string) => void;
  getTotalPoints: () => number;
  getAllBadges: () => string[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});

  const updateProgress = (courseId: string, lessonId: string, progressPercent: number) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        courseId,
        progress: progressPercent,
        completedLessons: prev[courseId]?.completedLessons 
          ? [...prev[courseId].completedLessons.filter(id => id !== lessonId), lessonId]
          : [lessonId],
        lastAccessed: new Date(),
        points: prev[courseId]?.points || 0,
        badges: prev[courseId]?.badges || [],
      }
    }));
  };

  const addPoints = (courseId: string, points: number) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        courseId,
        progress: prev[courseId]?.progress || 0,
        completedLessons: prev[courseId]?.completedLessons || [],
        lastAccessed: new Date(),
        points: (prev[courseId]?.points || 0) + points,
        badges: prev[courseId]?.badges || [],
      }
    }));
  };

  const addBadge = (courseId: string, badge: string) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        courseId,
        progress: prev[courseId]?.progress || 0,
        completedLessons: prev[courseId]?.completedLessons || [],
        lastAccessed: new Date(),
        points: prev[courseId]?.points || 0,
        badges: prev[courseId]?.badges ? [...prev[courseId].badges, badge] : [badge],
      }
    }));
  };

  const getTotalPoints = () => {
    return Object.values(progress).reduce((total, course) => total + course.points, 0);
  };

  const getAllBadges = () => {
    return Object.values(progress).flatMap(course => course.badges);
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      updateProgress,
      addPoints,
      addBadge,
      getTotalPoints,
      getAllBadges,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};