import React, { useState } from 'react';
import { Item, Offer } from '../types';
import { Settings, Plus, Edit, Trash2, Package, Tag } from 'lucide-react';

interface AdminPanelProps {
  items: Item[];
  offers: Offer[];
  onAddItem: (item: Omit<Item, 'id'>) => void;
  onUpdateItem: (id: string, item: Omit<Item, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onAddOffer: (offer: Omit<Offer, 'id'>) => void;
  onUpdateOffer: (id: string, offer: Omit<Offer, 'id'>) => void;
  onDeleteOffer: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  items,
  offers,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'offers'>('items');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    image: '',
  });

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    description: '',
    discountPercent: 0,
    minQuantity: 1,
    itemId: '',
  });

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem.id, itemForm);
      setEditingItem(null);
    } else {
      onAddItem(itemForm);
    }
    setItemForm({ name: '', price: 0, stock: 0, image: '' });
    setShowItemForm(false);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offerData = {
      ...offerForm,
      itemId: offerForm.itemId || undefined,
    };

    if (editingOffer) {
      onUpdateOffer(editingOffer.id, offerData);
      setEditingOffer(null);
    } else {
      onAddOffer(offerData);
    }
    setOfferForm({ description: '', discountPercent: 0, minQuantity: 1, itemId: '' });
    setShowOfferForm(false);
  };

  const startEditItem = (item: Item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      price: item.price,
      stock: item.stock,
      image: item.image,
    });
    setShowItemForm(true);
  };

  const startEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOfferForm({
      description: offer.description,
      discountPercent: offer.discountPercent,
      minQuantity: offer.minQuantity,
      itemId: offer.itemId || '',
    });
    setShowOfferForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="text-purple-600" />
        Staff Panel
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'items'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="inline h-5 w-5 mr-2" />
          Items Management
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'offers'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Tag className="inline h-5 w-5 mr-2" />
          Offers Management
        </button>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Items ({items.length})</h3>
            <button
              onClick={() => setShowItemForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {/* Item Form */}
          {showItemForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h4>
              <form onSubmit={handleSubmitItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={itemForm.stock}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowItemForm(false);
                      setEditingItem(null);
                      setItemForm({ name: '', price: 0, stock: 0, image: '' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="text-sm text-gray-600">
                      Price: ${item.price} | Stock: {item.stock}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditItem(item)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Offers ({offers.length})</h3>
            <button
              onClick={() => setShowOfferForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Offer
            </button>
          </div>

          {/* Offer Form */}
          {showOfferForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-3">
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </h4>
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={offerForm.description}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={offerForm.discountPercent}
                      onChange={(e) =>
                        setOfferForm({
                          ...offerForm,
                          discountPercent: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Quantity
                    </label>
                    <input
                      type="number"
                      value={offerForm.minQuantity}
                      onChange={(e) =>
                        setOfferForm({
                          ...offerForm,
                          minQuantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Item (Optional)
                  </label>
                  <select
                    value={offerForm.itemId}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, itemId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Items</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    {editingOffer ? 'Update' : 'Add'} Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOfferForm(false);
                      setEditingOffer(null);
                      setOfferForm({
                        description: '',
                        discountPercent: 0,
                        minQuantity: 1,
                        itemId: '',
                      });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Offers List */}
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{offer.description}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      {offer.discountPercent}% off | Min qty: {offer.minQuantity}
                      {offer.itemId && (
                        <span className="ml-2 text-purple-600">
                          • {items.find((item) => item.id === offer.itemId)?.name || 'Item not found'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditOffer(offer)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteOffer(offer.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
