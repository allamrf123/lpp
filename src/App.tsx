import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseGrid from './components/CourseGrid';
import CourseDetail from './components/CourseDetail';
import AdvancedCommunityChat from './components/Community/AdvancedCommunityChat';
import EnhancedProfile from './components/Profile/EnhancedProfile';
import ProtectedRoute from './components/ProtectedRoute';
import ZapierChatbot from './components/ZapierChatbot';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProgressProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <CourseGrid />
                  </>
                } />
                <Route path="/kursus/:id" element={<CourseDetail />} />
                <Route path="/komunitas" element={
                  <ProtectedRoute>
                    <AdvancedCommunityChat />
                  </ProtectedRoute>
                } />
                <Route path="/profil" element={
                  <ProtectedRoute>
                    <EnhancedProfile />
                  </ProtectedRoute>
                } />
              </Routes>
              <ZapierChatbot />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(10px)',
                  },
                }}
              />
            </div>
          </Router>
        </ProgressProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;