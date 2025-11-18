import { useState } from 'react';
import { IoPaw } from 'react-icons/io5';
import api from '../api/api';

const AddPetForm = ({ onPetAdded, onClose }) => {
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    birthDate: '',
    weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // Create pet object matching backend schema
      const petData = {
        name: formData.petName,
        breed: formData.breed,
        birthDate: formData.birthDate,
        weight: parseFloat(formData.weight),
      };
      
      // Call backend API to create pet
      const response = await api.post('/api/pets', petData);
      
      console.log('Pet created successfully:', response.data);
      
      // Reset form
      setFormData({
        petName: '',
        breed: '',
        birthDate: '',
        weight: '',
      });
      
      // Refresh the pet list in parent component
      if (onPetAdded) {
        onPetAdded();
      }
      
      // Close the modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error creating pet:', err);
      setError(err.response?.data?.message || 'Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500 p-3 rounded-lg">
          <IoPaw className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Pet</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Pet Name */}
        <div>
          <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
            Pet Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            placeholder="Enter pet name"
          />
        </div>

        {/* Breed */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
            Breed <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            placeholder="Enter breed"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            step="0.1"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            placeholder="Enter weight in kg"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Pet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPetForm;
