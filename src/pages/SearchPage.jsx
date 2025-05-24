import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle, Filter } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';
import SearchFilters from '../components/ui/SearchFilters';

const SearchPage = () => {
  const { items, searchItems, filterItems } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryParam = searchParams.get('category');
  const statusParam = searchParams.get('status');
  const dateFromParam = searchParams.get('dateFrom');
  const dateToParam = searchParams.get('dateTo');
  
  const initialFilters = {
    category: categoryParam || undefined,
    status: statusParam || undefined,
    dateFrom: dateFromParam ? new Date(dateFromParam) : null,
    dateTo: dateToParam ? new Date(dateToParam) : null,
  };
  
  useEffect(() => {
    performSearch();
  }, [searchParams]);
  
  const performSearch = () => {
    setIsLoading(true);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')) : undefined;
    
    setTimeout(() => {
      let results = items;
      
      if (query) {
        results = searchItems(query);
      }
      
      if (category || status || dateFrom || dateTo) {
        results = filterItems({
          category,
          status,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
        });
      }
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    
    setSearchParams(newParams);
  };
  
  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value instanceof Date ? value.toISOString() : value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  const getActiveFiltersCount = () => {
    return Object.values(initialFilters).filter(value => value !== undefined && value !== null).length;
  };
  
  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Lost & Found Items</h1>
        
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by item name, description, or location..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="filter-toggle">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-button"
          >
            <Filter className="filter-icon" />
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <SearchFilters onFilter={handleFilterChange} initialFilters={initialFilters} />
          </div>
        )}
      </div>

      <div className="search-results">
        <div className="results-header">
          <h2>
            {searchParams.toString() ? 'Search Results' : 'All Items'}
          </h2>
          <span className="results-count">
            {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
          </span>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="items-grid">
            {searchResults.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <AlertTriangle className="no-results-icon" />
            <h3>No items found</h3>
            <p>
              {searchParams.toString()
                ? 'Try adjusting your search filters or search term'
                : 'There are no items currently available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;