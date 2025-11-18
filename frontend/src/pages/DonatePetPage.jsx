import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUpload, HiInformationCircle } from 'react-icons/hi';
import { MdLocationOn, MdPerson } from 'react-icons/md';
import { IoPaw } from 'react-icons/io5';
import api from '../api/api';

const DonatePetPage = () => {
  const [formData, setFormData] = useState({
    // Pet Information
    petName: '',
    species: '',
    breed: '',
    age: '',
    gender: 'Male',
    size: '',
    color: '',
    energyLevel: '',
    description: '',
    healthStatus: '',
    
    // Checkboxes
    vaccinated: false,
    spayedNeutered: false,
    goodWithKids: false,
    goodWithPets: false,
    isStray: false,
    
    // Location
    city: '',
    state: '',
    
    // Your Information
    yourName: '',
    email: '',
    phone: '',
    adoptionFee: '',
    reason: '',
  });

  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user types
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    
    // Create preview URLs
    if (selectedFiles && selectedFiles.length > 0) {
      const urls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        urls.push(URL.createObjectURL(selectedFiles[i]));
      }
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData object
      const submitData = new FormData();

      // Append all text fields
      submitData.append('petName', formData.petName);
      submitData.append('species', formData.species);
      submitData.append('breed', formData.breed);
      submitData.append('age', formData.age);
      submitData.append('gender', formData.gender);
      submitData.append('size', formData.size);
      submitData.append('color', formData.color);
      submitData.append('energyLevel', formData.energyLevel);
      submitData.append('description', formData.description);
      submitData.append('healthStatus', formData.healthStatus);
      
      // Append boolean fields
      submitData.append('vaccinated', formData.vaccinated);
      submitData.append('spayedNeutered', formData.spayedNeutered);
      submitData.append('goodWithKids', formData.goodWithKids);
      submitData.append('goodWithOtherPets', formData.goodWithPets);
      submitData.append('isStray', formData.isStray);
      
      // Append location
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      
      // Append donator information (map field names to backend schema)
      submitData.append('donatorName', formData.yourName);
      submitData.append('donatorEmail', formData.email);
      submitData.append('donatorPhone', formData.phone);
      submitData.append('reasonForDonation', formData.reason);

      // Append photo files
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          submitData.append('photos', files[i]);
        }
      }

      // Send to backend
      const response = await api.post('/api/adoption', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Pet donation submitted successfully:', response.data);
      
      // Navigate to adopt page on success
      navigate('/adopt');
    } catch (err) {
      console.error('Error submitting pet donation:', err);
      setError(err.response?.data?.message || 'Failed to submit pet donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Donate a Pet</h1>
          <p className="text-gray-600 text-lg">
            Help a pet find their forever home by sharing their story
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <HiInformationCircle className="text-xl" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Information Section */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <IoPaw className="text-orange-500 text-xl" />
              <h2 className="text-xl font-bold text-gray-900">Pet Information</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Tell us about the pet you'd like to help find a home
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="e.g., Buddy"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Species */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Select species</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="e.g., Golden Retriever"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                      className="mr-2 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Select size</option>
                  <option value="Small">Small (under 20 lbs)</option>
                  <option value="Medium">Medium (20-50 lbs)</option>
                  <option value="Large">Large (50-100 lbs)</option>
                  <option value="Extra Large">Extra Large (over 100 lbs)</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Golden Brown"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Select energy level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about the pet's personality, habits, and what makes them special..."
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Health Status */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health Status <span className="text-red-500">*</span>
              </label>
              <textarea
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleInputChange}
                placeholder="Describe the pet's current health condition, any medical issues, medications, etc."
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">Vaccinated</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goodWithKids"
                    checked={formData.goodWithKids}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">Good with Kids</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isStray"
                    checked={formData.isStray}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">This is a stray animal</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="spayedNeutered"
                    checked={formData.spayedNeutered}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">Spayed/Neutered</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="goodWithPets"
                    checked={formData.goodWithPets}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-700">Good with Other Pets</span>
                </label>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <MdLocationOn className="text-orange-500 text-xl" />
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Where is the pet currently located?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Karnataka"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Pet Photos Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pet Photos</h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload up to 5 photos of the pet (optional but recommended)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors duration-200">
              <input
                type="file"
                id="photos"
                name="photos"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="photos"
                className="cursor-pointer flex flex-col items-center"
              >
                <HiUpload className="text-gray-400 text-5xl mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG or JPEG (MAX. 5 files)
                </p>
                {files && files.length > 0 && (
                  <p className="text-sm text-orange-500 mt-2">
                    {files.length} file(s) selected
                  </p>
                )}
              </label>
            </div>

            {/* Photo Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Your Information Section */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <MdPerson className="text-orange-500 text-xl" />
              <h2 className="text-xl font-bold text-gray-900">Your Information</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              We need your contact details to coordinate the adoption
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Your Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Adoption Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adoption Fee (₹)
                </label>
                <input
                  type="number"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reason for Donating */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you donating this pet? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Please explain your reason for donating (e.g., moving, allergies, unable to care for, found stray, etc.)"
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg transition-colors duration-200 font-semibold text-lg shadow-md hover:shadow-lg ${
                loading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Pet Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonatePetPage;
