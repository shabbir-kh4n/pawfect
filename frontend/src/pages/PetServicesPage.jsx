import { useState, useEffect } from 'react';
import { HiSearch, HiLocationMarker } from 'react-icons/hi';
import { MdViewList, MdMap } from 'react-icons/md';
import ServicesMap from '../components/ServicesMap';
import VetCard from '../components/VetCard';
import Modal from '../components/Modal';
import AddPlaceForm from '../components/AddPlaceForm';
import api from '../api/api';

const PetServicesPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [isEmergency, setIsEmergency] = useState(false);
  const [is24x7, setIs24x7] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/services');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching vet services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    if (isEmergency && !service.isEmergency) return false;
    if (is24x7 && !service.is247) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Veterinary Services & Pet Care
            </h1>
            <p className="text-gray-600 text-lg">
              Find trusted veterinary hospitals and pet care services near you
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by name, location, or service..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Emergency Services</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={is24x7}
                  onChange={(e) => setIs24x7(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">24/7 Open</span>
              </label>
            </div>

            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={'flex items-center gap-2 px-4 py-2 rounded transition-colors ' + (viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-gray-900')}
              >
                <MdViewList className="text-xl" />
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={'flex items-center gap-2 px-4 py-2 rounded transition-colors ' + (viewMode === 'map' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-gray-900')}
              >
                <MdMap className="text-xl" />
                <span className="text-sm font-medium">Map</span>
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
            >
              + Add Place
            </button>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading services...</p>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <HiLocationMarker className="text-gray-300 text-8xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Services Found</h2>
              <p className="text-gray-600 mb-6">
                {services.length === 0 ? "Be the first to add a veterinary service!" : "No services match your filters. Try adjusting your search criteria."}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                + Add Place
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <VetCard 
                  key={service._id} 
                  vet={{
                    id: service._id,
                    name: service.name,
                    address: service.address,
                    phone: service.phone || 'N/A',
                    rating: 4.5,
                    description: service.services.join(', ') || 'Veterinary services',
                    services: service.services,
                    tags: [...(service.is247 ? ['24/7'] : []), ...(service.isEmergency ? ['Emergency'] : []), 'Open']
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4">
              <ServicesMap locations={filteredServices} />
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddPlaceForm 
          onPlaceAdded={fetchServices}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PetServicesPage;
