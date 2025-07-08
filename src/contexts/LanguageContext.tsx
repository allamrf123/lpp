import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'id' | 'en';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  id: {
    // Navigasi
    'nav.beranda': 'Beranda',
    'nav.kursus': 'Kursus',
    'nav.komunitas': 'Komunitas',
    'nav.profil': 'Profil',
    'nav.search': 'Cari kursus...',
    
    // Hero Section - Updated subtitle
    'hero.title': 'Kursus Lembaga Penelitian Pengkajian (LPP) FKUI',
    'hero.subtitle': 'Platform pembelajaran interaktif LPP FKUI untuk penelitian dan pengkajian ilmiah',
    'hero.cta': 'Mulai Belajar',
    'hero.explore': 'Jelajahi Kursus',
    
    // Kursus
    'course.level.beginner': 'Pemula',
    'course.level.intermediate': 'Menengah',
    'course.level.advanced': 'Lanjutan',
    'course.duration': 'Durasi',
    'course.lessons': 'Pelajaran',
    'course.students': 'Peserta',
    'course.start': 'Mulai Kursus',
    'course.continue': 'Lanjutkan',
    'course.completed': 'Selesai',
    'course.instructor': 'Expert LPP FKUI',
    
    // Materi Kursus - Literature Review & Proposal
    'course.literature-review': 'Tinjauan Pustaka / Literature Review',
    'course.proposal-bab1': 'Proposal (BAB 1)',
    'course.proposal-bab2': 'Proposal (BAB 2)',
    'course.proposal-bab3': 'Proposal (BAB 3)',
    
    // Penulisan Akademik & Tesis
    'course.tesis-bab1': 'Tesis (BAB 1)',
    'course.tesis-bab2': 'Tesis (BAB 2)',
    'course.tesis-bab3': 'Tesis (BAB 3)',
    'course.tesis-bab4': 'Tesis (BAB 4)',
    'course.tesis-bab5-6': 'Tesis (BAB 5-6)',
    'course.formatting-artikel': 'Formatting Artikel',
    'course.penulisan-artikel': 'Penulisan Artikel untuk Jurnal Ilmiah',
    
    // Analisis Data & Statistik
    'course.data-analysis': 'Analisis Data (SPSS/Stata/R/dll)',
    'course.meta-analysis': 'Meta Analisis Konvensional (Revman)',
    'course.network-meta': 'Meta Analisis Jaringan atau Bioinformatic',
    'course.data-collection': 'Pengambilan Data Full',
    
    // Review Sistematis & Meta-Analisis
    'course.systematic-review': 'Systematic Review',
    'course.ebcr-full': 'EBCR Full (Word)',
    'course.ebcr-appraisal': 'EBCR (hanya appraisal)',
    
    // Data Entry & Manajemen Data
    'course.data-entry': 'Data Entry (HIS/EHR/Spreadsheet/dll)',
    
    // Presentasi Ilmiah
    'course.scientific-ppt': 'PPT Ilmiah',
    
    // Ujian Kasus
    'course.ppds-exam': 'Ujian Kasus PPDS',
    
    // Bahasa
    'course.translate-en-id': 'Translate English-Indo',
    'course.translate-id-en': 'Translate Indo-English',
    
    // Kategori
    'category.literature-proposal': 'Literature Review & Proposal',
    'category.academic-thesis': 'Penulisan Akademik & Tesis',
    'category.data-statistics': 'Analisis Data & Statistik',
    'category.systematic-meta': 'Review Sistematis & Meta-Analisis',
    'category.data-management': 'Data Entry & Manajemen Data',
    'category.presentation': 'Presentasi Ilmiah',
    'category.exam': 'Ujian Kasus',
    'category.language': 'Bahasa',
    
    // Komunitas
    'community.title': 'Komunitas Diskusi',
    'community.general': 'Diskusi Umum',
    'community.qa': 'Tanya Jawab',
    'community.announcements': 'Pengumuman',
    
    // UI Elements
    'button.close': 'Tutup',
    'button.save': 'Simpan',
    'button.cancel': 'Batal',
    'button.next': 'Selanjutnya',
    'button.previous': 'Sebelumnya',
    'comment.add': 'Tambah Komentar',
    'comment.reply': 'Balas',
    
    // Video Player
    'video.play': 'Putar',
    'video.pause': 'Jeda',
    'video.speed': 'Kecepatan',
    'video.volume': 'Volume',
    'video.fullscreen': 'Layar Penuh',
    'video.zoom': 'Zoom',
    'video.quality': 'Kualitas',
    'video.subtitles': 'Subtitle',
    'video.language': 'Bahasa',
    'video.annotations': 'Anotasi',
    'video.forward': 'Maju',
    'video.rewind': 'Mundur',
    'video.settings': 'Pengaturan',
  },
  en: {
    // Navigation
    'nav.beranda': 'Home',
    'nav.kursus': 'Courses',
    'nav.komunitas': 'Community',
    'nav.profil': 'Profile',
    'nav.search': 'Search courses...',
    
    // Hero Section - Updated subtitle
    'hero.title': 'Research and Assessment Institute (LPP) FKUI Courses',
    'hero.subtitle': 'Interactive learning platform LPP FKUI for scientific research and assessment',
    'hero.cta': 'Start Learning',
    'hero.explore': 'Explore Courses',
    
    // Courses
    'course.level.beginner': 'Beginner',
    'course.level.intermediate': 'Intermediate',
    'course.level.advanced': 'Advanced',
    'course.duration': 'Duration',
    'course.lessons': 'Lessons',
    'course.students': 'Students',
    'course.start': 'Start Course',
    'course.continue': 'Continue',
    'course.completed': 'Completed',
    'course.instructor': 'Expert LPP FKUI',
    
    // Course Materials - Literature Review & Proposal
    'course.literature-review': 'Literature Review',
    'course.proposal-bab1': 'Proposal (Chapter 1)',
    'course.proposal-bab2': 'Proposal (Chapter 2)',
    'course.proposal-bab3': 'Proposal (Chapter 3)',
    
    // Academic Writing & Thesis
    'course.tesis-bab1': 'Thesis (Chapter 1)',
    'course.tesis-bab2': 'Thesis (Chapter 2)',
    'course.tesis-bab3': 'Thesis (Chapter 3)',
    'course.tesis-bab4': 'Thesis (Chapter 4)',
    'course.tesis-bab5-6': 'Thesis (Chapter 5-6)',
    'course.formatting-artikel': 'Article Formatting',
    'course.penulisan-artikel': 'Scientific Article Writing',
    
    // Data Analysis & Statistics
    'course.data-analysis': 'Data Analysis (SPSS/Stata/R/etc)',
    'course.meta-analysis': 'Conventional Meta Analysis (Revman)',
    'course.network-meta': 'Network Meta Analysis or Bioinformatics',
    'course.data-collection': 'Full Data Collection',
    
    // Systematic Review & Meta-Analysis
    'course.systematic-review': 'Systematic Review',
    'course.ebcr-full': 'EBCR Full (Word)',
    'course.ebcr-appraisal': 'EBCR (appraisal only)',
    
    // Data Entry & Management
    'course.data-entry': 'Data Entry (HIS/EHR/Spreadsheet/etc)',
    
    // Scientific Presentation
    'course.scientific-ppt': 'Scientific Presentation',
    
    // Case Examination
    'course.ppds-exam': 'PPDS Case Examination',
    
    // Language
    'course.translate-en-id': 'English-Indonesian Translation',
    'course.translate-id-en': 'Indonesian-English Translation',
    
    // Categories
    'category.literature-proposal': 'Literature Review & Proposal',
    'category.academic-thesis': 'Academic Writing & Thesis',
    'category.data-statistics': 'Data Analysis & Statistics',
    'category.systematic-meta': 'Systematic Review & Meta-Analysis',
    'category.data-management': 'Data Entry & Management',
    'category.presentation': 'Scientific Presentation',
    'category.exam': 'Case Examination',
    'category.language': 'Language',
    
    // Community
    'community.title': 'Discussion Community',
    'community.general': 'General Discussion',
    'community.qa': 'Q&A',
    'community.announcements': 'Announcements',
    
    // UI Elements
    'button.close': 'Close',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.next': 'Next',
    'button.previous': 'Previous',
    'comment.add': 'Add Comment',
    'comment.reply': 'Reply',
    
    // Video Player
    'video.play': 'Play',
    'video.pause': 'Pause',
    'video.speed': 'Speed',
    'video.volume': 'Volume',
    'video.fullscreen': 'Fullscreen',
    'video.zoom': 'Zoom',
    'video.quality': 'Quality',
    'video.subtitles': 'Subtitles',
    'video.language': 'Language',
    'video.annotations': 'Annotations',
    'video.forward': 'Forward',
    'video.rewind': 'Rewind',
    'video.settings': 'Settings',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['id']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};