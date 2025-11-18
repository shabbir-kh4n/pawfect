import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HiPhone, HiLocationMarker } from 'react-icons/hi';

const ServicesMap = ({ locations }) => {
  // Center on Bangalore, India
  const bangaloreCenter = [12.9716, 77.5946];

  return (
    <div className="bg-orange-50 p-6 rounded-lg relative z-0">
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-md relative z-0">
        <MapContainer
          center={bangaloreCenter}
          zoom={11.5}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render markers for each location */}
          {locations.map((location) => (
            <CircleMarker
              key={location.id}
              center={[location.lat, location.lng]}
              radius={12}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#dc2626',
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-2">{location.name}</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <HiLocationMarker className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <HiPhone className="text-orange-500 flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                  {location.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-900">{location.rating}</span>
                    </div>
                  )}
                  {location.tags && location.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {location.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      {/* Map Info Footer */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
            Veterinary Hospitals - Click on markers for more information
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">Powered by OpenStreetMap</p>
      </div>
    </div>
  );
};

export default ServicesMap;
