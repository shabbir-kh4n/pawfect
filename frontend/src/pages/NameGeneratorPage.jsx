import { useState } from 'react';
import { HiSparkles, HiRefresh } from 'react-icons/hi';
import { IoPaw } from 'react-icons/io5';
import toast from 'react-hot-toast';
import api from '../api/api';

const NameGeneratorPage = () => {
  const [formData, setFormData] = useState({
    petType: '',
    gender: '',
    keywords: '',
  });
  
  const [names, setNames] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await api.post('/api/ai/generate-name', {
        petType: formData.petType,
        gender: formData.gender,
        keywords: formData.keywords,
      });
      
      setNames(response.data);
      toast.success('Names generated! 🎉');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate names. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      petType: '',
      gender: '',
      keywords: '',
    });
    setNames([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 p-4 rounded-full">
              <HiSparkles className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Pet Name Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Find the pawfect name for your new friend.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type <span className="text-red-500">*</span>
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">Select pet type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality/Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="e.g., fluffy, playful, sleepy"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Optional: Add keywords to personalize the suggestions
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isGenerating}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <HiSparkles className="text-xl" />
                    Generate Names
                  </>
                )}
              </button>
              
              {names.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg font-semibold bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <HiRefresh className="text-xl" />
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {names.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <IoPaw className="text-orange-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">
                Generated Names
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {names.map((name, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200 border border-orange-200"
                >
                  <p className="font-semibold text-gray-900 text-lg">{name}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 text-center">
                💡 <strong>Tip:</strong> Click "Generate Names" again for more suggestions, or adjust your preferences above!
              </p>
            </div>
          </div>
        )}

        {/* Empty State Helper */}
        {names.length === 0 && !isGenerating && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Fill in the form above and click "Generate Names" to get started! ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NameGeneratorPage;
