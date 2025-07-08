import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, Users, Plus, Smile, Reply, Pin, MoreHorizontal, Search, Paperclip, Image, File, Mic, Video, Phone, UserPlus, Settings, Bell, BellOff, Star, Heart, ThumbsUp, Laugh, Angry, Salad as Sad, Filter, Download, Share2, Edit, Trash2, Flag, AtSign, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Channel, Message, Profile } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ExtendedMessage extends Message {
  reactions?: { emoji: string; count: number; users: string[] }[];
  attachments?: { type: 'image' | 'file' | 'video'; url: string; name: string }[];
  mentions?: string[];
  isEdited?: boolean;
  editedAt?: string;
}

interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}

const AdvancedCommunityChat: React.FC = () => {
  const { user, profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [replyingTo, setReplyingTo] = useState<ExtendedMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<Profile[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

  useEffect(() => {
    if (user) {
      fetchChannels();
      fetchOnlineUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages();
      subscribeToMessages();
      subscribeToTyping();
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clean up typing users older than 3 seconds
    const interval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(user => Date.now() - user.timestamp < 3000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setChannels(data || []);
      if (data && data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast.error('Gagal memuat channel');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChannel) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            role
          ),
          reply_message:reply_to (
            id,
            content,
            profiles:user_id (
              full_name
            )
          )
        `)
        .eq('channel_id', selectedChannel)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Add mock reactions and attachments for demo
      const messagesWithExtras = (data || []).map(msg => ({
        ...msg,
        reactions: Math.random() > 0.7 ? [
          { emoji: '👍', count: Math.floor(Math.random() * 5) + 1, users: [] },
          { emoji: '❤️', count: Math.floor(Math.random() * 3) + 1, users: [] }
        ] : [],
        attachments: Math.random() > 0.9 ? [
          { type: 'image' as const, url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', name: 'document.pdf' }
        ] : [],
        mentions: msg.content.includes('@') ? ['user1'] : [],
        isEdited: Math.random() > 0.95,
        editedAt: Math.random() > 0.95 ? new Date().toISOString() : undefined
      }));

      setMessages(messagesWithExtras);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Gagal memuat pesan');
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(20);

      if (error) throw error;

      setOnlineUsers(data || []);
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedChannel) return;

    const subscription = supabase
      .channel(`messages:${selectedChannel}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${selectedChannel}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles:user_id (
                id,
                full_name,
                avatar_url,
                role
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            setMessages(prev => [...prev, {
              ...data,
              reactions: [],
              attachments: [],
              mentions: [],
              isEdited: false
            }]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const subscribeToTyping = () => {
    if (!selectedChannel) return;

    const subscription = supabase
      .channel(`typing:${selectedChannel}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, userName, isTyping } = payload.payload;
        
        if (userId === user?.id) return; // Don't show own typing

        if (isTyping) {
          setTypingUsers(prev => {
            const filtered = prev.filter(u => u.userId !== userId);
            return [...filtered, { userId, userName, timestamp: Date.now() }];
          });
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== userId));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      const messageData: any = {
        channel_id: selectedChannel,
        user_id: user.id,
        content: newMessage.trim(),
      };

      if (replyingTo) {
        messageData.reply_to = replyingTo.id;
      }

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      setReplyingTo(null);
      setSelectedFiles([]);
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    }
  };

  const handleTyping = () => {
    if (!selectedChannel || !user || !profile) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    supabase.channel(`typing:${selectedChannel}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        userName: profile.full_name,
        isTyping: true
      }
    });

    // Stop typing after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (!selectedChannel || !user || !profile) return;

    supabase.channel(`typing:${selectedChannel}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        userName: profile.full_name,
        isTyping: false
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewMessage(value);
    setCursorPosition(cursorPos);

    // Check for mentions
    const words = value.split(' ');
    const currentWord = words[words.length - 1];
    
    if (currentWord.startsWith('@') && currentWord.length > 1) {
      const searchTerm = currentWord.slice(1).toLowerCase();
      const suggestions = onlineUsers.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm)
      );
      setMentionSuggestions(suggestions);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }

    handleTyping();
  };

  const addReaction = async (messageId: string, emoji: string) => {
    // In a real app, this would update the database
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          existingReaction.count += 1;
        } else {
          reactions.push({ emoji, count: 1, users: [user?.id || ''] });
        }
        
        return { ...msg, reactions };
      }
      return msg;
    }));
    
    setShowEmojiPicker(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const insertMention = (user: Profile) => {
    const words = newMessage.split(' ');
    words[words.length - 1] = `@${user.full_name} `;
    setNewMessage(words.join(' '));
    setShowMentions(false);
    messageInputRef.current?.focus();
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: id,
    });
  };

  const getAvatarUrl = (profile: Profile | null) => {
    if (profile?.avatar_url) return profile.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=3B82F6&color=fff`;
  };

  const filteredMessages = messages.filter(msg =>
    searchTerm === '' || 
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Memuat komunitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar - Channels */}
      <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Komunitas LPP FKUI</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setNotifications(!notifications)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {notifications ? (
                  <Bell className="w-4 h-4 text-blue-300" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>
          <p className="text-sm text-blue-300">{onlineUsers.length} anggota online</p>
        </div>

        {/* Search Channels */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
            <input
              type="text"
              placeholder="Cari channel..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Channel Teks
              </h3>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-blue-300" />
              </button>
            </div>
            <div className="space-y-1">
              {channels.map(channel => (
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
                  {Math.random() > 0.7 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 10) + 1}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Pesan Langsung
              </h3>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-blue-300" />
              </button>
            </div>
            <div className="space-y-1">
              {onlineUsers.slice(0, 5).map((user, index) => (
                <motion.button
                  key={user.id}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                  </div>
                  <span className="flex-1 text-left text-sm">{user.full_name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* User Panel */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <img
              src={getAvatarUrl(profile)}
              alt={profile?.full_name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{profile?.full_name}</div>
              <div className="text-xs text-blue-300">{profile?.role}</div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Mic className="w-4 h-4 text-blue-300" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Video className="w-4 h-4 text-blue-300" />
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
                  {channels.find(c => c.id === selectedChannel)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari pesan..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-blue-300" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-blue-300" />
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Reply Banner */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Reply className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-blue-300">Membalas {replyingTo.profiles?.full_name}</div>
                    <div className="text-xs text-blue-200 truncate max-w-md">{replyingTo.content}</div>
                  </div>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-blue-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredMessages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex space-x-3 group ${message.is_pinned ? 'bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3' : ''}`}
            >
              <img
                src={getAvatarUrl(message.profiles)}
                alt={message.profiles?.full_name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-white">
                    {message.profiles?.full_name}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    message.profiles?.role === 'instructor' 
                      ? 'bg-purple-500/20 text-purple-300'
                      : message.profiles?.role === 'admin'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {message.profiles?.role === 'instructor' ? 'Instruktur' : 
                     message.profiles?.role === 'admin' ? 'Admin' : 'Peserta'}
                  </span>
                  <span className="text-xs text-blue-300">
                    {formatMessageTime(message.created_at)}
                  </span>
                  {message.isEdited && (
                    <span className="text-xs text-gray-400">(diedit)</span>
                  )}
                  {message.is_pinned && (
                    <Pin className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                
                {message.reply_to && message.reply_message && (
                  <div className="mb-2 p-2 bg-white/5 rounded border-l-2 border-blue-500">
                    <div className="text-xs text-blue-300 mb-1">
                      Membalas {message.reply_message.profiles?.full_name}
                    </div>
                    <div className="text-sm text-gray-300 truncate">
                      {message.reply_message.content}
                    </div>
                  </div>
                )}
                
                <p className="text-blue-100 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center space-x-3">
                        {attachment.type === 'image' ? (
                          <Image className="w-5 h-5 text-blue-400" />
                        ) : (
                          <File className="w-5 h-5 text-blue-400" />
                        )}
                        <span className="text-blue-200 text-sm">{attachment.name}</span>
                        <button className="ml-auto p-1 hover:bg-white/10 rounded transition-colors">
                          <Download className="w-4 h-4 text-blue-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
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
                  </div>
                )}
                
                {/* Message Actions */}
                <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors"
                    >
                      <Smile className="w-3 h-3" />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker === message.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 flex space-x-1"
                        >
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className="p-2 hover:bg-white/20 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    <span>Balas</span>
                  </button>
                  
                  {message.user_id === user?.id && (
                    <>
                      <button
                        onClick={() => setEditingMessage(message.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20 rounded transition-colors">
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </>
                  )}
                  
                  <button className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors">
                    <Share2 className="w-3 h-3" />
                    <span>Bagikan</span>
                  </button>
                  
                  <button className="p-1 text-blue-300 hover:bg-white/10 rounded transition-colors">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicators */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center space-x-2 text-blue-300 text-sm"
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].userName} sedang mengetik...`
                    : `${typingUsers.length} orang sedang mengetik...`
                  }
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-white/10 bg-white/5"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Paperclip className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">File terlampir:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                    <File className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200 text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              {/* Mention Suggestions */}
              <AnimatePresence>
                {showMentions && mentionSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[200px]"
                  >
                    {mentionSuggestions.map(user => (
                      <button
                        key={user.id}
                        onClick={() => insertMention(user)}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-white/20 rounded transition-colors"
                      >
                        <img
                          src={getAvatarUrl(user)}
                          alt={user.full_name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white text-sm">{user.full_name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                ref={messageInputRef}
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={`Kirim pesan ke #${channels.find(c => c.id === selectedChannel)?.name}`}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/10 text-blue-300 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 border border-white/20 rounded-xl transition-colors ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-white/10 text-blue-300 hover:bg-white/20'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim() && selectedFiles.length === 0}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Online Users Sidebar */}
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
                  Anggota Online — {onlineUsers.length}
                </h4>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <UserPlus className="w-4 h-4 text-blue-300" />
                </button>
              </div>
              
              <div className="space-y-2">
                {onlineUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={getAvatarUrl(user)}
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        Math.random() > 0.3 ? 'bg-green-500' : 
                        Math.random() > 0.5 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{user.full_name}</div>
                      <div className="text-xs text-blue-300 capitalize">{user.role}</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-white/20 rounded transition-colors">
                        <MessageSquare className="w-4 h-4 text-blue-300" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedCommunityChat;