import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, CartItem, Offer, Order } from '../types';
import { initialItems, initialOffers } from '../data/mockData';
import ItemList from '../components/ItemList';
import Offers from '../components/Offers';
import AdminPanel from '../components/AdminPanel';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Gift, Settings, Store, User, LogOut } from 'lucide-react';

const Index = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'shop' | 'offers' | 'admin'>('shop');
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; variant?: 'destructive' } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log('Lovable Ordering System initialized with:', {
      items: items.length,
      offers: offers.length,
      cart: cart.length
    });
  }, []);

  // Handle toast messages to avoid render cycle issues
  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
      setToastMessage(null);
    }
  }, [toastMessage, toast]);

  const handleLogout = () => {
    logout();
    setToastMessage({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  // Cart functions
  const addToCart = (item: Item) => {
    if (item.stock === 0) {
      setToastMessage({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.item.id === item.id);
      
      if (existingItem) {
        if (existingItem.quantity >= item.stock) {
          setToastMessage({
            title: "Stock Limit Reached",
            description: `Cannot add more ${item.name}. Only ${item.stock} available.`,
            variant: "destructive"
          });
          return prevCart;
        }
        
        const updatedCart = prevCart.map(ci =>
          ci.item.id === item.id
            ? { 
                ...ci, 
                quantity: ci.quantity + 1,
                subtotal: (ci.quantity + 1) * ci.item.price
              }
            : ci
        );
        
        console.log(`Added ${item.name} to cart. New quantity: ${existingItem.quantity + 1}`);
        setToastMessage({
          title: "Added to Cart",
          description: `${item.name} added to cart.`
        });
        
        return updatedCart;
      } else {
        const newCartItem: CartItem = {
          item,
          quantity: 1,
          subtotal: item.price
        };
        
        console.log(`Added new item ${item.name} to cart`);
        setToastMessage({
          title: "Added to Cart",
          description: `${item.name} added to cart.`
        });
        
        return [...prevCart, newCartItem];
      }
    });
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
      setToastMessage({
        title: "Stock Limit Reached",
        description: `Cannot add more ${item.name}. Only ${item.stock} available.`,
        variant: "destructive"
      });
      return;
    }

    setCart(prevCart =>
      prevCart.map(ci =>
        ci.item.id === itemId
          ? { 
              ...ci, 
              quantity: newQuantity,
              subtotal: newQuantity * ci.item.price
            }
          : ci
      )
    );

    console.log(`Updated ${item.name} quantity to ${newQuantity}`);
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setCart(prevCart => prevCart.filter(ci => ci.item.id !== itemId));
    
    console.log(`Removed ${item?.name} from cart`);
    setToastMessage({
      title: "Removed from Cart",
      description: `${item?.name} removed from cart.`
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      setToastMessage({
        title: "Empty Cart",
        description: "Add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    // Calculate final totals with offers
    const calculateDiscountedPrice = (cartItem: CartItem) => {
      const applicableOffers = offers.filter(offer => 
        (!offer.itemId || offer.itemId === cartItem.item.id) && 
        cartItem.quantity >= offer.minQuantity
      );
      
      if (applicableOffers.length === 0) {
        return cartItem.subtotal;
      }
      
      const bestOffer = applicableOffers.reduce((best, current) => 
        current.discountPercent > best.discountPercent ? current : best
      );
      
      const discountAmount = cartItem.subtotal * (bestOffer.discountPercent / 100);
      return cartItem.subtotal - discountAmount;
    };

    const orderTotal = cart.reduce((total, cartItem) => 
      total + calculateDiscountedPrice(cartItem), 0
    );

    // Update stock
    const updatedItems = items.map(item => {
      const cartItem = cart.find(ci => ci.item.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.quantity };
      }
      return item;
    });

    setItems(updatedItems);

    // Log offers applied
    cart.forEach(cartItem => {
      const applicableOffers = offers.filter(offer => 
        (!offer.itemId || offer.itemId === cartItem.item.id) && 
        cartItem.quantity >= offer.minQuantity
      );
      
      if (applicableOffers.length > 0) {
        const bestOffer = applicableOffers.reduce((best, current) => 
          current.discountPercent > best.discountPercent ? current : best
        );
        console.log(`Applied offer: ${bestOffer.description} to ${cartItem.item.name}`);
      }
    });

    const order: Order = {
      id: Date.now().toString(),
      items: cart.map(ci => ({
        ...ci,
        subtotal: calculateDiscountedPrice(ci)
      })),
      total: orderTotal,
      timestamp: new Date()
    };

    console.log('Order placed:', order);

    // Clear cart
    setCart([]);

    setToastMessage({
      title: "Order Placed Successfully!",
      description: `Your order total is $${orderTotal.toFixed(2)}. Stock has been updated.`
    });
  };

  // Admin functions
  const addItem = (itemData: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString()
    };
    
    setItems(prev => [...prev, newItem]);
    console.log('Added new item:', newItem);
    
    setToastMessage({
      title: "Item Added",
      description: `${newItem.name} has been added to the inventory.`
    });
  };

  const updateItem = (id: string, itemData: Omit<Item, 'id'>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...itemData, id } : item
    ));
    
    console.log('Updated item:', id, itemData);
    
    setToastMessage({
      title: "Item Updated",
      description: `${itemData.name} has been updated.`
    });
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    
    // Remove from cart if exists
    setCart(prev => prev.filter(ci => ci.item.id !== id));
    
    console.log('Deleted item:', id);
    
    setToastMessage({
      title: "Item Deleted",
      description: `${item?.name} has been removed from inventory.`
    });
  };

  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: Date.now().toString()
    };
    
    setOffers(prev => [...prev, newOffer]);
    console.log('Added new offer:', newOffer);
    
    setToastMessage({
      title: "Offer Added",
      description: "New offer has been created."
    });
  };

  const updateOffer = (id: string, offerData: Omit<Offer, 'id'>) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offerData, id } : offer
    ));
    
    console.log('Updated offer:', id, offerData);
    
    setToastMessage({
      title: "Offer Updated",
      description: "Offer has been updated."
    });
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
    console.log('Deleted offer:', id);
    
    setToastMessage({
      title: "Offer Deleted",
      description: "Offer has been removed."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                <Store className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Order Flow
              </h1>
            </div>
            
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveView('shop')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === 'shop'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Store className="h-4 w-4" />
                Shop
              </button>
              
              <button
                onClick={() => setActiveView('offers')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === 'offers'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Gift className="h-4 w-4" />
                Offers
              </button>
              
              <button
                onClick={() => setActiveView('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === 'admin'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Settings className="h-4 w-4" />
                Staff
              </button>
            </nav>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart ({cart.length})
              </button>
              
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'shop' && (
          <div className="max-w-6xl mx-auto">
            <ItemList 
              items={items} 
              onAddToCart={addToCart} 
              cart={cart} 
            />
          </div>
        )}

        {activeView === 'offers' && (
          <div className="max-w-4xl mx-auto">
            <Offers offers={offers} />
          </div>
        )}

        {activeView === 'admin' && (
          <div className="max-w-6xl mx-auto">
            <AdminPanel
              items={items}
              offers={offers}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onAddOffer={addOffer}
              onUpdateOffer={updateOffer}
              onDeleteOffer={deleteOffer}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
