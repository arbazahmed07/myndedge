
import React from 'react';
import { CartItem, Offer } from '../types';
import { ShoppingCart, Trash2, Tag } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  offers: Offer[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  cart, 
  offers, 
  onUpdateQuantity, 
  onRemoveItem, 
  onPlaceOrder 
}) => {
  const calculateDiscountedPrice = (cartItem: CartItem) => {
    const applicableOffers = offers.filter(offer => 
      (!offer.itemId || offer.itemId === cartItem.item.id) && 
      cartItem.quantity >= offer.minQuantity
    );
    
    if (applicableOffers.length === 0) {
      return cartItem.subtotal;
    }
    
    // Apply highest discount
    const bestOffer = applicableOffers.reduce((best, current) => 
      current.discountPercent > best.discountPercent ? current : best
    );
    
    const discountAmount = cartItem.subtotal * (bestOffer.discountPercent / 100);
    return cartItem.subtotal - discountAmount;
  };

  const getAppliedOffer = (cartItem: CartItem) => {
    const applicableOffers = offers.filter(offer => 
      (!offer.itemId || offer.itemId === cartItem.item.id) && 
      cartItem.quantity >= offer.minQuantity
    );
    
    if (applicableOffers.length === 0) return null;
    
    return applicableOffers.reduce((best, current) => 
      current.discountPercent > best.discountPercent ? current : best
    );
  };

  const cartTotal = cart.reduce((total, cartItem) => 
    total + calculateDiscountedPrice(cartItem), 0
  );

  const originalTotal = cart.reduce((total, cartItem) => 
    total + cartItem.subtotal, 0
  );

  const totalSavings = originalTotal - cartTotal;

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="text-purple-600" />
          Your Cart
        </h2>
        <div className="text-center py-8">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <p className="text-gray-400 text-sm mt-2">Add some items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="text-purple-600" />
        Your Cart ({cart.length} items)
      </h2>
      
      <div className="space-y-4 mb-6">
        {cart.map((cartItem) => {
          const appliedOffer = getAppliedOffer(cartItem);
          const discountedPrice = calculateDiscountedPrice(cartItem);
          const hasDiscount = appliedOffer !== null;
          
          return (
            <div key={cartItem.item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{cartItem.item.name}</h3>
                  <p className="text-gray-600">${cartItem.item.price} each</p>
                  {hasDiscount && (
                    <div className="flex items-center gap-1 mt-1">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        {appliedOffer.discountPercent}% off applied!
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => onRemoveItem(cartItem.item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="font-medium text-lg w-8 text-center">{cartItem.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  {hasDiscount && (
                    <div className="text-sm text-gray-500 line-through">
                      ${cartItem.subtotal.toFixed(2)}
                    </div>
                  )}
                  <div className="font-bold text-lg text-gray-800">
                    ${discountedPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        {totalSavings > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-600 font-medium">Total Savings:</span>
            <span className="text-green-600 font-bold">−${totalSavings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-purple-600">${cartTotal.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onPlaceOrder}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
