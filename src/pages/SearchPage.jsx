import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';
import SearchFilters from '../components/ui/SearchFilters';

const SearchPage = () => {
  const { items, searchItems, filterItems } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get filter params from URL
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
    
    // Set timeout to simulate loading
    setTimeout(() => {
      let results = items;
      
      // Apply text search if query exists
      if (query) {
        results = searchItems(query);
      }
      
      // Apply filters
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
    
    // Update URL params based on filters
    if (filters.category) {
      newParams.set('category', filters.category);
    } else {
      newParams.delete('category');
    }
    
    if (filters.status) {
      newParams.set('status', filters.status);
    } else {
      newParams.delete('status');
    }
    
    if (filters.dateFrom) {
      newParams.set('dateFrom', filters.dateFrom.toISOString());
    } else {
      newParams.delete('dateFrom');
    }
    
    if (filters.dateTo) {
      newParams.set('dateTo', filters.dateTo.toISOString());
    } else {
      newParams.delete('dateTo');
    }
    
    setSearchParams(newParams);
  };
  
  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search Items</h1>
        
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by item name, description, or location"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="button button-primary">
            Search
          </button>
        </form>
      </div>
      
      <SearchFilters onFilter={handleFilterChange} initialFilters={initialFilters} />
      
      <div className="search-results">
        <div className="search-results-header">
          <h2 className="results-title">
            {searchParams.toString()
              ? 'Search Results'
              : 'All Items'}
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
            <h3 className="no-results-title">No items found</h3>
            <p className="no-results-message">
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