import { HiLocationMarker, HiPhone } from 'react-icons/hi';
import { MdDirections } from 'react-icons/md';

const VetCard = ({ vet }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{vet.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiLocationMarker className="text-gray-400" />
            <span>{vet.address}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-red-500 font-semibold mb-1">Veterinary</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-gray-900">{vet.rating}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{vet.description}</p>

      {/* Services Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {vet.services.map((service, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-300"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MdDirections className="text-gray-400 text-lg" />
            <span>{vet.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiPhone className="text-gray-400" />
            <span>{vet.phone}</span>
          </div>
        </div>
        
        {/* Action Tags */}
        <div className="flex gap-2">
          {vet.tags.map((tag, index) => {
            let bgColor = 'bg-orange-100 text-orange-600';
            if (tag === 'Emergency') {
              bgColor = 'bg-red-500 text-white';
            } else if (tag === 'Closed') {
              bgColor = 'bg-orange-400 text-white';
            }
            
            return (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-semibold rounded ${bgColor}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VetCard;
