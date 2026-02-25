import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, ChevronLeft, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cryptoUtils } from '../utils/crypto';

const ChatWidget = ({ currentUserId, currentUserRole, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      const otherId = activeConversation.participant_1?.id === currentUserId 
        ? activeConversation.participant_2?.id 
        : activeConversation.participant_1?.id;
      
      const channel = supabase
        .channel(`messages:${activeConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversation.id}`,
        }, async (payload) => {
          try {
            if (otherId) {
              const decrypted = await cryptoUtils.decrypt(payload.new.content, currentUserId, otherId);
              setMessages((prev) => [...prev, { ...payload.new, content: decrypted }]);
            } else {
              setMessages((prev) => [...prev, payload.new]);
            }
          } catch (e) {
            setMessages((prev) => [...prev, payload.new]);
          }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:profiles!participant_1(id, full_name, role, phone_number, location),
          participant_2:profiles!participant_2(id, full_name, role, phone_number, location)
        `)
        .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
        .order('last_message_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setConversations(data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(id, full_name, role)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        const decryptedMessages = await Promise.all(
          data.map(async (msg) => {
            try {
              const otherUserId = msg.sender_id === currentUserId 
                ? getOtherParticipant({ participant_1: { id: currentUserId }, participant_2: { id: activeConversation.participant_1?.id === currentUserId ? activeConversation.participant_2?.id : activeConversation.participant_1?.id } })
                : msg.sender_id;
              
              const conv = activeConversation;
              const otherId = conv?.participant_1?.id === currentUserId 
                ? conv?.participant_2?.id 
                : conv?.participant_1?.id;
              
              if (otherId) {
                const decrypted = await cryptoUtils.decrypt(msg.content, currentUserId, otherId);
                return { ...msg, content: decrypted, isEncrypted: true };
              }
              return msg;
            } catch (e) {
              return msg;
            }
          })
        );
        setMessages(decryptedMessages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const otherId = activeConversation.participant_1?.id === currentUserId 
        ? activeConversation.participant_2?.id 
        : activeConversation.participant_1?.id;
      
      const encryptedContent = await cryptoUtils.encrypt(newMessage.trim(), currentUserId, otherId);

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation.id,
          sender_id: currentUserId,
          content: encryptedContent,
        });

      if (!error) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', activeConversation.id);
        
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const startConversation = async (otherUserId) => {
    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1.eq.${currentUserId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${currentUserId})`)
        .single();

      if (existing) {
        setActiveConversation(existing);
        return;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: currentUserId,
          participant_2: otherUserId,
        })
        .select()
        .single();

      if (!error && data) {
        setActiveConversation(data);
        fetchConversations();
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation) return null;
    return conversation.participant_1?.id === currentUserId
      ? conversation.participant_2
      : conversation.participant_1;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '380px',
        height: '520px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--forest)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeConversation && (
            <button
              onClick={() => setActiveConversation(null)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem' }}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <MessageCircle size={20} />
          <span style={{ fontWeight: 600 }}>
            {activeConversation ? getOtherParticipant(activeConversation)?.full_name || 'Chat' : 'Messages'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : activeConversation ? (
          // Messages view
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Messages list */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        background: isMe ? 'var(--forest)' : 'var(--bg-main)',
                        color: isMe ? 'white' : 'var(--text-main)',
                      }}
                    >
                      <div style={{ fontSize: '0.9rem' }}>{msg.content}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem' }}>
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--forest)',
                  color: 'white',
                  border: 'none',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: sending ? 0.5 : 1,
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          // Conversations list
          conversations.length > 0 ? (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--forest)',
                    fontWeight: 600,
                  }}>
                    {other?.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{other?.full_name || 'User'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {other?.role === 'farmer' ? 'Farmer' : 'Business'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No conversations yet
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};

export default ChatWidget;
