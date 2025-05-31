import React from 'react';
import { Item, CartItem } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ItemListProps {
  items: Item[];
  onAddToCart: (item: Item) => void;
  cart: CartItem[];
}

const ItemList: React.FC<ItemListProps> = ({ items, onAddToCart, cart }) => {
  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find(ci => ci.item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="text-purple-600" />
        Browse Items
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const inCart = getCartQuantity(item.id);
          const availableStock = item.availableStock !== undefined ? item.availableStock : item.stock;
          const isOutOfStock = availableStock === 0;
          
          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                  <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm font-medium ${
                    isOutOfStock ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {isOutOfStock ? 'Out of Stock' : `${availableStock} available`}
                  </span>
                  {inCart > 0 && (
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {inCart} in cart
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={isOutOfStock}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemList;
