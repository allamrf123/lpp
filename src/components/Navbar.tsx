import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Globe, Menu, X, BookOpen, Users, User, LogIn, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './Auth/AuthModal';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { language, toggleLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: t('nav.beranda'), href: '/', icon: BookOpen },
    { name: t('nav.komunitas'), href: '/komunitas', icon: Users },
    { name: t('nav.profil'), href: '/profil', icon: User },
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=3B82F6&color=fff`;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center transform rotate-12">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">LPP FKUI</h1>
                <p className="text-xs text-blue-200">Platform Pembelajaran</p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder={t('nav.search')}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                        location.pathname === item.href
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-blue-100 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/profil"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <img
                        src={getAvatarUrl()}
                        alt={profile?.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white text-sm font-medium">
                        {profile?.full_name}
                      </span>
                    </Link>
                    
                    <button
                      onClick={signOut}
                      className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Keluar"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 rounded-lg text-blue-100 hover:bg-white/20 hover:text-white transition-all duration-300 flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </button>
                  
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Daftar
                  </button>
                </>
              )}
              
              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                <span className="ml-1 text-xs">{language.toUpperCase()}</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/20 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/10 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('nav.search')}
                  />
                </div>

                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg mb-4">
                      <img
                        src={getAvatarUrl()}
                        alt={profile?.full_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-white font-medium">{profile?.full_name}</div>
                        <div className="text-blue-300 text-sm capitalize">{profile?.role}</div>
                      </div>
                    </div>

                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center space-x-3 ${
                          location.pathname === item.href
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-100 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={signOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/20 hover:text-white transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Masuk</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleAuthClick('register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Daftar
                    </button>
                  </>
                )}
                
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Bahasa: {language === 'id' ? 'Indonesia' : 'English'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;