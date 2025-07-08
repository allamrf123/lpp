import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  BookOpen, 
  Clock, 
  Star, 
  Trophy, 
  Target,
  Calendar,
  Download,
  Share2,
  Edit,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../contexts/ProgressContext';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { progress, getTotalPoints, getAllBadges } = useProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'achievements' | 'certificates'>('overview');

  const userProfile = {
    name: 'Ahmad Susanto',
    email: 'ahmad.susanto@ui.ac.id',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200',
    joinDate: new Date('2024-01-15'),
    role: 'Peserta',
    level: 'Intermediate Researcher',
    totalPoints: getTotalPoints(),
    badges: getAllBadges(),
    completedCourses: Object.values(progress).filter(p => p.progress === 100).length,
    inProgressCourses: Object.values(progress).filter(p => p.progress > 0 && p.progress < 100).length,
    totalStudyTime: '45 jam 30 menit',
    streak: 12,
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Menyelesaikan kursus pertama', icon: '🎯', earned: true, date: '2024-02-01' },
    { id: 2, name: 'Data Master', description: 'Menguasai analisis data', icon: '📊', earned: true, date: '2024-02-15' },
    { id: 3, name: 'Literature Expert', description: 'Ahli tinjauan pustaka', icon: '📚', earned: false, date: null },
    { id: 4, name: 'Research Pro', description: 'Menyelesaikan 5 kursus', icon: '🔬', earned: false, date: null },
    { id: 5, name: 'Community Helper', description: 'Membantu 10 peserta lain', icon: '🤝', earned: true, date: '2024-03-01' },
    { id: 6, name: 'Streak Master', description: 'Belajar 30 hari berturut-turut', icon: '🔥', earned: false, date: null },
  ];

  const certificates = [
    { id: 1, course: 'Tinjauan Pustaka', issueDate: '2024-02-01', certificateId: 'LPP-2024-001' },
    { id: 2, course: 'Analisis Data SPSS', issueDate: '2024-02-15', certificateId: 'LPP-2024-002' },
  ];

  const tabs = [
    { id: 'overview' as const, name: 'Ringkasan', icon: User },
    { id: 'courses' as const, name: 'Kursus Saya', icon: BookOpen },
    { id: 'achievements' as const, name: 'Pencapaian', icon: Trophy },
    { id: 'certificates' as const, name: 'Sertifikat', icon: Award },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{userProfile.completedCourses}</span>
          </div>
          <h3 className="text-blue-200 font-medium">Kursus Selesai</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{userProfile.inProgressCourses}</span>
          </div>
          <h3 className="text-green-200 font-medium">Sedang Berjalan</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{userProfile.totalPoints}</span>
          </div>
          <h3 className="text-yellow-200 font-medium">Total Poin</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-400" />
            <span className="text-lg font-bold text-white">{userProfile.totalStudyTime}</span>
          </div>
          <h3 className="text-purple-200 font-medium">Waktu Belajar</h3>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {[
            { action: 'Menyelesaikan', target: 'Kursus Analisis Data', time: '2 jam yang lalu', icon: '✅' },
            { action: 'Mendapat badge', target: 'Data Master', time: '1 hari yang lalu', icon: '🏆' },
            { action: 'Bergabung diskusi', target: 'Channel Tanya Jawab', time: '2 hari yang lalu', icon: '💬' },
            { action: 'Memulai kursus', target: 'Systematic Review', time: '3 hari yang lalu', icon: '🚀' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl"
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-medium">{activity.action}</span> {activity.target}
                </p>
                <p className="text-blue-300 text-sm">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      {Object.entries(progress).map(([courseId, courseProgress]) => (
        <motion.div
          key={courseId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{courseId}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              courseProgress.progress === 100 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {courseProgress.progress === 100 ? 'Selesai' : 'Berlangsung'}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-200">Progress</span>
              <span className="text-white font-medium">{Math.round(courseProgress.progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${courseProgress.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-blue-300">
            <span>Pelajaran selesai: {courseProgress.completedLessons.length}</span>
            <span>Poin: {courseProgress.points}</span>
            <span>Terakhir diakses: {formatDate(courseProgress.lastAccessed)}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            achievement.earned
              ? 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-500/30'
              : 'bg-white/5 border-white/20 opacity-60'
          }`}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">{achievement.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
            <p className="text-blue-200 text-sm mb-4">{achievement.description}</p>
            {achievement.earned ? (
              <div className="text-green-400 text-sm">
                Diperoleh: {achievement.date && formatDate(new Date(achievement.date))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Belum diperoleh</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{cert.course}</h3>
                <p className="text-blue-300">ID Sertifikat: {cert.certificateId}</p>
                <p className="text-blue-200 text-sm">Diterbitkan: {formatDate(new Date(cert.issueDate))}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-32 h-32 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userProfile.streak}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
                  <p className="text-blue-300 mb-1">{userProfile.email}</p>
                  <p className="text-blue-200 text-sm">{userProfile.role} • {userProfile.level}</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profil</span>
                  </motion.button>
                  <button className="p-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung {formatDate(userProfile.joinDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <Trophy className="w-4 h-4" />
                  <span>{userProfile.badges.length} Badge</span>
                </div>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span>{userProfile.totalPoints} Poin</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'certificates' && renderCertificates()}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;