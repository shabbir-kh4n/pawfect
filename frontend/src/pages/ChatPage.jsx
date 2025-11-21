import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import io from 'socket.io-client';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [requestId, user]);

  const fetchChat = async () => {
    try {
      setLoading(true);

      // Get or create chat
      const chatResponse = await api.get(`/api/chats/request/${requestId}`);
      setChat(chatResponse.data.chat);

      // Get messages
      const messagesResponse = await api.get(
        `/api/chats/${chatResponse.data.chat._id}/messages`
      );
      setMessages(messagesResponse.data.messages);

      // Initialize Socket.IO
      const token = localStorage.getItem('token');
      const socket = io('http://localhost:5001', {
        auth: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to chat');
        socket.emit('join_chat', chatResponse.data.chat._id);
      });

      socket.on('new_message', (message) => {
        // Only add message if it's from the other user (avoid duplicates)
        if (message.sender._id !== user.id) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      });

      socket.on('error', (error) => {
        toast.error(error.message);
      });
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      setSending(true);

      // Send via REST API to ensure message is saved
      const response = await api.post(`/api/chats/${chat._id}/messages`, {
        content: messageContent,
      });

      // Add message to local state immediately
      setMessages((prev) => [...prev, response.data.data]);

      // Also send via Socket.IO for real-time to other user
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          chatId: chat._id,
          content: messageContent,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Restore message if failed
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleConfirmAdoption = async () => {
    try {
      setConfirming(true);

      const response = await api.post(
        `/api/adoption-requests/${requestId}/confirm-completion`
      );

      toast.success(response.data.message);

      if (response.data.completed) {
        // Adoption completed, refresh chat to get updated status
        await fetchChat();
      } else {
        // Partially confirmed, also refresh to update UI
        await fetchChat();
      }
    } catch (error) {
      console.error('Error confirming adoption:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm adoption');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Chat not found</p>
          <button
            onClick={() => navigate('/adopt')}
            className="mt-4 text-orange-500 hover:text-orange-600"
          >
            Go back to adoption listings
          </button>
        </div>
      </div>
    );
  }

  const isOwner = chat.petOwner._id === user.id;
  const otherUser = isOwner ? chat.adopter : chat.petOwner;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate('/adopt')}
                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <HiArrowLeft className="text-xl" />
                <span>Back</span>
              </button>
            </div>

            {/* Pet Info */}
            <div className="flex items-center gap-3">
              {chat.pet.photos && chat.pet.photos[0] ? (
                <img
                  src={
                    chat.pet.photos[0].startsWith('http')
                      ? chat.pet.photos[0]
                      : `http://localhost:5001${chat.pet.photos[0]}`
                  }
                  alt={chat.pet.petName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <MdPets className="text-gray-400 text-xl" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {chat.pet.petName}
                </h2>
                <p className="text-sm text-gray-500">
                  Chatting with {otherUser.name || otherUser.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[calc(100vh-280px)] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = message.sender._id === user.id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isMyMessage
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage ? 'text-orange-100' : 'text-gray-400'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Confirm Adoption Button - Only show if adoption not completed */}
        {!chat.adoptionRequest?.adoptionCompleted && (
          <div className="bg-white border-t px-4 py-3">
            <button
              onClick={handleConfirmAdoption}
              disabled={confirming}
              className="w-full bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <HiCheckCircle className="text-xl" />
              {confirming 
                ? 'Confirming...' 
                : isOwner 
                  ? 'Confirm Donation Successful' 
                  : 'Confirm Adoption Successful'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Both parties must confirm for the {isOwner ? 'donation' : 'adoption'} to be marked as complete
            </p>
          </div>
        )}

        {/* Adoption Completed Message */}
        {chat.adoptionRequest?.adoptionCompleted && (
          <div className="bg-green-50 border-t border-green-200 px-4 py-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <HiCheckCircle className="text-2xl" />
              <p className="font-medium">
                {isOwner ? 'Donation Successful! 🎉' : 'Adoption Successful! 🎉'}
              </p>
            </div>
            <p className="text-sm text-green-600 text-center mt-1">
              {isOwner 
                ? 'Thank you for helping find a loving home!' 
                : 'Congratulations on your new companion!'}
            </p>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-t px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiPaperAirplane className="text-xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
