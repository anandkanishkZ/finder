import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { ItemCategory, ItemStatus } from '../../types';

interface SearchFiltersProps {
  onFilter: (filters: {
    status?: ItemStatus;
    category?: ItemCategory;
    dateFrom?: Date | null;
    dateTo?: Date | null;
  }) => void;
  initialFilters?: {
    status?: ItemStatus;
    category?: ItemCategory;
    dateFrom?: Date | null;
    dateTo?: Date | null;
  };
}

const categoryOptions: { value: ItemCategory; label: string }[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'documents', label: 'Documents' },
  { value: 'keys', label: 'Keys' },
  { value: 'pets', label: 'Pets' },
  { value: 'person', label: 'Person' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' },
];

const statusOptions: { value: ItemStatus; label: string }[] = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'returned', label: 'Returned' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilter, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: initialFilters.status || undefined,
    category: initialFilters.category || undefined,
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'dateFrom' || name === 'dateTo') {
      setFilters({
        ...filters,
        [name]: value ? new Date(value) : null,
      });
    } else {
      setFilters({
        ...filters,
        [name]: value || undefined,
      });
    }
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: undefined,
      category: undefined,
      dateFrom: null,
      dateTo: null,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors duration-200"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {Object.values(filters).some(v => v !== undefined && v !== null) && (
            <span className="ml-2 bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>
        
        {Object.values(filters).some(v => v !== undefined && v !== null) && (
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-200 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              >
                <option value="">All Categories</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={formatDateForInput(filters.dateFrom)}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={formatDateForInput(filters.dateTo)}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;