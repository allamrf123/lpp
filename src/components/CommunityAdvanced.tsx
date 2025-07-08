import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Hash, Plus, Search, Bell, Settings, User, Send, Pin, Star, ChevronDown, Volume2, VolumeX, Mic, MicOff, Video, VideoOff, Share, Smile, Paperclip, Image, FileText, Gift, Crown, Shield, Zap, Heart, ThumbsUp, Reply, Edit, Trash2, MoreHorizontal, Phone, PhoneOff, ScreenShare, ScreenShareOff, Headphones, Speaker, UserPlus, UserMinus, Ban, Flag, Copy, Download, ExternalLink, Calendar, Clock, MapPin, Globe, Lock, Unlock, Eye, EyeOff, Filter, SortAsc, SortDesc, Bookmark, Archive, RefreshCw as Refresh, Maximize2, Minimize2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'admin' | 'moderator' | 'member' | 'instructor';
  isTyping?: boolean;
  lastSeen?: Date;
  customStatus?: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'voice' | 'announcement' | 'private';
  category: string;
  unread: number;
  isPrivate: boolean;
  members: User[];
  permissions: string[];
  slowMode?: number;
  isNSFW?: boolean;
  topic?: string;
}

interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number; users: User[] }[];
  isPinned: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: Message;
  attachments?: Attachment[];
  mentions?: User[];
  embeds?: Embed[];
  type: 'message' | 'system' | 'call' | 'join' | 'leave';
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  preview?: string;
}

interface Embed {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  image?: string;
  thumbnail?: string;
  author?: { name: string; icon?: string; url?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string; icon?: string };
  timestamp?: Date;
}

