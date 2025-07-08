import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut,
  X,
  Settings,
  MessageCircle,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Subtitles,
  Languages,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  FileText,
  Download,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoPlayerProps {
  title: string;
  description: string;
  isModal?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

interface Annotation {
  id: string;
  time: number;
  x: number;
  y: number;
  title: string;
  content: string;
  type: 'info' | 'quiz' | 'resource';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  title, 
  description, 
  isModal = false, 
  onClose, 
  onComplete 
}) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes mock duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitleLanguage, setSubtitleLanguage] = useState<'id' | 'en'>('id');
  const [audioLanguage, setAudioLanguage] = useState<'id' | 'en'>('id');
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p' | '4K'>('1080p');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock annotations
  const annotations: Annotation[] = [
    {
      id: '1',
      time: 30,
      x: 25,
      y: 30,
      title: 'Konsep Dasar',
      content: 'Ini adalah konsep dasar yang perlu dipahami sebelum melanjutkan ke materi selanjutnya.',
      type: 'info'
    },
    {
      id: '2',
      time: 90,
      x: 70,
      y: 20,
      title: 'Kuis Singkat',
      content: 'Apa yang dimaksud dengan systematic review?',
      type: 'quiz'
    },
    {
      id: '3',
      time: 150,
      x: 50,
      y: 80,
      title: 'Sumber Tambahan',
      content: 'Download template untuk membantu proses penelitian Anda.',
      type: 'resource'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            clearInterval(timer);
            setIsPlaying(false);
            onComplete?.();
            return duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, playbackSpeed, duration, onComplete]);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const handleQualityChange = (quality: '720p' | '1080p' | '4K') => {
    setVideoQuality(quality);
    setShowSettings(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(prev + seconds, duration)));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
  };

  const toggleSubtitleLanguage = () => {
    setSubtitleLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const toggleAudioLanguage = () => {
    setAudioLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  const getCurrentSubtitle = () => {
    const subtitles = {
      id: {
        0: 'Selamat datang di kursus Tinjauan Pustaka',
        30: 'Mari kita pelajari konsep dasar penelitian',
        60: 'Systematic review adalah metodologi penelitian yang sistematis',
        90: 'Langkah pertama adalah menentukan pertanyaan penelitian',
        120: 'Kemudian lakukan pencarian literatur yang komprehensif'
      },
      en: {
        0: 'Welcome to the Literature Review course',
        30: 'Let\'s learn the basic concepts of research',
        60: 'Systematic review is a systematic research methodology',
        90: 'The first step is to determine the research question',
        120: 'Then conduct a comprehensive literature search'
      }
    };

    const timeKey = Math.floor(currentTime / 30) * 30;
    return subtitles[subtitleLanguage][timeKey as keyof typeof subtitles.id] || '';
  };

  const getActiveAnnotations = () => {
    return annotations.filter(annotation => 
      Math.abs(annotation.time - currentTime) < 5 && showAnnotations
    );
  };

  const VideoContent = () => (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative bg-black rounded-2xl overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying || setShowControls(false)}
    >
      {/* Video Area */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Mock Video Content */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300 relative"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="text-center relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              {isPlaying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Play className="w-16 h-16 text-white" />
                </motion.div>
              ) : (
                <Play className="w-16 h-16 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-blue-200">{description}</p>
          </div>

          {/* Video Quality Indicator */}
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 rounded text-white text-xs">
            {videoQuality}
          </div>

          {/* Audio Language Indicator */}
          <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 rounded text-white text-xs flex items-center space-x-1">
            <Headphones className="w-3 h-3" />
            <span>{audioLanguage.toUpperCase()}</span>
          </div>
        </div>

        {/* Interactive Annotations */}
        <AnimatePresence>
          {getActiveAnnotations().map(annotation => (
            <motion.div
              key={annotation.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute w-6 h-6 rounded-full cursor-pointer ${
                annotation.type === 'info' ? 'bg-blue-500' :
                annotation.type === 'quiz' ? 'bg-green-500' : 'bg-purple-500'
              }`}
              style={{ 
                left: `${annotation.x}%`, 
                top: `${annotation.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setActiveAnnotation(
                activeAnnotation === annotation.id ? null : annotation.id
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {annotation.type === 'info' && <FileText className="w-3 h-3 text-white" />}
                {annotation.type === 'quiz' && <MessageCircle className="w-3 h-3 text-white" />}
                {annotation.type === 'resource' && <Download className="w-3 h-3 text-white" />}
              </div>
              
              {/* Annotation Popup */}
              <AnimatePresence>
                {activeAnnotation === annotation.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black/90 backdrop-blur-sm rounded-lg p-3 text-white text-sm"
                  >
                    <h4 className="font-semibold mb-1">{annotation.title}</h4>
                    <p className="text-gray-300">{annotation.content}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Subtitles */}
        <AnimatePresence>
          {showSubtitles && getCurrentSubtitle() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-center max-w-2xl"
            >
              {getCurrentSubtitle()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60"
            >
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="text-white">
                  <h4 className="font-semibold">{title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    <span>{playbackSpeed}x</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`p-2 rounded-lg transition-colors ${
                      showAnnotations ? 'bg-blue-600 text-white' : 'bg-black/50 text-white/60 hover:text-white'
                    }`}
                    title={t('video.annotations')}
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                    title="Komentar"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {/* Share functionality */}}
                    className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                    title="Bagikan"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {isModal && onClose && (
                    <button
                      onClick={onClose}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div 
                    className="w-full bg-white/20 rounded-full h-2 cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300 relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    
                    <button 
                      onClick={() => handleSeek(-10)}
                      className="text-white hover:text-blue-300 transition-colors"
                      title={t('video.rewind')}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={() => handleSeek(10)}
                      className="text-white hover:text-blue-300 transition-colors"
                      title={t('video.forward')}
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-blue-300 transition-colors"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    
                    <span className="text-white text-sm">{Math.round(zoom * 100)}%</span>
                    
                    <button
                      onClick={handleZoomIn}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`p-2 rounded-lg transition-colors ${
                        showSubtitles ? 'bg-blue-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      title={t('video.subtitles')}
                    >
                      <Subtitles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleSubtitleLanguage}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title={`${t('video.subtitles')}: ${subtitleLanguage.toUpperCase()}`}
                    >
                      <Languages className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleAudioLanguage}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title={`${t('video.language')}: ${audioLanguage.toUpperCase()}`}
                    >
                      <Headphones className="w-4 h-4" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                        title={t('video.settings')}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      
                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]"
                          >
                            {/* Playback Speed */}
                            <div className="mb-4">
                              <div className="text-white text-sm font-medium mb-2">{t('video.speed')}</div>
                              <div className="space-y-1">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                  <button
                                    key={speed}
                                    onClick={() => handleSpeedChange(speed)}
                                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                                      playbackSpeed === speed ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {speed}x
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Video Quality */}
                            <div>
                              <div className="text-white text-sm font-medium mb-2">{t('video.quality')}</div>
                              <div className="space-y-1">
                                {(['720p', '1080p', '4K'] as const).map(quality => (
                                  <button
                                    key={quality}
                                    onClick={() => handleQualityChange(quality)}
                                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                                      videoQuality === quality ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                  >
                                    {quality}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title={t('video.fullscreen')}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comments Sidebar */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 w-80 h-full bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Komentar</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-white hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Mock comments */}
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-medium text-white text-sm">Ahmad S.</div>
                <div className="text-gray-300 text-xs mb-2">{formatTime(154)}</div>
                <div className="text-gray-200 text-sm">Penjelasan yang sangat jelas!</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-medium text-white text-sm">Sarah M.</div>
                <div className="text-gray-300 text-xs mb-2">{formatTime(252)}</div>
                <div className="text-gray-200 text-sm">Bisakah dijelaskan lebih detail tentang bagian ini?</div>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                placeholder="Tambahkan komentar..."
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 text-sm resize-none"
                rows={3}
              />
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Kirim Komentar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </motion.div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl max-h-[90vh]">
          <VideoContent />
        </div>
      </div>
    );
  }

  return <VideoContent />;
};

export default VideoPlayer;