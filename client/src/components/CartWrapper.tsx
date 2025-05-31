
import React, { useState, useEffect } from 'react';
import { Item, CartItem, Offer } from '../types';
import { initialItems, initialOffers } from '../data/mockData';
import CartPage from '../pages/Cart';
import { useToast } from '../hooks/use-toast';

const CartWrapper = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lovable-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lovable-cart', JSON.stringify(cart));
  }, [cart]);

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(ci => ci.item.id !== itemId));
      return;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
      toast({
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
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setCart(prevCart => prevCart.filter(ci => ci.item.id !== itemId));
    
    toast({
      title: "Removed from Cart",
      description: `${item?.name} removed from cart.`
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
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
    setCart([]);
    localStorage.removeItem('lovable-cart');

    toast({
      title: "Order Placed Successfully!",
      description: `Your order total is $${orderTotal.toFixed(2)}. Stock has been updated.`
    });
  };

  return (
    <CartPage
      cart={cart}
      offers={offers}
      onUpdateQuantity={updateCartQuantity}
      onRemoveItem={removeFromCart}
      onPlaceOrder={placeOrder}
    />
  );
};

export default CartWrapper;
