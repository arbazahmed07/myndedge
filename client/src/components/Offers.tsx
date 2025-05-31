
import React from 'react';
import { Offer } from '../types';
import { Tag, Gift } from 'lucide-react';

interface OffersProps {
  offers: Offer[];
}

const Offers: React.FC<OffersProps> = ({ offers }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Gift className="text-purple-600" />
        Active Offers
      </h2>
      
      {offers.length === 0 ? (
        <div className="text-center py-8">
          <Tag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No active offers</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for great deals!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white rounded-full p-2 flex-shrink-0">
                  <Tag className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{offer.description}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-600">Discount:</span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full font-bold">
                        {offer.discountPercent}% OFF
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-600">Min Quantity:</span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full font-medium">
                        {offer.minQuantity}+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
