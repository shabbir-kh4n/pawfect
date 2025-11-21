import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  HiLocationMarker, 
  HiHeart, 
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';
import { 
  MdPets, 
  MdCake, 
  MdColorLens,
  MdFitnessCenter,
  MdChildCare,
  MdMedicalServices 
} from 'react-icons/md';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/adoption/${id}`);
        setPet(response.data.pet);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError('Failed to load pet details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const nextPhoto = () => {
    if (pet?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % pet.photos.length);
    }
  };

  const prevPhoto = () => {
    if (pet?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + pet.photos.length) % pet.photos.length);
    }
  };

  const handleAdoptRequest = async () => {
    if (!user) {
      toast.error('Please log in to start chatting with the pet owner');
      navigate('/login');
      return;
    }

    try {
      setCreatingChat(true);
      
      // Create adoption request and chat
      const response = await api.post('/api/adoption-requests', {
        petId: id,
        requesterName: user.name || user.email,
        requesterEmail: user.email,
        requesterPhone: user.phone || 'Not provided',
        message: `Hi! I'm interested in adopting ${pet.petName}. Can we discuss more about the adoption process?`,
      });

      toast.success('Chat created! Redirecting...');
      
      // Navigate to chat
      setTimeout(() => {
        navigate(`/chat/${response.data.request._id}`);
      }, 500);
    } catch (err) {
      console.error('Error creating chat:', err);
      toast.error(err.response?.data?.message || 'Failed to create chat. Please try again.');
    } finally {
      setCreatingChat(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading pet details...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found State
  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The pet you are looking for does not exist.'}</p>
          <Link
            to="/adopt"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <HiArrowLeft /> Back to Adoption Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/adopt')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6 transition-colors"
        >
          <HiArrowLeft className="text-xl" />
          <span>Back to listings</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Photo Gallery */}
          <div>
            {/* Main Photo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              {pet.photos && pet.photos.length > 0 ? (
                <div className="relative">
                  <img
                    src={pet.photos[currentPhotoIndex].startsWith('http') 
                      ? pet.photos[currentPhotoIndex] 
                      : `http://localhost:5001${pet.photos[currentPhotoIndex]}`}
                    alt={`${pet.petName} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Pet+Photo';
                    }}
                  />
                  
                  {/* Photo Navigation */}
                  {pet.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <HiArrowLeft className="text-xl text-gray-800" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <HiArrowLeft className="text-xl text-gray-800 rotate-180" />
                      </button>
                      
                      {/* Photo Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentPhotoIndex + 1} / {pet.photos.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <MdPets className="text-gray-400 text-8xl" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {pet.photos && pet.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pet.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      currentPhotoIndex === index
                        ? 'border-orange-500 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={photo.startsWith('http') 
                        ? photo 
                        : `http://localhost:5001${photo}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Pet Information */}
          <div>
            {/* Pet Name & Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet.petName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <HiLocationMarker className="text-orange-500 text-xl" />
                <span className="text-lg">{pet.city}, {pet.state}</span>
              </div>
              
              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {pet.species}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {pet.gender}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {pet.age} old
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {pet.size}
                </span>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                pet.status === 'Adopted' 
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <HiCheckCircle className={`text-xl ${
                  pet.status === 'Adopted' ? 'text-blue-500' : 'text-green-500'
                }`} />
                <span className={`font-medium ${
                  pet.status === 'Adopted' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {pet.status === 'Adopted' ? 'Adopted' : 'Available for Adoption'}
                </span>
              </div>
            </div>

            {/* Description */}
            {pet.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About {pet.petName}</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Pet Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MdPets className="text-orange-500 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Breed</p>
                    <p className="font-medium text-gray-900">{pet.breed || 'Mixed'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MdCake className="text-orange-500 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{pet.age}</p>
                  </div>
                </div>
                
                {pet.color && (
                  <div className="flex items-center gap-3">
                    <MdColorLens className="text-orange-500 text-2xl" />
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium text-gray-900">{pet.color}</p>
                    </div>
                  </div>
                )}
                
                {pet.energyLevel && (
                  <div className="flex items-center gap-3">
                    <MdFitnessCenter className="text-orange-500 text-2xl" />
                    <div>
                      <p className="text-sm text-gray-500">Energy Level</p>
                      <p className="font-medium text-gray-900">{pet.energyLevel}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Health Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdMedicalServices className="text-orange-500" />
                Health Information
              </h2>
              
              {pet.healthStatus && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Health Status</p>
                  <p className="text-gray-900">{pet.healthStatus}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {pet.vaccinated ? (
                    <HiCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <HiXCircle className="text-red-500 text-xl" />
                  )}
                  <span className={pet.vaccinated ? 'text-green-700' : 'text-red-700'}>
                    Vaccinated
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {pet.spayedNeutered ? (
                    <HiCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <HiXCircle className="text-red-500 text-xl" />
                  )}
                  <span className={pet.spayedNeutered ? 'text-green-700' : 'text-red-700'}>
                    Spayed/Neutered
                  </span>
                </div>
              </div>
            </div>

            {/* Behavior & Compatibility */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MdChildCare className="text-orange-500" />
                Behavior & Compatibility
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {pet.goodWithKids ? (
                    <HiCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <HiXCircle className="text-red-500 text-xl" />
                  )}
                  <span className={pet.goodWithKids ? 'text-green-700' : 'text-red-700'}>
                    Good with Kids
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {pet.goodWithOtherPets ? (
                    <HiCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <HiXCircle className="text-red-500 text-xl" />
                  )}
                  <span className={pet.goodWithOtherPets ? 'text-green-700' : 'text-red-700'}>
                    Good with Other Pets
                  </span>
                </div>
                
                {pet.isStray && (
                  <div className="flex items-center gap-2">
                    <HiCheckCircle className="text-blue-500 text-xl" />
                    <span className="text-blue-700">Rescued Stray</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact CTA */}
            {pet.status === 'Adopted' ? (
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <HiCheckCircle className="text-3xl" />
                  {pet.petName} Has Been Adopted! 🎉
                </h3>
                <p className="text-white/90">
                  This lovely pet has found their forever home. Thank you for your interest in pet adoption!
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <HiHeart className="text-3xl" />
                  Interested in {pet.petName}?
                </h3>
                <p className="mb-4 text-white/90">
                  This lovely pet is looking for a forever home. Send a request to chat with the pet owner!
                </p>
                <button
                  onClick={handleAdoptRequest}
                  disabled={creatingChat}
                  className="w-full bg-white text-orange-500 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingChat ? 'Creating Chat...' : 'Start Chat with Owner'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
