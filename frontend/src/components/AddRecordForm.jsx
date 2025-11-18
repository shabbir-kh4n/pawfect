import { useState } from 'react';
import { MdShield } from 'react-icons/md';
import api from '../api/api';

const AddRecordForm = ({ selectedPetId, onRecordAdded, onClose }) => {
  const [formData, setFormData] = useState({
    recordType: '',
    date: '',
    veterinarian: '',
    nextDueDate: '',
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
    
    if (!selectedPetId) {
      setError('Please select a pet first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create health record object
      const recordData = {
        petId: selectedPetId,
        recordType: formData.recordType,
        date: formData.date,
        veterinarian: formData.veterinarian,
        nextDueDate: formData.nextDueDate || null,
      };
      
      // Call backend API to create health record
      const response = await api.post('/api/records', recordData);
      
      console.log('Health record created successfully:', response.data);
      
      // Reset form
      setFormData({
        recordType: '',
        date: '',
        veterinarian: '',
        nextDueDate: '',
      });
      
      // Refresh the health records list in parent component
      if (onRecordAdded) {
        onRecordAdded();
      }
      
      // Close the modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error creating health record:', err);
      setError(err.response?.data?.message || 'Failed to add health record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500 p-3 rounded-lg">
          <MdShield className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Add Health Record</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Record Type */}
        <div>
          <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
            Record Type <span className="text-red-500">*</span>
          </label>
          <select
            id="recordType"
            name="recordType"
            value={formData.recordType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          >
            <option value="">Select record type</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Deworming">Deworming</option>
            <option value="Checkup">Checkup</option>
            <option value="Surgery">Surgery</option>
            <option value="Medication">Medication</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        {/* Veterinarian */}
        <div>
          <label htmlFor="veterinarian" className="block text-sm font-medium text-gray-700 mb-1">
            Veterinarian <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="veterinarian"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            placeholder="Enter veterinarian name"
          />
        </div>

        {/* Next Due Date */}
        <div>
          <label htmlFor="nextDueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Next Due Date
          </label>
          <input
            type="date"
            id="nextDueDate"
            name="nextDueDate"
            value={formData.nextDueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
