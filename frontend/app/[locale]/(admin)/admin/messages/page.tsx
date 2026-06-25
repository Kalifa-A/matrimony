"use client";
import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Bell, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminNotification } from '@/app/components/NotificationProvider';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  type: 'contact' | 'notification';
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousUnread, setPreviousUnread] = useState(0);
  const { setUnread } = useAdminNotification();

  useEffect(() => {
    setUnread(0);
  }, [setUnread]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/messages`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Poll for new messages every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const prevUnreadRef = React.useRef(0);

  // Show toast when new unread messages arrive
  useEffect(() => {
    if (!loading) {
      const currentUnread = messages.filter((m) => !m.isRead).length;
      if (currentUnread > prevUnreadRef.current) {
        const newCount = currentUnread - prevUnreadRef.current;
        toast.success(`You have ${newCount} new unread message${newCount > 1 ? 's' : ''}`);
      }
      // Update the ref for next comparison
      prevUnreadRef.current = currentUnread;
    }
  }, [loading, messages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/messages/${id}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
        toast.success('Marked as read');
      }
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
        toast.success('Message deleted');
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const deleteAllMessages = async () => {
    if (messages.length === 0) return;
    if (!window.confirm('Are you sure you want to delete ALL messages? This action cannot be undone!')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/messages`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setMessages([]);
        toast.success('All messages deleted');
      } else {
        toast.error('Failed to delete all messages');
      }
    } catch (err) {
      toast.error('Failed to delete all messages');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9AD872]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Inbox</h1>
          <p className="text-gray-500 font-medium mt-1">Manage contact inquiries and system notifications</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 flex-wrap">
           <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
             {messages.filter(m => !m.isRead).length} Unread
           </div>
           <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
             {messages.length} Total
           </div>
           {messages.length > 0 && (
             <button
               onClick={deleteAllMessages}
               className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-extrabold transition-all border border-rose-100"
             >
               <Trash2 size={14} />
               Delete All
             </button>
           )}
        </div>
      </div>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No messages yet</h3>
            <p className="text-gray-500 mt-2">Inquiries and notifications will appear here</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`bg-white rounded-[2.5rem] p-8 border transition-all ${
                !msg.isRead ? 'border-[#9AD872] shadow-xl shadow-[#9AD872]/5' : 'border-gray-100 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.type === 'notification' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {msg.type === 'notification' ? <Bell size={24} /> : <MessageSquare size={24} />}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-gray-900">{msg.subject}</h3>
                        {!msg.isRead && (
                          <span className="w-2 h-2 bg-[#9AD872] rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm font-bold text-gray-500">{msg.name}</p>
                        <span className="text-gray-200">•</span>
                        <p className="text-sm font-medium text-gray-400">{msg.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Clock size={14} />
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {!msg.isRead && (
                      <button 
                        onClick={() => markAsRead(msg._id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#9AD872] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#9AD872]/10 hover:bg-[#8bc764] transition-all"
                      >
                        <CheckCircle size={16} />
                        Mark as Read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMessage(msg._id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all ml-auto"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
