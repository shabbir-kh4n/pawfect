import { useState, useEffect } from 'react';
import { HiPlus, HiBell, HiExclamation } from 'react-icons/hi';
import { MdVaccines } from 'react-icons/md';
import Modal from '../components/Modal';
import AddPetForm from '../components/AddPetForm';
import AddRecordForm from '../components/AddRecordForm';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const HealthTrackerPage = () => {
  const [pets, setPets] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const closeModal = () => {
    setModalContent(null);
  };

  // Fetch health records for a specific pet
  const fetchHealthRecords = async (petId) => {
    if (!petId) {
      setHealthRecords([]);
      return;
    }

    try {
      setRecordsLoading(true);
      const response = await api.get(`/api/records/${petId}`);
      
      console.log('Fetched health records:', response.data);
      
      // Extract records array from response
      const fetchedRecords = response.data.records || [];
      setHealthRecords(fetchedRecords);
    } catch (err) {
      console.error('Error fetching health records:', err);
      // Don't show error for empty records, just log it
      setHealthRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  // Fetch pets from backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/pets');
      
      console.log('Fetched pets:', response.data);
      
      // Extract pets array from response
      const fetchedPets = response.data.pets || [];
      setPets(fetchedPets);
      
      // Set first pet as selected and fetch its records
      if (fetchedPets.length > 0) {
        const firstPetId = fetchedPets[0]._id;
        setSelectedPetId(firstPetId);
        fetchHealthRecords(firstPetId);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.response?.data?.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pets on component mount
  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  // Handler to refresh pet list after adding a new pet
  const handlePetAdded = () => {
    fetchPets();
  };

  // Handler to refresh health records after adding a new record
  const handleRecordAdded = () => {
    fetchHealthRecords(selectedPetId);
  };

  // Handler for pet selection change
  const handlePetChange = (e) => {
    const newPetId = e.target.value;
    setSelectedPetId(newPetId);
    fetchHealthRecords(newPetId);
  };

  // Handler to delete a pet
  const handleDeletePet = async () => {
    if (!selectedPetId) return;
    if (!window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/pets/${selectedPetId}`);
      // Remove from local state
      const updatedPets = pets.filter(p => p._id !== selectedPetId);
      setPets(updatedPets);
      setSelectedPetId(updatedPets.length > 0 ? updatedPets[0]._id : '');
      setHealthRecords([]);
    } catch (err) {
      alert('Failed to delete pet.');
    }
  };

  // Helper function to check if a record is overdue
  const isRecordOverdue = (nextDueDate) => {
    if (!nextDueDate) return false;
    return new Date(nextDueDate) < new Date();
  };

  // Helper function to calculate days overdue
  const getDaysOverdue = (nextDueDate) => {
    if (!nextDueDate) return 0;
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Derived data based on selected pet
  const selectedPet = pets.find(p => p._id === selectedPetId);
  const overdueRecords = healthRecords.filter(r => isRecordOverdue(r.nextDueDate));
  const upcomingRecords = healthRecords.filter(r => !isRecordOverdue(r.nextDueDate) && r.nextDueDate);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPets}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Health Tracker</h1>
          <p className="text-gray-600 text-lg mb-8">
            Keep your pet's health records organized and never miss important vaccinations or treatments.
          </p>

          {/* Pet Selection and Add Pet Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pet
              </label>
              {pets.length > 0 ? (
                <select
                  value={selectedPetId}
                  onChange={handlePetChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-[200px]"
                >
                  {pets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} {pet.breed && `(${pet.breed})`}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-500 italic">No pets added yet. Add your first pet!</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalContent('add-pet')}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <HiPlus className="text-xl" />
                Add Pet
              </button>
              {selectedPetId && (
                <button
                  onClick={handleDeletePet}
                  className="ml-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  Delete Pet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Overdue Card */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <HiExclamation className="text-red-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  Overdue ({overdueRecords.length})
                </h2>
              </div>

              <div className="space-y-4">
                {recordsLoading ? (
                  <div className="bg-white p-6 rounded-lg text-center">
                    <p className="text-gray-500">Loading records...</p>
                  </div>
                ) : overdueRecords.length > 0 ? (
                  overdueRecords.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center bg-white p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <MdVaccines className="text-gray-400 text-2xl" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.recordType}</h3>
                          <p className="text-sm text-gray-600">
                            {selectedPet?.name || 'Unknown Pet'}
                          </p>
                        </div>
                      </div>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {getDaysOverdue(item.nextDueDate)} days overdue
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg text-center">
                    <p className="text-gray-500">No overdue items</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pet Profile Card */}
            {selectedPet ? (
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pet Profile</h2>

                <div className="flex flex-col items-center">
                  {/* Pet Image - Using placeholder if no image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md bg-white flex items-center justify-center">
                    {selectedPet.image ? (
                      <img
                        src={selectedPet.image}
                        alt={selectedPet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">🐾</span>
                    )}
                  </div>

                  {/* Pet Name and Breed */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedPet.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedPet.breed || 'Mixed Breed'}
                  </p>

                  {/* Pet Details */}
                  <div className="w-full space-y-3">
                    {selectedPet.birthDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Birth Date:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedPet.birthDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    {selectedPet.weight && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedPet.weight} lbs
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedPet.birthDate
                          ? `${Math.floor(
                              (new Date() - new Date(selectedPet.birthDate)) /
                                (365.25 * 24 * 60 * 60 * 1000)
                            )} years`
                          : selectedPet.age
                          ? `${selectedPet.age} years`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200 text-center">
                <p className="text-gray-500">No pet selected. Add a pet to get started!</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Reminders Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <HiBell className="text-blue-500 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">
                  Upcoming Reminders ({upcomingRecords.length})
                </h2>
              </div>

              {recordsLoading ? (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-500">Loading reminders...</p>
                </div>
              ) : upcomingRecords.length > 0 ? (
                <div className="space-y-3">
                  {upcomingRecords.map((record) => (
                    <div key={record._id} className="bg-white p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MdVaccines className="text-blue-500 text-xl" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{record.recordType}</h3>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(record.nextDueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="text-gray-500">No upcoming reminders</p>
                </div>
              )}
            </div>

            {/* Health Records Card */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Health Records</h2>
                  <p className="text-sm text-gray-600">
                    Track vaccinations, treatments, and checkups
                  </p>
                </div>
                <button
                  onClick={() => setModalContent('add-record')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium flex items-center gap-2 text-sm"
                >
                  <HiPlus className="text-lg" />
                  Add Record
                </button>
              </div>

              <div className="space-y-4">
                {recordsLoading ? (
                  <div className="bg-white p-6 rounded-lg text-center">
                    <p className="text-gray-500">Loading records...</p>
                  </div>
                ) : healthRecords.length > 0 ? (
                  healthRecords.map((record) => (
                    <div
                      key={record._id}
                      className="bg-white p-5 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-3">
                          <MdVaccines className="text-gray-400 text-2xl mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {record.recordType}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(record.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isRecordOverdue(record.nextDueDate)
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isRecordOverdue(record.nextDueDate) ? 'Overdue' : 'Current'}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        {record.veterinarian && (
                          <p className="text-gray-600">
                            <span className="font-medium">Veterinarian:</span>{' '}
                            {record.veterinarian}
                          </p>
                        )}
                        {record.nextDueDate && (
                          <p className="text-gray-600">
                            <span className="font-medium">Next Due:</span>{' '}
                            {new Date(record.nextDueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg text-center">
                    <p className="text-gray-500">No health records found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!modalContent} onClose={closeModal}>
        {modalContent === 'add-pet' && (
          <AddPetForm onPetAdded={handlePetAdded} onClose={closeModal} />
        )}
        {modalContent === 'add-record' && (
          <AddRecordForm 
            selectedPetId={selectedPetId}
            onRecordAdded={handleRecordAdded} 
            onClose={closeModal} 
          />
        )}
      </Modal>
    </div>
  );
};

export default HealthTrackerPage;