interface VoiceState {
  userId: string;
  channelId?: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

const CommunityAdvanced: React.FC = () => {
  const { t } = useLanguage();
  
  // State Management
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'pinned' | 'mentions' | 'files'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Voice/Video State
  const [voiceState, setVoiceState] = useState<VoiceState>({
    userId: 'current-user',
    isMuted: false,
    isDeafened: false,
    isSpeaking: false,
    isVideoEnabled: false,
    isScreenSharing: false
  });
  
  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Data
  const currentUser: User = {
    id: 'current-user',
    name: 'Anda',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?w=100',
    status: 'online',
    role: 'member'
  };

  const users: User[] = [
    {
      id: 'user1',
      name: 'Dr. Ahmad Susanto',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
      status: 'online',
      role: 'instructor',
      customStatus: 'Mengajar Systematic Review'
    },
    {
      id: 'user2',
      name: 'Sarah Maharani',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100',
      status: 'online',
      role: 'member',
      isTyping: true
    },
    {
      id: 'user3',
      name: 'Budi Hartono',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
      status: 'away',
      role: 'moderator'
    },
    {
      id: 'user4',
      name: 'Siti Nurhaliza',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
      status: 'busy',
      role: 'member',
      customStatus: 'Sedang mengerjakan tesis'
    },
    {
      id: 'user5',
      name: 'Andi Prasetyo',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100',
      status: 'offline',
      role: 'member',
      lastSeen: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];

  const channels: Channel[] = [
    {
      id: 'announcements',
      name: 'pengumuman',
      description: 'Pengumuman resmi dari LPP FKUI',
      type: 'announcement',
      category: 'Informasi',
      unread: 1,
      isPrivate: false,
      members: users,
      permissions: ['read'],
      topic: '📢 Channel khusus untuk pengumuman penting'
    },
    {
      id: 'general',
      name: 'umum',
      description: 'Diskusi umum untuk semua topik',
      type: 'text',
      category: 'Umum',
      unread: 3,
      isPrivate: false,
      members: users,
      permissions: ['read', 'write', 'react'],
      topic: '💬 Tempat diskusi umum untuk semua anggota'
    },
    {
      id: 'qa',
      name: 'tanya-jawab',
      description: 'Tanyakan apapun tentang penelitian',
      type: 'text',
      category: 'Akademik',
      unread: 12,
      isPrivate: false,
      members: users,
      permissions: ['read', 'write', 'react'],
      slowMode: 5,
      topic: '❓ Tanyakan pertanyaan penelitian Anda di sini'
    },
    {
      id: 'data-analysis',
      name: 'analisis-data',
      description: 'Diskusi tentang analisis data dan statistik',
      type: 'text',
      category: 'Akademik',
      unread: 5,
      isPrivate: false,
      members: users.slice(0, 3),
      permissions: ['read', 'write', 'react'],
      topic: '📊 Diskusi SPSS, R, Stata, dan tools analisis lainnya'
    },
    {
      id: 'literature-review',
      name: 'tinjauan-pustaka',
      description: 'Bantuan systematic review dan meta-analisis',
      type: 'text',
      category: 'Akademik',
      unread: 0,
      isPrivate: false,
      members: users.slice(0, 4),
      permissions: ['read', 'write', 'react'],
      topic: '📚 Diskusi literature review dan systematic review'
    },
    {
      id: 'thesis-help',
      name: 'bantuan-tesis',
      description: 'Bantuan penulisan proposal dan tesis',
      type: 'text',
      category: 'Akademik',
      unread: 8,
      isPrivate: false,
      members: users.slice(0, 3),
      permissions: ['read', 'write', 'react'],
      topic: '📝 Bantuan penulisan proposal, tesis, dan artikel'
    },
    {
      id: 'journal-club',
      name: 'klub-jurnal',
      description: 'Diskusi artikel jurnal terbaru',
      type: 'text',
      category: 'Akademik',
      unread: 2,
      isPrivate: false,
      members: users.slice(0, 4),
      permissions: ['read', 'write', 'react'],
      topic: '📄 Diskusi dan review artikel jurnal terbaru'
    },
    {
      id: 'voice-general',
      name: 'Diskusi Umum',
      description: 'Voice chat untuk diskusi umum',
      type: 'voice',
      category: 'Voice',
      unread: 0,
      isPrivate: false,
      members: users.slice(0, 2),
      permissions: ['join', 'speak']
    },
    {
      id: 'voice-study',
      name: 'Study Together',
      description: 'Belajar bersama dengan voice chat',
      type: 'voice',
      category: 'Voice',
      unread: 0,
      isPrivate: false,
      members: users.slice(0, 1),
      permissions: ['join', 'speak']
    },
    {
      id: 'voice-presentation',
      name: 'Presentasi',
      description: 'Channel untuk presentasi dan webinar',
      type: 'voice',
      category: 'Voice',
      unread: 0,
      isPrivate: false,
      members: [],
      permissions: ['join', 'listen']
    }
  ];

  // Create messages array without circular references
  const createMessages = (): Message[] => {
    const messageList: Message[] = [
      {
        id: '1',
        author: users[0],
        content: '🎉 Selamat datang di komunitas LPP FKUI yang baru! Komunitas ini telah diupgrade dengan fitur-fitur canggih seperti Discord. Kalian bisa:\n\n• Voice & Video Chat\n• Screen Sharing\n• File Upload\n• Reactions & Replies\n• Dan masih banyak lagi!\n\nJangan ragu untuk bertanya dan berdiskusi tentang penelitian kalian. Mari kita belajar bersama! 🚀',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        reactions: [
          { emoji: '🎉', count: 15, users: users.slice(0, 3) },
          { emoji: '❤️', count: 8, users: users.slice(1, 3) },
          { emoji: '🚀', count: 12, users: users.slice(0, 4) }
        ],
        isPinned: true,
        type: 'message',
        embeds: [{
          title: 'Fitur Baru Komunitas LPP FKUI',
          description: 'Komunitas telah diupgrade dengan fitur-fitur modern',
          color: '#3B82F6',
          fields: [
            { name: 'Voice Chat', value: 'Diskusi real-time dengan suara', inline: true },
            { name: 'Screen Share', value: 'Berbagi layar untuk presentasi', inline: true },
            { name: 'File Upload', value: 'Upload dan share file dengan mudah', inline: true }
          ],
          footer: { text: 'LPP FKUI Community', icon: '🏥' },
          timestamp: new Date()
        }]
      },
      {
        id: '2',
        author: users[1],
        content: 'Wah keren banget! Saya sedang kesulitan dengan meta-analisis menggunakan RevMan. Ada yang bisa bantu? 🤔',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        reactions: [
          { emoji: '🤔', count: 3, users: users.slice(2, 4) },
          { emoji: '👍', count: 2, users: users.slice(0, 2) }
        ],
        isPinned: false,
        type: 'message',
        mentions: [users[0]]
      },
      {
        id: '3',
        author: users[2],
        content: '@Sarah Maharani Saya bisa bantu! RevMan memang agak tricky di awal. Mau saya share tutorial step-by-step? Atau kita bisa voice chat sekalian biar lebih jelas 📞',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        reactions: [
          { emoji: '🙏', count: 5, users: users.slice(0, 3) },
          { emoji: '💯', count: 3, users: users.slice(1, 4) }
        ],
        isPinned: false,
        type: 'message',
        mentions: [users[1]]
      },
      {
        id: '4',
        author: users[3],
        content: 'Saya juga tertarik! Boleh ikut gabung diskusinya? Kebetulan lagi belajar systematic review juga 📚',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        reactions: [
          { emoji: '📚', count: 4, users: users.slice(0, 4) }
        ],
        isPinned: false,
        type: 'message'
      },
      {
        id: '5',
        author: users[0],
        content: 'Bagus sekali! Mari kita buat study group untuk systematic review. Saya akan buat channel voice khusus untuk ini. Yang mau join silakan react dengan 🙋‍♂️',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        reactions: [
          { emoji: '🙋‍♂️', count: 8, users: users.slice(0, 4) },
          { emoji: '📖', count: 6, users: users.slice(1, 4) }
        ],
        isPinned: false,
        type: 'message'
      }
    ];

    // Now set the replyTo reference after all messages are created
    messageList[2].replyTo = messageList[1];

    return messageList;
  };

  const messages = createMessages();

  // Helper Functions
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}j`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}h`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'moderator': return <Shield className="w-3 h-3 text-blue-500" />;
      case 'instructor': return <Star className="w-3 h-3 text-purple-500" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-400';
      case 'moderator': return 'text-blue-400';
      case 'instructor': return 'text-purple-400';
      default: return 'text-blue-200';
    }
  };

  // Event Handlers
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message to server
      console.log('Sending message:', newMessage);
      setNewMessage('');
      setReplyingTo(null);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    console.log('Adding reaction:', emoji, 'to message:', messageId);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    messageInputRef.current?.focus();
  };

  const handleEdit = (messageId: string) => {
    setEditingMessage(messageId);
  };

  const handleDelete = (messageId: string) => {
    console.log('Deleting message:', messageId);
  };

  const handlePin = (messageId: string) => {
    console.log('Pinning message:', messageId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Uploading files:', files);
  };

  const handleVoiceToggle = () => {
    setVoiceState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleVideoToggle = () => {
    setVoiceState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
  };

  const handleScreenShare = () => {
    setVoiceState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  const handleJoinVoice = (channelId: string) => {
    setVoiceState(prev => ({ ...prev, channelId }));
  };

  const handleLeaveVoice = () => {
    setVoiceState(prev => ({ ...prev, channelId: undefined }));
  };

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [newMessage]);

  // Get current channel
  const currentChannel = channels.find(c => c.id === selectedChannel);
  const channelCategories = [...new Set(channels.map(c => c.category))];

  // Filter messages
  const filteredMessages = messages.filter(message => {
    if (messageFilter === 'pinned') return message.isPinned;
    if (messageFilter === 'mentions') return message.mentions?.some(u => u.id === currentUser.id);
    if (messageFilter === 'files') return message.attachments && message.attachments.length > 0;
    return true;
  });

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen pt-16'} flex bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900`}>
      {/* Server/Guild Sidebar */}
      <div className="w-20 bg-slate-900/80 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-4 space-y-3">
        {/* Server Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer"
        >
          <Hash className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="w-8 h-0.5 bg-white/20 rounded-full" />
        
        {/* Quick Channel Access */}
        {channels.slice(0, 5).map((channel, index) => (
          <motion.button
            key={channel.id}
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedChannel(channel.id)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              selectedChannel === channel.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-300 hover:bg-white/20'
            }`}
          >
            {channel.type === 'voice' ? <Volume2 className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
            {channel.unread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{channel.unread}</span>
              </div>
            )}
          </motion.button>
        ))}
        
        <div className="flex-1" />
        
        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-300 hover:bg-white/20 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Channel Sidebar */}
      <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">LPP FKUI Community</h2>
              <p className="text-xs text-blue-300">{users.filter(u => u.status === 'online').length} online • {users.length} members</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-4 h-4 text-blue-300" />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-blue-300" /> : <Maximize2 className="w-4 h-4 text-blue-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Channel Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari channel atau pesan..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Channel Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {channelCategories.map(category => (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Plus className="w-4 h-4 text-blue-300" />
                  </button>
                  <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Settings className="w-4 h-4 text-blue-300" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                {channels.filter(c => c.category === category).map(channel => (
                  <motion.button
                    key={channel.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      selectedChannel === channel.id
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {channel.type === 'voice' ? (
                        <Volume2 className="w-4 h-4" />
                      ) : channel.type === 'announcement' ? (
                        <Bell className="w-4 h-4" />
                      ) : channel.isPrivate ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Hash className="w-4 h-4" />
                      )}
                      <span className="flex-1 text-left text-sm font-medium">{channel.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {channel.type === 'voice' && channel.members.length > 0 && (
                        <span className="text-xs text-blue-300">{channel.members.length}</span>
                      )}
                      {channel.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {channel.unread > 99 ? '99+' : channel.unread}
                        </span>
                      )}
                      {channel.slowMode && (
                        <Clock className="w-3 h-3 text-yellow-400" />
                      )}
                      {channel.isNSFW && (
                        <span className="text-xs text-red-400 font-bold">18+</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Voice Connection Panel */}
        {voiceState.channelId && (
          <div className="p-4 border-t border-white/10 bg-green-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">
                  {channels.find(c => c.id === voiceState.channelId)?.name}
                </span>
              </div>
              <button
                onClick={handleLeaveVoice}
                className="p-1 hover:bg-red-500/20 rounded text-red-400"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={handleVoiceToggle}
                className={`p-2 rounded-lg transition-colors ${
                  voiceState.isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {voiceState.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleVideoToggle}
                className={`p-2 rounded-lg transition-colors ${
                  voiceState.isVideoEnabled ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {voiceState.isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleScreenShare}
                className={`p-2 rounded-lg transition-colors ${
                  voiceState.isScreenSharing ? 'bg-purple-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {voiceState.isScreenSharing ? <ScreenShare className="w-4 h-4" /> : <ScreenShareOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* User Panel */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(currentUser.status)} rounded-full border-2 border-slate-900`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-white">{currentUser.name}</span>
                {getRoleIcon(currentUser.role)}
              </div>
              <div className="text-xs text-blue-300">#{currentUser.id.slice(-4)}</div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleVoiceToggle}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                  voiceState.isMuted ? 'text-red-400' : 'text-blue-300'
                }`}
              >
                {voiceState.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-300">
                <Headphones className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-300">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentChannel?.type === 'voice' ? (
                <Volume2 className="w-6 h-6 text-blue-400" />
              ) : currentChannel?.type === 'announcement' ? (
                <Bell className="w-6 h-6 text-yellow-400" />
              ) : currentChannel?.isPrivate ? (
                <Lock className="w-6 h-6 text-red-400" />
              ) : (
                <Hash className="w-6 h-6 text-blue-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {currentChannel?.name}
                </h3>
                {currentChannel?.topic && (
                  <p className="text-sm text-blue-300">{currentChannel.topic}</p>
                )}
                {currentChannel?.description && (
                  <p className="text-xs text-blue-400">{currentChannel.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Message Filters */}
              <select
                value={messageFilter}
                onChange={(e) => setMessageFilter(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="all" className="bg-slate-800">Semua Pesan</option>
                <option value="pinned" className="bg-slate-800">Pesan Terpin</option>
                <option value="mentions" className="bg-slate-800">Mention Saya</option>
                <option value="files" className="bg-slate-800">File</option>
              </select>
              
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-blue-300" />
              </button>
              
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Pin className="w-5 h-5 text-blue-300" />
              </button>
              
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-blue-300" />
              </button>
              
              {currentChannel?.type === 'voice' && (
                <button
                  onClick={() => handleJoinVoice(currentChannel.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Join</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative ${message.isPinned ? 'bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3' : ''}`}
                >
                  {/* Pin Indicator */}
                  {message.isPinned && (
                    <div className="absolute -top-2 left-4 flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                      <Pin className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-yellow-500 font-medium">Terpin</span>
                    </div>
                  )}
                  
                  {/* Reply Reference */}
                  {message.replyTo && (
                    <div className="mb-2 ml-12 flex items-center space-x-2 text-sm text-blue-300">
                      <Reply className="w-3 h-3" />
                      <img src={message.replyTo.author.avatar} alt="" className="w-4 h-4 rounded-full" />
                      <span className="font-medium">{message.replyTo.author.name}</span>
                      <span className="opacity-70 truncate max-w-xs">{message.replyTo.content}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <img
                      src={message.author.avatar}
                      alt={message.author.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${getRoleColor(message.author.role)}`}>
                          {message.author.name}
                        </span>
                        {getRoleIcon(message.author.role)}
                        {message.author.customStatus && (
                          <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                            {message.author.customStatus}
                          </span>
                        )}
                        <span className="text-xs text-blue-300">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {message.isEdited && (
                          <span className="text-xs text-blue-400">(diedit)</span>
                        )}
                      </div>
                      
                      <div className="text-blue-100 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {/* Embeds */}
                      {message.embeds?.map((embed, index) => (
                        <div key={index} className="mt-3 border-l-4 border-blue-500 bg-white/5 rounded-r-lg p-4">
                          {embed.author && (
                            <div className="flex items-center space-x-2 mb-2">
                              {embed.author.icon && <img src={embed.author.icon} alt="" className="w-5 h-5 rounded-full" />}
                              <span className="text-sm font-medium text-white">{embed.author.name}</span>
                            </div>
                          )}
                          {embed.title && (
                            <h4 className="text-lg font-semibold text-white mb-2">{embed.title}</h4>
                          )}
                          {embed.description && (
                            <p className="text-blue-200 mb-3">{embed.description}</p>
                          )}
                          {embed.fields && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              {embed.fields.map((field, fieldIndex) => (
                                <div key={fieldIndex}>
                                  <div className="text-sm font-medium text-white mb-1">{field.name}</div>
                                  <div className="text-sm text-blue-200">{field.value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {embed.footer && (
                            <div className="flex items-center space-x-2 text-xs text-blue-300">
                              {embed.footer.icon && <span>{embed.footer.icon}</span>}
                              <span>{embed.footer.text}</span>
                              {embed.timestamp && (
                                <span>• {formatMessageTime(embed.timestamp)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                              <FileText className="w-8 h-8 text-blue-400" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">{attachment.name}</div>
                                <div className="text-xs text-blue-300">{(attachment.size / 1024).toFixed(1)} KB</div>
                              </div>
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Download className="w-4 h-4 text-blue-300" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          {message.reactions.map((reaction, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-xs text-blue-300">{reaction.count}</span>
                            </motion.button>
                          ))}
                          <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-blue-300" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start space-x-1">
                      <button
                        onClick={() => handleReaction(message.id, '👍')}
                        className="p-1 hover:bg-white/10 rounded text-blue-300"
                        title="React"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReply(message)}
                        className="p-1 hover:bg-white/10 rounded text-blue-300"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      {message.author.id === currentUser.id && (
                        <>
                          <button
                            onClick={() => handleEdit(message.id)}
                            className="p-1 hover:bg-white/10 rounded text-blue-300"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="p-1 hover:bg-white/10 rounded text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handlePin(message.id)}
                        className="p-1 hover:bg-white/10 rounded text-blue-300"
                        title="Pin"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded text-blue-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicators */}
              {users.filter(u => u.isTyping).map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-300">{user.name} sedang mengetik</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 bg-blue-500/10 border-t border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Reply className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300">Membalas</span>
                    <span className="font-medium text-white">{replyingTo.author.name}</span>
                    <span className="text-blue-200 truncate max-w-xs">{replyingTo.content}</span>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="p-1 hover:bg-white/10 rounded text-blue-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Upload File"
                    >
                      <Paperclip className="w-4 h-4 text-blue-300" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Image className="w-4 h-4 text-blue-300" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Gift className="w-4 h-4 text-blue-300" />
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        setIsTyping(true);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Kirim pesan ke #${currentChannel?.name}...`}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                    >
                      <Smile className="w-5 h-5 text-blue-300" />
                    </button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              
              {currentChannel?.slowMode && (
                <div className="mt-2 text-xs text-yellow-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Slow mode: {currentChannel.slowMode}s per pesan</span>
                </div>
              )}
            </div>
          </div>

          {/* User List Sidebar */}
          <AnimatePresence>
            {showUserList && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-slate-900/30 backdrop-blur-sm border-l border-white/10 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
                      Anggota — {currentChannel?.members.length || 0}
                    </h4>
                    <button className="p-1 hover:bg-white/10 rounded">
                      <UserPlus className="w-4 h-4 text-blue-300" />
                    </button>
                  </div>
                  
                  {/* Online Users */}
                  <div className="mb-6">
                    <h5 className="text-xs font-medium text-green-400 mb-3 uppercase tracking-wider">
                      Online — {users.filter(u => u.status === 'online').length}
                    </h5>
                    <div className="space-y-2">
                      {users.filter(u => u.status === 'online').map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                          onClick={() => setShowUserProfile(user.id)}
                        >
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                            {voiceState.channelId && user.id !== currentUser.id && (
                              <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full border border-slate-900" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1">
                              <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                                {user.name}
                              </span>
                              {getRoleIcon(user.role)}
                            </div>
                            {user.customStatus && (
                              <div className="text-xs text-blue-400 truncate">{user.customStatus}</div>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button className="p-1 hover:bg-white/10 rounded">
                              <MessageSquare className="w-3 h-3 text-blue-300" />
                            </button>
                            <button className="p-1 hover:bg-white/10 rounded">
                              <Phone className="w-3 h-3 text-blue-300" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Away/Busy Users */}
                  {users.filter(u => u.status === 'away' || u.status === 'busy').length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-xs font-medium text-yellow-400 mb-3 uppercase tracking-wider">
                        Away/Busy — {users.filter(u => u.status === 'away' || u.status === 'busy').length}
                      </h5>
                      <div className="space-y-2">
                        {users.filter(u => u.status === 'away' || u.status === 'busy').map((user, index) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer opacity-60"
                          >
                            <div className="relative">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-1">
                                <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                                  {user.name}
                                </span>
                                {getRoleIcon(user.role)}
                              </div>
                              {user.customStatus && (
                                <div className="text-xs text-blue-400 truncate">{user.customStatus}</div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Offline Users */}
                  {users.filter(u => u.status === 'offline').length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
                        Offline — {users.filter(u => u.status === 'offline').length}
                      </h5>
                      <div className="space-y-2">
                        {users.filter(u => u.status === 'offline').map((user, index) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer opacity-40"
                          >
                            <div className="relative">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full grayscale"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-900`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-sm font-medium text-gray-400">
                                  {user.name}
                                </span>
                                {getRoleIcon(user.role)}
                              </div>
                              {user.lastSeen && (
                                <div className="text-xs text-gray-500">
                                  Terakhir dilihat {formatMessageTime(user.lastSeen)}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 right-20 bg-slate-800 border border-white/20 rounded-2xl p-4 shadow-2xl z-50"
          >
            <div className="grid grid-cols-8 gap-2">
              {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showUserProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full"
            >
              {(() => {
                const user = users.find(u => u.id === showUserProfile);
                if (!user) return null;
                
                return (
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-4 border-slate-800`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className={`text-sm ${getRoleColor(user.role)}`}>{user.role}</span>
                      {getRoleIcon(user.role)}
                    </div>
                    {user.customStatus && (
                      <p className="text-blue-300 mb-4">{user.customStatus}</p>
                    )}
                    <div className="flex items-center justify-center space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Pesan</span>
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityAdvanced;