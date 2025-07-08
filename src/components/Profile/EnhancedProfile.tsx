import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  Camera,
  MapPin,
  Link as LinkIcon,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Heart,
  Eye,
  TrendingUp,
  Users,
  FileText,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  Filter,
  Search,
  Grid,
  List,
  BarChart3,
  PieChart,
  Activity,
  Bookmark,
  Flag,
  Gift,
  Crown,
  Flame,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
  points: number;
}

interface Certificate {
  id: string;
  course: string;
  issueDate: string;
  certificateId: string;
  verificationUrl?: string;
  skills: string[];
  grade?: string;
  instructor: string;
}

interface Activity {
  id: string;
  type: 'course_completed' | 'badge_earned' | 'comment_posted' | 'discussion_started' | 'file_shared' | 'milestone_reached';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface SocialLink {
  platform: string;
  url: string;
  verified: boolean;
}

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: string;
  averageScore: number;
  rank: number;
  totalUsers: number;
  badges: number;
  certificates: number;
  contributions: number;
  followers: number;
  following: number;
}

const EnhancedProfile: React.FC = () => {
  const { t } = useLanguage();
  const { progress, getTotalPoints, getAllBadges } = useProgress();
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'certificates' | 'activity' | 'social' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: '',
    website: '',
    skills: [] as string[],
    interests: [] as string[]
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'linkedin', url: '', verified: false },
    { platform: 'github', url: '', verified: false },
    { platform: 'twitter', url: '', verified: false }
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const userStats: UserStats = {
    totalCourses: Object.keys(progress).length,
    completedCourses: Object.values(progress).filter(p => p.progress === 100).length,
    totalPoints: getTotalPoints(),
    currentStreak: 12,
    longestStreak: 25,
    totalStudyTime: '127 jam 45 menit',
    averageScore: 87.5,
    rank: 23,
    totalUsers: 1247,
    badges: getAllBadges().length,
    certificates: 5,
    contributions: 34,
    followers: 156,
    following: 89
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Menyelesaikan kursus pertama',
      icon: '🎯',
      category: 'learning',
      rarity: 'common',
      earned: true,
      earnedDate: '2024-02-01',
      points: 50
    },
    {
      id: '2',
      name: 'Data Master',
      description: 'Menguasai analisis data dengan skor 90+',
      icon: '📊',
      category: 'learning',
      rarity: 'rare',
      earned: true,
      earnedDate: '2024-02-15',
      points: 150
    },
    {
      id: '3',
      name: 'Literature Expert',
      description: 'Ahli tinjauan pustaka - selesaikan 5 kursus literature review',
      icon: '📚',
      category: 'learning',
      rarity: 'epic',
      earned: false,
      progress: 3,
      maxProgress: 5,
      points: 300
    },
    {
      id: '4',
      name: 'Research Pro',
      description: 'Menyelesaikan 10 kursus dengan rating sempurna',
      icon: '🔬',
      category: 'milestone',
      rarity: 'epic',
      earned: false,
      progress: 7,
      maxProgress: 10,
      points: 500
    },
    {
      id: '5',
      name: 'Community Helper',
      description: 'Membantu 50 peserta lain di forum diskusi',
      icon: '🤝',
      category: 'social',
      rarity: 'rare',
      earned: true,
      earnedDate: '2024-03-01',
      points: 200
    },
    {
      id: '6',
      name: 'Streak Master',
      description: 'Belajar 30 hari berturut-turut',
      icon: '🔥',
      category: 'milestone',
      rarity: 'legendary',
      earned: false,
      progress: 12,
      maxProgress: 30,
      points: 1000
    },
    {
      id: '7',
      name: 'Knowledge Sharer',
      description: 'Berbagi 20 resource dengan komunitas',
      icon: '💡',
      category: 'social',
      rarity: 'rare',
      earned: false,
      progress: 8,
      maxProgress: 20,
      points: 250
    },
    {
      id: '8',
      name: 'Early Adopter',
      description: 'Bergabung dalam 100 pengguna pertama',
      icon: '⭐',
      category: 'special',
      rarity: 'legendary',
      earned: true,
      earnedDate: '2024-01-15',
      points: 2000
    }
  ];

  const certificates: Certificate[] = [
    {
      id: '1',
      course: 'Tinjauan Pustaka Sistematis',
      issueDate: '2024-02-01',
      certificateId: 'LPP-2024-001',
      verificationUrl: 'https://verify.lpp-fkui.ac.id/cert/LPP-2024-001',
      skills: ['Literature Review', 'Research Methodology', 'Critical Analysis'],
      grade: 'A',
      instructor: 'Expert LPP FKUI'
    },
    {
      id: '2',
      course: 'Analisis Data SPSS Lanjutan',
      issueDate: '2024-02-15',
      certificateId: 'LPP-2024-002',
      verificationUrl: 'https://verify.lpp-fkui.ac.id/cert/LPP-2024-002',
      skills: ['SPSS', 'Statistical Analysis', 'Data Interpretation'],
      grade: 'A+',
      instructor: 'Expert LPP FKUI'
    },
    {
      id: '3',
      course: 'Systematic Review & Meta-Analysis',
      issueDate: '2024-03-01',
      certificateId: 'LPP-2024-003',
      skills: ['Systematic Review', 'Meta-Analysis', 'RevMan'],
      grade: 'A',
      instructor: 'Expert LPP FKUI'
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'course_completed',
      title: 'Menyelesaikan Kursus',
      description: 'Analisis Data SPSS Lanjutan',
      timestamp: '2024-03-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'badge_earned',
      title: 'Mendapat Badge',
      description: 'Data Master - Menguasai analisis data',
      timestamp: '2024-03-14T15:45:00Z'
    },
    {
      id: '3',
      type: 'discussion_started',
      title: 'Memulai Diskusi',
      description: 'Tips menggunakan RevMan untuk meta-analysis',
      timestamp: '2024-03-13T09:20:00Z'
    },
    {
      id: '4',
      type: 'comment_posted',
      title: 'Berkomentar',
      description: 'Memberikan feedback pada kursus Systematic Review',
      timestamp: '2024-03-12T14:15:00Z'
    },
    {
      id: '5',
      type: 'milestone_reached',
      title: 'Mencapai Milestone',
      description: 'Streak belajar 10 hari berturut-turut',
      timestamp: '2024-03-11T08:00:00Z'
    }
  ];

  const tabs = [
    { id: 'overview' as const, name: 'Ringkasan', icon: User },
    { id: 'achievements' as const, name: 'Pencapaian', icon: Trophy },
    { id: 'certificates' as const, name: 'Sertifikat', icon: Award },
    { id: 'activity' as const, name: 'Aktivitas', icon: Activity },
    { id: 'social' as const, name: 'Sosial', icon: Users },
    { id: 'settings' as const, name: 'Pengaturan', icon: Settings },
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} minggu yang lalu`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'epic': return 'border-purple-500/30';
      case 'legendary': return 'border-yellow-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url) return profile.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=3B82F6&color=fff`;
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: editForm.full_name,
        bio: editForm.bio
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = filterCategory === 'all' || achievement.category === filterCategory;
    const searchMatch = searchTerm === '' || 
      achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
            <span className="text-2xl font-bold text-white">{userStats.completedCourses}</span>
          </div>
          <h3 className="text-blue-200 font-medium">Kursus Selesai</h3>
          <div className="mt-2 text-xs text-blue-300">
            dari {userStats.totalCourses} total kursus
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{userStats.totalPoints}</span>
          </div>
          <h3 className="text-green-200 font-medium">Total Poin</h3>
          <div className="mt-2 text-xs text-green-300">
            Peringkat #{userStats.rank} dari {userStats.totalUsers}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{userStats.currentStreak}</span>
          </div>
          <h3 className="text-yellow-200 font-medium">Streak Hari</h3>
          <div className="mt-2 text-xs text-yellow-300">
            Terpanjang: {userStats.longestStreak} hari
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-400" />
            <span className="text-lg font-bold text-white">{userStats.totalStudyTime}</span>
          </div>
          <h3 className="text-purple-200 font-medium">Waktu Belajar</h3>
          <div className="mt-2 text-xs text-purple-300">
            Rata-rata skor: {userStats.averageScore}%
          </div>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Progress Pembelajaran</h3>
        <div className="space-y-4">
          {Object.entries(progress).slice(0, 5).map(([courseId, courseProgress]) => (
            <div key={courseId} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{courseId}</span>
                <span className="text-blue-300">{Math.round(courseProgress.progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${courseProgress.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Pencapaian Terbaru</h3>
          <button
            onClick={() => setActiveTab('achievements')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)}`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold text-white text-sm">{achievement.name}</h4>
                <p className="text-xs text-white/80 mt-1">{achievement.description}</p>
                <div className="mt-2 text-xs text-white/60">
                  {achievement.earnedDate && formatDate(achievement.earnedDate)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Aktivitas Terbaru</h3>
          <button
            onClick={() => setActiveTab('activity')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                {activity.type === 'course_completed' && <BookOpen className="w-5 h-5 text-white" />}
                {activity.type === 'badge_earned' && <Trophy className="w-5 h-5 text-white" />}
                {activity.type === 'discussion_started' && <MessageCircle className="w-5 h-5 text-white" />}
                {activity.type === 'comment_posted' && <MessageCircle className="w-5 h-5 text-white" />}
                {activity.type === 'milestone_reached' && <Target className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-blue-200 text-sm">{activity.description}</p>
                <p className="text-blue-300 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pencapaian..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="bg-slate-800">Semua Kategori</option>
            <option value="learning" className="bg-slate-800">Pembelajaran</option>
            <option value="social" className="bg-slate-800">Sosial</option>
            <option value="milestone" className="bg-slate-800">Milestone</option>
            <option value="special" className="bg-slate-800">Spesial</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Achievements Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              achievement.earned
                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)}`
                : 'bg-white/5 border-white/20 opacity-60'
            } ${viewMode === 'list' ? 'flex items-center space-x-4' : 'text-center'}`}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                <p className="text-blue-200 text-sm mb-4">{achievement.description}</p>
                
                {/* Progress Bar for Unearned Achievements */}
                {!achievement.earned && achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-300">Progress</span>
                      <span className="text-xs text-blue-300">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-300' :
                    achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                    achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </span>
                  <span className="text-yellow-400 font-medium">{achievement.points} pts</span>
                </div>
                
                {achievement.earned && achievement.earnedDate && (
                  <div className="mt-3 text-green-400 text-sm">
                    Diperoleh: {formatDate(achievement.earnedDate)}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                    <span className="text-yellow-400 font-medium">{achievement.points} pts</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-2">{achievement.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-300' :
                      achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                      achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                    </span>
                    {achievement.earned && achievement.earnedDate && (
                      <span className="text-green-400">
                        Diperoleh: {formatDate(achievement.earnedDate)}
                      </span>
                    )}
                    {!achievement.earned && achievement.progress !== undefined && achievement.maxProgress && (
                      <span className="text-blue-300">
                        Progress: {achievement.progress}/{achievement.maxProgress}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{cert.course}</h3>
                <p className="text-blue-300">ID Sertifikat: {cert.certificateId}</p>
                <p className="text-blue-200 text-sm">Diterbitkan: {formatDate(cert.issueDate)}</p>
                <p className="text-blue-200 text-sm">Instruktur: {cert.instructor}</p>
                {cert.grade && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Grade: {cert.grade}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium text-blue-200 mb-2">Keterampilan yang Dikuasai:</h4>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh</span>
                </motion.button>
                
                {cert.verificationUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verifikasi</span>
                  </motion.button>
                )}
                
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
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Riwayat Aktivitas</h3>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4 inline mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activity.type === 'course_completed' ? 'bg-green-600' :
              activity.type === 'badge_earned' ? 'bg-yellow-600' :
              activity.type === 'discussion_started' ? 'bg-blue-600' :
              activity.type === 'comment_posted' ? 'bg-purple-600' :
              activity.type === 'milestone_reached' ? 'bg-orange-600' :
              'bg-gray-600'
            }`}>
              {activity.type === 'course_completed' && <BookOpen className="w-6 h-6 text-white" />}
              {activity.type === 'badge_earned' && <Trophy className="w-6 h-6 text-white" />}
              {activity.type === 'discussion_started' && <MessageCircle className="w-6 h-6 text-white" />}
              {activity.type === 'comment_posted' && <MessageCircle className="w-6 h-6 text-white" />}
              {activity.type === 'milestone_reached' && <Target className="w-6 h-6 text-white" />}
              {activity.type === 'file_shared' && <FileText className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{activity.title}</h4>
                <span className="text-blue-300 text-sm">{formatTimeAgo(activity.timestamp)}</span>
              </div>
              <p className="text-blue-200 text-sm">{activity.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-8">
      {/* Social Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-white">{userStats.followers}</div>
          <div className="text-blue-200">Pengikut</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-white">{userStats.following}</div>
          <div className="text-blue-200">Mengikuti</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
          <div className="text-2xl font-bold text-white">{userStats.contributions}</div>
          <div className="text-blue-200">Kontribusi</div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Tautan Sosial</h3>
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-white" />}
                {link.platform === 'github' && <Github className="w-5 h-5 text-white" />}
                {link.platform === 'twitter' && <Twitter className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium capitalize">{link.platform}</span>
                  {link.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...socialLinks];
                    newLinks[index].url = e.target.value;
                    setSocialLinks(newLinks);
                  }}
                  placeholder={`Masukkan URL ${link.platform}`}
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Pengaturan Profil</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={getAvatarUrl()}
                alt={profile?.full_name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h4 className="text-white font-medium">Foto Profil</h4>
              <p className="text-blue-300 text-sm">Klik untuk mengubah foto profil</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ceritakan tentang diri Anda..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveProfile}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Simpan Perubahan
            </motion.button>
            <button
              onClick={() => setEditForm({
                full_name: profile?.full_name || '',
                bio: profile?.bio || '',
                location: '',
                website: '',
                skills: [],
                interests: []
              })}
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Pengaturan Privasi</h3>
        <div className="space-y-4">
          {[
            { label: 'Profil Publik', description: 'Izinkan orang lain melihat profil Anda' },
            { label: 'Tampilkan Progress', description: 'Tampilkan progress pembelajaran di profil' },
            { label: 'Tampilkan Pencapaian', description: 'Tampilkan badge dan pencapaian di profil' },
            { label: 'Izinkan Pesan', description: 'Izinkan pengguna lain mengirim pesan' }
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <h4 className="text-white font-medium">{setting.label}</h4>
                <p className="text-blue-300 text-sm">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Pengaturan Notifikasi</h3>
        <div className="space-y-4">
          {[
            { label: 'Email Notifikasi', description: 'Terima notifikasi melalui email' },
            { label: 'Push Notifikasi', description: 'Terima notifikasi push di browser' },
            { label: 'Notifikasi Kursus', description: 'Notifikasi tentang kursus baru dan update' },
            { label: 'Notifikasi Komunitas', description: 'Notifikasi dari diskusi dan komentar' }
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <h4 className="text-white font-medium">{setting.label}</h4>
                <p className="text-blue-300 text-sm">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
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
                src={getAvatarUrl()}
                alt={profile?.full_name}
                className="w-32 h-32 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userStats.currentStreak}</span>
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile?.full_name}</h1>
                  <p className="text-blue-300 mb-1">{profile?.email}</p>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-blue-200">
                    <span className="capitalize">{profile?.role}</span>
                    <span>•</span>
                    <span>Bergabung {profile?.created_at && formatDate(profile.created_at)}</span>
                  </div>
                  {profile?.bio && (
                    <p className="text-blue-100 mt-3 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
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

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Peringkat #{userStats.rank}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <Star className="w-4 h-4" />
                  <span>{userStats.totalPoints} Poin</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <Award className="w-4 h-4" />
                  <span>{userStats.badges} Badge</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-400">
                  <Users className="w-4 h-4" />
                  <span>{userStats.followers} Pengikut</span>
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
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'certificates' && renderCertificates()}
          {activeTab === 'activity' && renderActivity()}
          {activeTab === 'social' && renderSocial()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedProfile;