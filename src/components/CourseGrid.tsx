import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  Award, 
  Play, 
  Star,
  FileText,
  BarChart3,
  Search,
  Globe,
  Presentation,
  GraduationCap,
  Database,
  Microscope,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../contexts/ProgressContext';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  color: string;
  icon: React.ComponentType<any>;
  tags: string[];
  instructor: string;
  price?: string;
}

const CourseGrid: React.FC = () => {
  const { t } = useLanguage();
  const { progress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const courses: Course[] = [
    // Literature Review & Proposal
    {
      id: 'literature-review',
      title: t('course.literature-review'),
      description: 'Pelajari cara melakukan tinjauan pustaka yang sistematis dan komprehensif untuk penelitian ilmiah.',
      category: 'literature-proposal',
      level: 'beginner',
      duration: '6 jam',
      lessons: 12,
      students: 234,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      color: 'from-blue-500 to-indigo-600',
      icon: BookOpen,
      tags: ['Penelitian', 'Akademik', 'Pustaka'],
      instructor: t('course.instructor'),
      price: 'Gratis'
    },
    {
      id: 'proposal-bab1',
      title: t('course.proposal-bab1'),
      description: 'Panduan lengkap menyusun BAB 1 proposal penelitian dengan struktur yang tepat.',
      category: 'literature-proposal',
      level: 'beginner',
      duration: '4 jam',
      lessons: 8,
      students: 189,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg',
      color: 'from-green-500 to-emerald-600',
      icon: FileText,
      tags: ['Proposal', 'Penelitian', 'BAB 1'],
      instructor: t('course.instructor')
    },
    {
      id: 'proposal-bab2',
      title: t('course.proposal-bab2'),
      description: 'Teknik menyusun tinjauan pustaka dan landasan teori dalam BAB 2 proposal.',
      category: 'literature-proposal',
      level: 'beginner',
      duration: '5 jam',
      lessons: 10,
      students: 167,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-purple-500 to-violet-600',
      icon: FileText,
      tags: ['Proposal', 'Tinjauan Pustaka', 'BAB 2'],
      instructor: t('course.instructor')
    },
    {
      id: 'proposal-bab3',
      title: t('course.proposal-bab3'),
      description: 'Metodologi penelitian dan rancangan penelitian dalam BAB 3 proposal.',
      category: 'literature-proposal',
      level: 'beginner',
      duration: '6 jam',
      lessons: 12,
      students: 145,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      color: 'from-red-500 to-pink-600',
      icon: FileText,
      tags: ['Proposal', 'Metodologi', 'BAB 3'],
      instructor: t('course.instructor')
    },

    // Penulisan Akademik & Tesis
    {
      id: 'tesis-bab1',
      title: t('course.tesis-bab1'),
      description: 'Panduan menyusun pendahuluan dan latar belakang dalam BAB 1 tesis.',
      category: 'academic-thesis',
      level: 'intermediate',
      duration: '5 jam',
      lessons: 10,
      students: 123,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
      color: 'from-yellow-500 to-orange-600',
      icon: GraduationCap,
      tags: ['Tesis', 'Pendahuluan', 'BAB 1'],
      instructor: t('course.instructor')
    },
    {
      id: 'tesis-bab2',
      title: t('course.tesis-bab2'),
      description: 'Teknik menyusun tinjauan pustaka komprehensif dalam BAB 2 tesis.',
      category: 'academic-thesis',
      level: 'intermediate',
      duration: '7 jam',
      lessons: 14,
      students: 98,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      color: 'from-teal-500 to-cyan-600',
      icon: GraduationCap,
      tags: ['Tesis', 'Tinjauan Pustaka', 'BAB 2'],
      instructor: t('course.instructor')
    },
    {
      id: 'tesis-bab3',
      title: t('course.tesis-bab3'),
      description: 'Metodologi penelitian detail dan rancangan penelitian tesis.',
      category: 'academic-thesis',
      level: 'intermediate',
      duration: '8 jam',
      lessons: 16,
      students: 87,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/4386345/pexels-photo-4386345.jpeg',
      color: 'from-indigo-500 to-purple-600',
      icon: GraduationCap,
      tags: ['Tesis', 'Metodologi', 'BAB 3'],
      instructor: t('course.instructor')
    },
    {
      id: 'tesis-bab4',
      title: t('course.tesis-bab4'),
      description: 'Analisis hasil penelitian dan pembahasan dalam BAB 4 tesis.',
      category: 'academic-thesis',
      level: 'advanced',
      duration: '10 jam',
      lessons: 20,
      students: 76,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
      color: 'from-pink-500 to-rose-600',
      icon: GraduationCap,
      tags: ['Tesis', 'Analisis', 'BAB 4'],
      instructor: t('course.instructor')
    },
    {
      id: 'tesis-bab5-6',
      title: t('course.tesis-bab5-6'),
      description: 'Kesimpulan, saran, dan penutup dalam BAB 5-6 tesis.',
      category: 'academic-thesis',
      level: 'advanced',
      duration: '6 jam',
      lessons: 12,
      students: 65,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      color: 'from-emerald-500 to-teal-600',
      icon: GraduationCap,
      tags: ['Tesis', 'Kesimpulan', 'BAB 5-6'],
      instructor: t('course.instructor')
    },

    // Analisis Data & Statistik
    {
      id: 'data-analysis',
      title: t('course.data-analysis'),
      description: 'Kuasai analisis data menggunakan SPSS, Stata, R, dan tools statistik lainnya.',
      category: 'data-statistics',
      level: 'intermediate',
      duration: '12 jam',
      lessons: 24,
      students: 456,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg',
      color: 'from-blue-500 to-cyan-600',
      icon: BarChart3,
      tags: ['SPSS', 'Stata', 'R', 'Statistik'],
      instructor: t('course.instructor')
    },
    {
      id: 'data-entry',
      title: t('course.data-entry'),
      description: 'Teknik entry data yang efisien ke berbagai sistem HIS, EHR, dan spreadsheet.',
      category: 'data-management',
      level: 'intermediate',
      duration: '4 jam',
      lessons: 8,
      students: 345,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      color: 'from-green-500 to-emerald-600',
      icon: Database,
      tags: ['Data Entry', 'HIS', 'EHR', 'Spreadsheet'],
      instructor: t('course.instructor')
    },

    // Review Sistematis & Meta-Analisis
    {
      id: 'systematic-review',
      title: t('course.systematic-review'),
      description: 'Metodologi systematic review dari pencarian literatur hingga sintesis hasil.',
      category: 'systematic-meta',
      level: 'intermediate',
      duration: '20 jam',
      lessons: 40,
      students: 123,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/4386345/pexels-photo-4386345.jpeg',
      color: 'from-purple-500 to-indigo-600',
      icon: Microscope,
      tags: ['Systematic Review', 'Meta-analisis', 'Penelitian'],
      instructor: t('course.instructor')
    },
    {
      id: 'meta-analysis',
      title: t('course.meta-analysis'),
      description: 'Meta analisis konvensional menggunakan RevMan dan software lainnya.',
      category: 'systematic-meta',
      level: 'advanced',
      duration: '18 jam',
      lessons: 36,
      students: 78,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
      color: 'from-red-500 to-pink-600',
      icon: Microscope,
      tags: ['Meta-analisis', 'RevMan', 'Statistik'],
      instructor: t('course.instructor')
    },

    // Bahasa
    {
      id: 'translate-en-id',
      title: t('course.translate-en-id'),
      description: 'Teknik terjemahan profesional dari bahasa Inggris ke Indonesia untuk dokumen akademik.',
      category: 'language',
      level: 'beginner',
      duration: '8 jam',
      lessons: 16,
      students: 189,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-blue-500 to-indigo-600',
      icon: Globe,
      tags: ['Terjemahan', 'English', 'Indonesia'],
      instructor: t('course.instructor')
    },
    {
      id: 'translate-id-en',
      title: t('course.translate-id-en'),
      description: 'Teknik terjemahan profesional dari bahasa Indonesia ke Inggris untuk publikasi internasional.',
      category: 'language',
      level: 'beginner',
      duration: '8 jam',
      lessons: 16,
      students: 167,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-green-500 to-emerald-600',
      icon: Globe,
      tags: ['Terjemahan', 'Indonesia', 'English'],
      instructor: t('course.instructor')
    },

    // Presentasi Ilmiah
    {
      id: 'scientific-ppt',
      title: t('course.scientific-ppt'),
      description: 'Teknik membuat presentasi ilmiah yang menarik dan profesional.',
      category: 'presentation',
      level: 'intermediate',
      duration: '6 jam',
      lessons: 12,
      students: 234,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      color: 'from-orange-500 to-red-600',
      icon: Presentation,
      tags: ['Presentasi', 'PowerPoint', 'Ilmiah'],
      instructor: t('course.instructor')
    },

    // Ujian Kasus
    {
      id: 'ppds-exam',
      title: t('course.ppds-exam'),
      description: 'Persiapan ujian kasus PPDS dengan contoh kasus dan pembahasan lengkap.',
      category: 'exam',
      level: 'advanced',
      duration: '15 jam',
      lessons: 30,
      students: 89,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
      color: 'from-purple-500 to-pink-600',
      icon: GraduationCap,
      tags: ['PPDS', 'Ujian', 'Kasus'],
      instructor: t('course.instructor')
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Kategori', icon: BookOpen },
    { id: 'literature-proposal', name: t('category.literature-proposal'), icon: FileText },
    { id: 'academic-thesis', name: t('category.academic-thesis'), icon: GraduationCap },
    { id: 'data-statistics', name: t('category.data-statistics'), icon: BarChart3 },
    { id: 'systematic-meta', name: t('category.systematic-meta'), icon: Microscope },
    { id: 'data-management', name: t('category.data-management'), icon: Database },
    { id: 'presentation', name: t('category.presentation'), icon: Presentation },
    { id: 'exam', name: t('category.exam'), icon: Award },
    { id: 'language', name: t('category.language'), icon: Globe },
  ];

  const levels = [
    { id: 'all', name: 'Semua Level' },
    { id: 'beginner', name: t('course.level.beginner') },
    { id: 'intermediate', name: t('course.level.intermediate') },
    { id: 'advanced', name: t('course.level.advanced') },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
      const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
      const searchMatch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return categoryMatch && levelMatch && searchMatch;
    });
  }, [selectedCategory, selectedLevel, searchTerm]);

  const getCourseProgress = (courseId: string) => {
    return progress[courseId]?.progress || 0;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/90 text-white';
      case 'intermediate': return 'bg-yellow-500/90 text-white';
      case 'advanced': return 'bg-red-500/90 text-white';
      default: return 'bg-gray-500/90 text-white';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return t('course.level.beginner');
      case 'intermediate': return t('course.level.intermediate');
      case 'advanced': return t('course.level.advanced');
      default: return level;
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Pilih <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Kursus</span> Anda
        </h2>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Jelajahi koleksi lengkap kursus penelitian dan pengkajian ilmiah dengan pengalaman belajar interaktif
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kursus berdasarkan nama, deskripsi, atau tag..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-4 text-center">
            <Filter className="w-4 h-4 inline mr-2" />
            Kategori Kursus
          </label>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-4 text-center">
            <Award className="w-4 h-4 inline mr-2" />
            Tingkat Kesulitan
          </label>
          <div className="flex justify-center gap-3">
            {levels.map(level => (
              <motion.button
                key={level.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedLevel === level.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                {level.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(course.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group relative"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 relative">
                {/* Course Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    animate={{
                      scale: hoveredCard === course.id ? 1.1 : 1
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-80`} />
                  
                  {/* Floating Icon */}
                  <motion.div
                    className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    animate={{
                      rotate: hoveredCard === course.id ? 360 : 0,
                      scale: hoveredCard === course.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <course.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Level Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {getCourseProgress(course.id) > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white font-medium">Progress</span>
                        <span className="text-xs text-white">{Math.round(getCourseProgress(course.id))}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getCourseProgress(course.id)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <AnimatePresence>
                    {hoveredCard === course.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center cursor-pointer"
                        >
                          <Play className="w-10 h-10 text-white ml-1" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">LPP</span>
                    </div>
                    <span className="text-blue-200 text-sm">{course.instructor}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-blue-200">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons} {t('course.lessons')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{course.students} {t('course.students')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link to={`/kursus/${course.id}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>
                          {getCourseProgress(course.id) > 0 ? t('course.continue') : t('course.start')}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Price */}
                  {course.price && (
                    <div className="mt-4 text-center">
                      <span className="text-green-400 font-bold text-lg">{course.price}</span>
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                <AnimatePresence>
                  {hoveredCard === course.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Tidak ada kursus ditemukan</h3>
          <p className="text-blue-200">Coba ubah filter pencarian atau kata kunci Anda</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSearchTerm('');
            }}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Reset Filter
          </motion.button>
        </motion.div>
      )}

      {/* Course Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Kursus', value: courses.length, icon: BookOpen, color: 'from-blue-500 to-indigo-500' },
          { label: 'Kategori', value: categories.length - 1, icon: Filter, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Peserta', value: courses.reduce((sum, course) => sum + course.students, 0), icon: Users, color: 'from-purple-500 to-pink-500' },
          { label: 'Rating Rata-rata', value: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1), icon: Star, color: 'from-yellow-500 to-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white text-center`}
          >
            <stat.icon className="w-8 h-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CourseGrid;