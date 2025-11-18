import { Link } from 'react-router-dom';
import { HiLocationMarker } from 'react-icons/hi';

const PetCard = ({ pet }) => {
  // Build full image URL
  const imageUrl = pet.photos && pet.photos.length > 0 
    ? `http://localhost:5001${pet.photos[0]}`
    : 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop'; // Fallback image

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Pet Image */}
      <div className="h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={pet.petName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop';
          }}
        />
      </div>

      {/* Pet Info */}
      <div className="p-5">
        {/* Pet Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.petName}</h3>

        {/* Breed & Species */}
        {pet.breed && (
          <p className="text-gray-600 mb-3">
            {pet.breed} • {pet.species}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <HiLocationMarker className="text-orange-500" />
          <span className="text-sm">
            {pet.city}, {pet.state}
          </span>
        </div>

        {/* Quick Info Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pet.age && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {pet.age} {pet.age === 1 ? 'year' : 'years'} old
            </span>
          )}
          {pet.gender && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {pet.gender}
            </span>
          )}
          {pet.size && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {pet.size}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <Link
          to={`/adopt/${pet._id}`}
          className="block w-full bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
