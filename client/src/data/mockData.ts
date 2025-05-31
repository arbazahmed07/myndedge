import { Item, Offer } from '../types';

export const initialItems: Item[] = [
  { 
    id: '1', 
    name: 'Premium Coffee Beans', 
    price: 24.99, 
    stock: 50,
    availableStock: 50,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
  },
  { 
    id: '2', 
    name: 'Artisan Chocolate', 
    price: 12.99, 
    stock: 0,
    availableStock: 0,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'
  },
  { 
    id: '3', 
    name: 'Fresh Croissants', 
    price: 3.99, 
    stock: 25,
    availableStock: 25,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
  },
  { 
    id: '4', 
    name: 'Organic Tea Blend', 
    price: 18.99, 
    stock: 30,
    availableStock: 30,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
  },
  { 
    id: '5', 
    name: 'Gourmet Cookies', 
    price: 8.99, 
    stock: 40,
    availableStock: 40,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
  },
  { 
    id: '6', 
    name: 'French Pastries', 
    price: 15.99, 
    stock: 15,
    availableStock: 15,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
  },
];

export const initialOffers: Offer[] = [
  {
    id: '1',
    description: 'Buy 3 or more Premium Coffee Beans, get 15% off',
    discountPercent: 15,
    minQuantity: 3,
    itemId: '1'
  },
  {
    id: '2',
    description: 'Buy 5 or more Gourmet Cookies, get 20% off',
    discountPercent: 20,
    minQuantity: 5,
    itemId: '5'
  },
  {
    id: '3',
    description: 'Buy 2 or more Organic Tea Blend, get 10% off',
    discountPercent: 10,
    minQuantity: 2,
    itemId: '4'
  }
];
