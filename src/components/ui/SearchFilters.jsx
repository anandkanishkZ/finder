import React, { useState } from 'react';
import { Filter, X, Calendar, Tag, MapPin } from 'lucide-react';

const categoryOptions = [
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

const statusOptions = [
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'returned', label: 'Returned' },
];

const SearchFilters = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || '',
    category: initialFilters.category || '',
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value || undefined,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value ? new Date(value) : null,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      category: '',
      dateFrom: null,
      dateTo: null,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category || ''}
            onChange={handleFilterChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            name="dateFrom"
            value={formatDateForInput(filters.dateFrom)}
            onChange={handleDateChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            name="dateTo"
            value={formatDateForInput(filters.dateTo)}
            onChange={handleDateChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {Object.values(filters).some(value => value) && (
        <div className="flex justify-end">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;