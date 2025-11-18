import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import { MdFilterList } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import api from '../api/api';
import PetCard from '../components/PetCard';

const AdoptPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch pets from backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/adoption');
      
      console.log('Fetched adoption pets:', response.data);
      
      // Extract pets array from response
      const fetchedPets = response.data.pets || [];
      setPets(fetchedPets);
    } catch (err) {
      console.error('Error fetching adoption pets:', err);
      setError('Failed to load pets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pets on component mount
  useEffect(() => {
    fetchPets();
  }, []);

  // Filter pets based on search term
  const filteredPets = pets.filter((pet) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      pet.petName?.toLowerCase().includes(searchLower) ||
      pet.breed?.toLowerCase().includes(searchLower) ||
      pet.description?.toLowerCase().includes(searchLower) ||
      pet.species?.toLowerCase().includes(searchLower) ||
      pet.city?.toLowerCase().includes(searchLower) ||
      pet.state?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by filteredPets, no additional logic needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Find Your Perfect Companion
            </h1>
            <p className="text-gray-600 text-lg">
              Browse through our loving pets waiting for their forever homes
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, breed, or description..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium whitespace-nowrap"
            >
              Search
            </button>

            {/* Filters Button */}
            <button
              type="button"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <MdFilterList className="text-xl" />
              Filters
            </button>
          </form>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredPets.length} of {pets.length} pets
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading pets...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          // Empty State - No Pets Found
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <FaHeart className="text-gray-300 text-8xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No pets found
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              {searchTerm 
                ? "Try adjusting your search criteria or check back later for new additions."
                : "No pets are currently available for adoption. Check back soon!"}
            </p>
          </div>
        ) : (
          // Pet Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptPage;
