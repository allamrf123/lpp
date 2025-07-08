import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Reply, MoreHorizontal, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

interface CommentSectionProps {
  lessonId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ lessonId }) => {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Ahmad Susanto',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
      content: 'Penjelasan yang sangat jelas dan mudah dipahami. Terima kasih atas materinya!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 12,
      replies: [
        {
          id: '1.1',
          author: 'Sarah Maharani',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100',
          content: 'Setuju! Saya juga merasa terbantu dengan penjelasan ini.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          likes: 3,
          replies: [],
          isLiked: false,
        }
      ],
      isLiked: true,
    },
    {
      id: '2',
      author: 'Budi Hartono',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
      content: 'Bisakah dijelaskan lebih detail tentang metodologi pencarian database? Saya masih bingung dengan boolean operators.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      likes: 8,
      replies: [],
      isLiked: false,
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Anda',
        avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?w=100',
        content: newComment,
        timestamp: new Date(),
        likes: 0,
        replies: [],
        isLiked: false,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyContent.trim()) {
      const reply: Comment = {
        id: `${parentId}.${Date.now()}`,
        author: 'Anda',
        avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?w=100',
        content: replyContent,
        timestamp: new Date(),
        likes: 0,
        replies: [],
        isLiked: false,
      };

      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      }));

      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(comments.map(comment => {
      if (!isReply && comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked
              };
            }
            return reply;
          })
        };
      }
      
      return comment;
    }));
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean; parentId?: string }> = ({ 
    comment, 
    isReply = false, 
    parentId 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-12' : ''}`}
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-start space-x-3">
          <img
            src={comment.avatar}
            alt={comment.author}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-white">{comment.author}</h4>
              <span className="text-xs text-blue-300">{formatTimeAgo(comment.timestamp)}</span>
            </div>
            <p className="text-blue-100 mb-3 leading-relaxed">{comment.content}</p>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLike(comment.id, isReply, parentId)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  comment.isLiked 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'hover:bg-white/10 text-blue-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{comment.likes}</span>
              </motion.button>
              
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-white/10 text-blue-300 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span className="text-sm">{t('comment.reply')}</span>
                </button>
              )}
              
              <button className="p-1 rounded-lg hover:bg-white/10 text-blue-300 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <AnimatePresence>
        {replyingTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 ml-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Balas ke ${comment.author}...`}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-blue-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex items-center justify-end space-x-3 mt-3">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 text-blue-300 hover:text-white transition-colors"
                >
                  {t('button.cancel')}
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddReply(comment.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('comment.reply')}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              parentId={comment.id} 
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Diskusi & Komentar</h3>
        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
          {comments.length + comments.reduce((acc, comment) => acc + comment.replies.length, 0)}
        </span>
      </div>

      {/* Add Comment Form */}
      <div className="mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comment.add')}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-blue-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-blue-300">
              Gunakan bahasa yang sopan dan konstruktif
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Komentar</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-white mb-2">Belum ada komentar</h4>
          <p className="text-blue-300">Jadilah yang pertama berkomentar pada materi ini!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;