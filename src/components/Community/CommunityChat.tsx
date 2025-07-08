import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Hash, 
  Users, 
  Plus, 
  Smile, 
  Reply,
  Pin,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Channel, Message, Profile } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

const CommunityChat: React.FC = () => {
  const { user, profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      setMessages(data || []);
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
        .limit(10);

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
          // Fetch the complete message with profile data
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
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: selectedChannel,
          user_id: user.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
          <h2 className="text-lg font-bold text-white">Komunitas LPP FKUI</h2>
          <p className="text-sm text-blue-300">{onlineUsers.length} anggota online</p>
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
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-blue-300" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Users className="w-5 h-5 text-blue-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex space-x-3 ${message.is_pinned ? 'bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3' : ''}`}
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
                
                <div className="flex items-center space-x-2 mt-2">
                  <button className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors">
                    <Reply className="w-3 h-3" />
                    <span>Balas</span>
                  </button>
                  <button className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-300 hover:bg-white/10 rounded transition-colors">
                    <Smile className="w-3 h-3" />
                    <span>Reaksi</span>
                  </button>
                  <button className="p-1 text-blue-300 hover:bg-white/10 rounded transition-colors">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Kirim pesan ke #${channels.find(c => c.id === selectedChannel)?.name}`}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="w-64 bg-slate-900/30 backdrop-blur-sm border-l border-white/10 p-4">
        <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
          Anggota Online — {onlineUsers.length}
        </h4>
        <div className="space-y-2">
          {onlineUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="relative">
                <img
                  src={getAvatarUrl(user)}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user.full_name}</div>
                <div className="text-xs text-blue-300 capitalize">{user.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;