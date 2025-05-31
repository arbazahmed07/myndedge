export interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export interface CartItem {
  item: Item;
  quantity: number;
  subtotal: number;
}

export interface Offer {
  id: string;
  description: string;
  discountPercent: number;
  minQuantity: number;
  itemId?: string; // Optional: specific item, if undefined applies to all items
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
}
