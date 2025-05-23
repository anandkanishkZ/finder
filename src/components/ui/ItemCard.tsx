import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Item } from '../../types';

interface ItemCardProps {
  item: Item;
}

const categoryColors: Record<string, string> = {
  electronics: 'bg-blue-100 text-blue-800',
  jewelry: 'bg-amber-100 text-amber-800',
  clothing: 'bg-purple-100 text-purple-800',
  documents: 'bg-green-100 text-green-800',
  keys: 'bg-red-100 text-red-800',
  pets: 'bg-indigo-100 text-indigo-800',
  accessories: 'bg-pink-100 text-pink-800',
  person: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusColors: Record<string, string> = {
  lost: 'bg-red-100 text-red-800 border-red-200',
  found: 'bg-green-100 text-green-800 border-green-200',
  claimed: 'bg-blue-100 text-blue-800 border-blue-200',
  returned: 'bg-purple-100 text-purple-800 border-purple-200',
};

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link 
      to={`/item/${item.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[item.category]}`}>
            <Tag className="h-3 w-3 mr-1" />
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(item.date)}</span>
          <MapPin className="h-3 w-3 ml-3 mr-1" />
          <span className="truncate">{item.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;