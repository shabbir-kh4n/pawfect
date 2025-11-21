import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChatAlt2, HiArrowLeft, HiCheckCircle, HiClock, HiTrash } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatsListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingChatId, setDeletingChatId] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to view your chats');
      navigate('/login');
      return;
    }

    fetchChats();
  }, [user, navigate]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/chats');
      
      // Store in localStorage for caching
      localStorage.setItem('pawfect_chats', JSON.stringify(response.data.chats));
      localStorage.setItem('pawfect_chats_timestamp', Date.now().toString());
      
      setChats(response.data.chats);
    } catch (err) {
      console.error('Error fetching chats:', err);
      
      // Try to load from cache if API fails
      const cachedChats = localStorage.getItem('pawfect_chats');
      const cacheTimestamp = localStorage.getItem('pawfect_chats_timestamp');
      
      if (cachedChats && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp);
        // Use cache if less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          setChats(JSON.parse(cachedChats));
          toast.success('Loaded chats from cache');
        } else {
          setError('Failed to load chats. Please try again.');
        }
      } else {
        setError('Failed to load chats. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      await api.delete(`/api/chats/${chatId}`);
      
      const updatedChats = chats.filter(chat => chat._id !== chatId);
      setChats(updatedChats);
      localStorage.setItem('pawfect_chats', JSON.stringify(updatedChats));
      
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error(error.response?.data?.message || 'Failed to delete chat');
    } finally {
      setDeletingChatId(null);
    }
  };

  const getOtherUser = (chat) => {
    if (!user) return null;
    return chat.petOwner._id === user.id ? chat.adopter : chat.petOwner;
  };

  const getUserRole = (chat) => {
    if (!user) return '';
    return chat.petOwner._id === user.id ? 'Owner' : 'Adopter';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4 transition-colors"
          >
            <HiArrowLeft className="text-xl" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <HiChatAlt2 className="text-orange-500" />
                My Chats
              </h1>
              <p className="text-gray-600 mt-1">
                {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
            
            <button
              onClick={fetchChats}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {chats.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <HiChatAlt2 className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-600 mb-6">
              Start chatting with pet owners by requesting to adopt a pet!
            </p>
            <button
              onClick={() => navigate('/adopt')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 transition-colors"
            >
              Browse Pets
            </button>
          </div>
        )}

        {/* Chats List */}
        {chats.length > 0 && (
          <div className="space-y-3">
            {chats.map((chat) => {
              const otherUser = getOtherUser(chat);
              const role = getUserRole(chat);
              const isAdopted = chat.adoptionRequest?.adoptionCompleted;

              return (
                <div
                  key={chat._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    disabled={deletingChatId === chat._id}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 z-10"
                    title="Delete chat"
                  >
                    <HiTrash className="text-xl" />
                  </button>

                  {/* Chat Content */}
                  <div
                    onClick={() => navigate(`/chat/${chat.adoptionRequest._id}`)}
                    className="cursor-pointer pr-12"
                  >
                    <div className="flex gap-4">
                      {/* Pet Image */}
                      <div className="flex-shrink-0">
                        {chat.pet.photos && chat.pet.photos.length > 0 ? (
                          <img
                            src={
                              chat.pet.photos[0].startsWith('http')
                                ? chat.pet.photos[0]
                                : `http://localhost:5001${chat.pet.photos[0]}`
                            }
                            alt={chat.pet.petName}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <MdPets className="text-gray-400 text-3xl" />
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {chat.pet.petName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Chatting with: {otherUser?.name || otherUser?.email}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTimestamp(chat.lastMessageTime)}
                          </span>
                        </div>

                        {/* Last Message */}
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-700 truncate mb-2">
                            {chat.lastMessage}
                          </p>
                        )}

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            role === 'Owner' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {role}
                          </span>
                          
                          {isAdopted ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                              <HiCheckCircle />
                              Adopted
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                              <HiClock />
                              In Progress
                            </span>
                          )}
                          
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {chat.pet.species}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsListPage;
