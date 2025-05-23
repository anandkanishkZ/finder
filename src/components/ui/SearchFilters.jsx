import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: initialFilters.status || undefined,
    category: initialFilters.category || undefined,
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null,
  });

  const handleFilterChange = (e) => {
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

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="search-filters">
      <div className="search-filters-header">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="search-filters-toggle"
        >
          <Filter className="search-filters-icon" />
          Filters
          {Object.values(filters).some(v => v !== undefined && v !== null) && (
            <span className="search-filters-badge">Active</span>
          )}
        </button>
        
        {Object.values(filters).some(v => v !== undefined && v !== null) && (
          <button
            onClick={handleResetFilters}
            className="search-filters-clear"
          >
            <X className="search-filters-icon-small" />
            Clear all
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="search-filters-panel">
          <div className="search-filters-grid">
            <div className="search-filters-field">
              <label htmlFor="status" className="search-filters-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                className="search-filters-select"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="search-filters-field">
              <label htmlFor="category" className="search-filters-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
                className="search-filters-select"
              >
                <option value="">All Categories</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="search-filters-field">
              <label htmlFor="dateFrom" className="search-filters-label">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={formatDateForInput(filters.dateFrom)}
                onChange={handleFilterChange}
                className="search-filters-input"
              />
            </div>
            
            <div className="search-filters-field">
              <label htmlFor="dateTo" className="search-filters-label">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={formatDateForInput(filters.dateTo)}
                onChange={handleFilterChange}
                className="search-filters-input"
              />
            </div>
          </div>
          
          <div className="search-filters-actions">
            <button
              onClick={() => setIsOpen(false)}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="button button-primary"
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