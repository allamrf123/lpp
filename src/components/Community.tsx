import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Hash, 
  Plus, 
  Search, 
  Bell,
  Settings,
  User,
  Send,
  Pin,
  Star,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unread: number;
  isPrivate: boolean;
  members: number;
}

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number; users: string[] }[];
  isPinned: boolean;
}

const Community: React.FC = () => {
  const { t } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [showUserList, setShowUserList] = useState(true);

  const channels: Channel[] = [
    { id: 'general', name: 'umum', type: 'text', unread: 3, isPrivate: false, members: 234 },
    { id: 'qa', name: 'tanya-jawab', type: 'text', unread: 12, isPrivate: false, members: 189 },
    { id: 'announcements', name: 'pengumuman', type: 'text', unread: 1, isPrivate: false, members: 234 },
    { id: 'data-analysis', name: 'analisis-data', type: 'text', unread: 5, isPrivate: false, members: 87 },
    { id: 'literature-review', name: 'tinjauan-pustaka', type: 'text', unread: 0, isPrivate: false, members: 156 },
    { id: 'thesis-help', name: 'bantuan-tesis', type: 'text', unread: 8, isPrivate: false, members: 67 },
    { id: 'voice-general', name: 'Diskusi Umum', type: 'voice', unread: 0, isPrivate: false, members: 12 },
    { id: 'voice-study', name: 'Study Together', type: 'voice', unread: 0, isPrivate: false, members: 5 },
  ];

  const messages: Message[] = [
    {
      id: '1',
      author: 'Dr. Ahmad Susanto',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
      content: 'Selamat datang di komunitas LPP FKUI! Jangan ragu untuk bertanya dan berdiskusi tentang penelitian kalian.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      reactions: [
        { emoji: '👍', count: 15, users: ['user1', 'user2'] },
        { emoji: '❤️', count: 8, users: ['user3'] }
      ],
      isPinned: true
    },
    {
      id: '2',
      author: 'Sarah Maharani',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100',
      content: 'Halo semua! Saya sedang kesulitan dengan meta-analisis menggunakan RevMan. Ada yang bisa bantu?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      reactions: [
        { emoji: '🤔', count: 3, users: ['user4'] }
      ],
      isPinned: false
    },
    {
      id: '3',
      author: 'Budi Hartono',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
      content: '@Sarah Maharani Saya bisa bantu! RevMan memang agak tricky di awal. Mau saya share tutorial step-by-step?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      reactions: [
        { emoji: '🙏', count: 1, users: ['user5'] }
      ],
      isPinned: false
    }
  ];

  const onlineUsers = [
    { name: 'Dr. Ahmad Susanto', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100', status: 'online', role: 'Instruktur' },
    { name: 'Sarah Maharani', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100', status: 'online', role: 'Peserta' },
    { name: 'Budi Hartono', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100', status: 'online', role: 'Peserta' },
    { name: 'Siti Nurhaliza', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100', status: 'away', role: 'Peserta' },
    { name: 'Andi Prasetyo', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100', status: 'busy', role: 'Peserta' },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message to server
      setNewMessage('');
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}j`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar - Channel List */}
      <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Komunitas LPP FKUI</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-4 h-4 text-blue-300" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Channel Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Text Channels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Channel Teks
              </h3>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-blue-300" />
              </button>
            </div>
            <div className="space-y-1">
              {channels.filter(c => c.type === 'text').map(channel => (
                <motion.button
                  key={channel.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedChannel === channel.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1 text-left text-sm">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {channel.unread}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Voice Channels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Channel Suara
              </h3>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-blue-300" />
              </button>
            </div>
            <div className="space-y-1">
              {channels.filter(c => c.type === 'voice').map(channel => (
                <motion.button
                  key={channel.id}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="flex-1 text-left text-sm">{channel.name}</span>
                  {channel.members > 0 && (
                    <span className="text-xs text-blue-300">{channel.members}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* User Panel */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?w=100"
                alt="Your Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Anda</div>
              <div className="text-xs text-blue-300">#1234</div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isVoiceMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-300" />
                )}
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-blue-300" />
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
              <Hash className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {channels.find(c => c.id === selectedChannel)?.name}
                </h3>
                <p className="text-sm text-blue-300">
                  {channels.find(c => c.id === selectedChannel)?.members} anggota
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-blue-300" />
              </button>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-blue-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex space-x-3 ${message.isPinned ? 'bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3' : ''}`}
                >
                  {message.isPinned && (
                    <div className="absolute -top-2 left-4">
                      <Pin className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  <img
                    src={message.avatar}
                    alt={message.author}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{message.author}</span>
                      <span className="text-xs text-blue-300">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.isPinned && (
                        <Pin className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-blue-100 leading-relaxed">{message.content}</p>
                    
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center space-x-1 px-2 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs text-blue-300">{reaction.count}</span>
                          </motion.button>
                        ))}
                        <button className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <Plus className="w-3 h-3 text-blue-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Kirim pesan ke #${channels.find(c => c.id === selectedChannel)?.name}`}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* User List Sidebar */}
          <AnimatePresence>
            {showUserList && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-slate-900/30 backdrop-blur-sm border-l border-white/10 overflow-hidden"
              >
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
                    Anggota Online — {onlineUsers.filter(u => u.status === 'online').length}
                  </h4>
                  <div className="space-y-2">
                    {onlineUsers.map((user, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
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
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-blue-300">{user.role}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Community;