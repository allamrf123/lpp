import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  MessageCircle,
  Star,
  Award,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';
import InteractiveChart from './InteractiveChart';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { progress, updateProgress, addPoints } = useProgress();
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Course mapping to ensure content matches catalog
  const courseMapping: Record<string, any> = {
    'literature-review': {
      title: t('course.literature-review'),
      description: 'Pelajari cara melakukan tinjauan pustaka yang sistematis dan komprehensif untuk penelitian ilmiah. Kursus ini mencakup metodologi pencarian, evaluasi kritis, dan sintesis literatur.',
      instructor: t('course.instructor'),
      duration: '6 jam',
      totalLessons: 12,
      students: 234,
      rating: 4.8,
      level: 'beginner',
      category: 'literature-proposal',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      color: 'from-blue-500 to-indigo-600',
    },
    'proposal-bab1': {
      title: t('course.proposal-bab1'),
      description: 'Panduan lengkap menyusun BAB 1 proposal penelitian dengan struktur yang tepat.',
      instructor: t('course.instructor'),
      duration: '4 jam',
      totalLessons: 8,
      students: 189,
      rating: 4.7,
      level: 'beginner',
      category: 'literature-proposal',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg',
      color: 'from-green-500 to-emerald-600',
    },
    'proposal-bab2': {
      title: t('course.proposal-bab2'),
      description: 'Teknik menyusun tinjauan pustaka dan landasan teori dalam BAB 2 proposal.',
      instructor: t('course.instructor'),
      duration: '5 jam',
      totalLessons: 10,
      students: 167,
      rating: 4.6,
      level: 'beginner',
      category: 'literature-proposal',
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-purple-500 to-violet-600',
    },
    'proposal-bab3': {
      title: t('course.proposal-bab3'),
      description: 'Metodologi penelitian dan rancangan penelitian dalam BAB 3 proposal.',
      instructor: t('course.instructor'),
      duration: '6 jam',
      totalLessons: 12,
      students: 145,
      rating: 4.8,
      level: 'beginner',
      category: 'literature-proposal',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      color: 'from-red-500 to-pink-600',
    },
    'data-analysis': {
      title: t('course.data-analysis'),
      description: 'Kuasai analisis data menggunakan SPSS, Stata, R, dan tools statistik lainnya.',
      instructor: t('course.instructor'),
      duration: '12 jam',
      totalLessons: 24,
      students: 456,
      rating: 4.9,
      level: 'intermediate',
      category: 'data-statistics',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg',
      color: 'from-blue-500 to-cyan-600',
    },
    'systematic-review': {
      title: t('course.systematic-review'),
      description: 'Metodologi systematic review dari pencarian literatur hingga sintesis hasil.',
      instructor: t('course.instructor'),
      duration: '20 jam',
      totalLessons: 40,
      students: 123,
      rating: 4.9,
      level: 'intermediate',
      category: 'systematic-meta',
      image: 'https://images.pexels.com/photos/4386345/pexels-photo-4386345.jpeg',
      color: 'from-purple-500 to-indigo-600',
    },
    'meta-analysis': {
      title: t('course.meta-analysis'),
      description: 'Meta analisis konvensional menggunakan RevMan dan software lainnya.',
      instructor: t('course.instructor'),
      duration: '18 jam',
      totalLessons: 36,
      students: 78,
      rating: 4.8,
      level: 'advanced',
      category: 'systematic-meta',
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
      color: 'from-red-500 to-pink-600',
    },
    'translate-en-id': {
      title: t('course.translate-en-id'),
      description: 'Teknik terjemahan profesional dari bahasa Inggris ke Indonesia untuk dokumen akademik.',
      instructor: t('course.instructor'),
      duration: '8 jam',
      totalLessons: 16,
      students: 189,
      rating: 4.7,
      level: 'beginner',
      category: 'language',
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-blue-500 to-indigo-600',
    },
    'translate-id-en': {
      title: t('course.translate-id-en'),
      description: 'Teknik terjemahan profesional dari bahasa Indonesia ke Inggris untuk publikasi internasional.',
      instructor: t('course.instructor'),
      duration: '8 jam',
      totalLessons: 16,
      students: 167,
      rating: 4.6,
      level: 'beginner',
      category: 'language',
      image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      color: 'from-green-500 to-emerald-600',
    },
    'scientific-ppt': {
      title: t('course.scientific-ppt'),
      description: 'Teknik membuat presentasi ilmiah yang menarik dan profesional.',
      instructor: t('course.instructor'),
      duration: '6 jam',
      totalLessons: 12,
      students: 234,
      rating: 4.8,
      level: 'intermediate',
      category: 'presentation',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      color: 'from-orange-500 to-red-600',
    },
    'ppds-exam': {
      title: t('course.ppds-exam'),
      description: 'Persiapan ujian kasus PPDS dengan contoh kasus dan pembahasan lengkap.',
      instructor: t('course.instructor'),
      duration: '15 jam',
      totalLessons: 30,
      students: 89,
      rating: 4.9,
      level: 'advanced',
      category: 'exam',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
      color: 'from-purple-500 to-pink-600',
    }
  };

  // Get course data from mapping or fallback
  const course = courseMapping[id || ''] || {
    id: id || '',
    title: 'Kursus Tidak Ditemukan',
    description: 'Kursus yang Anda cari tidak tersedia.',
    instructor: t('course.instructor'),
    duration: '0 jam',
    totalLessons: 0,
    students: 0,
    rating: 0,
    level: 'beginner',
    category: 'general',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    color: 'from-gray-500 to-gray-600',
  };

  // Generate lessons based on course type
  const generateLessons = (courseId: string, totalLessons: number) => {
    const baseLessons = [
      {
        id: 1,
        title: `Pengenalan ${course.title}`,
        duration: '30 menit',
        type: 'video',
        completed: false,
        description: `Dasar-dasar ${course.title.toLowerCase()}`
      },
      {
        id: 2,
        title: 'Konsep dan Metodologi',
        duration: '45 menit',
        type: 'video',
        completed: false,
        description: 'Memahami konsep dan metodologi yang digunakan'
      },
      {
        id: 3,
        title: 'Praktik dan Latihan',
        duration: '40 menit',
        type: 'interactive',
        completed: false,
        description: 'Latihan praktis dan studi kasus'
      },
      {
        id: 4,
        title: 'Analisis Data dan Visualisasi',
        duration: '35 menit',
        type: 'chart',
        completed: false,
        description: 'Memahami data melalui visualisasi interaktif'
      }
    ];

    // Add more lessons based on total count
    const additionalLessons = [];
    for (let i = 5; i <= totalLessons; i++) {
      additionalLessons.push({
        id: i,
        title: `Materi Lanjutan ${i - 4}`,
        duration: `${25 + Math.floor(Math.random() * 20)} menit`,
        type: ['video', 'interactive', 'chart'][Math.floor(Math.random() * 3)] as 'video' | 'interactive' | 'chart',
        completed: false,
        description: `Pembahasan mendalam materi ${i - 4}`
      });
    }

    return [...baseLessons, ...additionalLessons];
  };

  const lessons = generateLessons(id || '', course.totalLessons);

  const currentProgress = progress[course.id]?.progress || 0;
  const completedLessons = progress[course.id]?.completedLessons || [];

  const handleLessonComplete = (lessonId: number) => {
    const newProgress = ((completedLessons.length + 1) / lessons.length) * 100;
    updateProgress(course.id, lessonId.toString(), newProgress);
    addPoints(course.id, 10);
  };

  const renderLessonContent = () => {
    const lesson = lessons[selectedLesson];
    
    switch (lesson.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <VideoPlayer
              title={lesson.title}
              description={lesson.description}
              onComplete={() => handleLessonComplete(lesson.id)}
            />
            <CommentSection lessonId={lesson.id.toString()} />
          </div>
        );
      case 'interactive':
        return (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">{lesson.title}</h3>
            <p className="text-blue-100 mb-6">{lesson.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Checklist Evaluasi</h4>
                <div className="space-y-3">
                  {['Kredibilitas penulis', 'Metodologi penelitian', 'Relevansi topik', 'Aktualitas publikasi'].map((item, index) => (
                    <label key={index} className="flex items-center space-x-3 text-blue-100">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Contoh Evaluasi</h4>
                <p className="text-blue-100 text-sm">
                  Artikel ini ditulis oleh peneliti terkemuka di bidangnya dengan metodologi yang solid...
                </p>
              </div>
            </div>
            <CommentSection lessonId={lesson.id.toString()} />
          </div>
        );
      case 'chart':
        return (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">{lesson.title}</h3>
              <p className="text-blue-100 mb-6">{lesson.description}</p>
              <InteractiveChart />
            </div>
            <CommentSection lessonId={lesson.id.toString()} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Course Image */}
              <div className="lg:w-1/3">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-80`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowVideoPlayer(true)}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="lg:w-2/3 space-y-6">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {t(`course.level.${course.level}`)}
                    </span>
                    <span className="text-blue-200">{course.category}</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    {course.title}
                  </h1>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">LPP</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{course.instructor}</div>
                    <div className="text-blue-300 text-sm">Instruktur Ahli</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.totalLessons} pelajaran</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>{course.students} peserta</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Progress Kursus</span>
                    <span className="text-blue-300">{Math.round(currentProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Mulai Belajar</span>
                  </motion.button>
                  <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl flex items-center space-x-2 hover:bg-white/20 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>Simpan</span>
                  </button>
                  <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl flex items-center space-x-2 hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Daftar Pelajaran</h3>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedLesson(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedLesson === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-blue-100 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{lesson.title}</span>
                      {completedLessons.includes(lesson.id.toString()) && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm opacity-80">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedLesson}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderLessonContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <VideoPlayer
          title={course.title}
          description={course.description}
          isModal={true}
          onClose={() => setShowVideoPlayer(false)}
          onComplete={() => handleLessonComplete(1)}
        />
      )}
    </div>
  );
};

export default CourseDetail;