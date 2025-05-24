import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertTriangle, Filter, MapPin, Calendar, Tag } from 'lucide-react';
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
    <div className="search-page bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="search-header bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Lost & Found Items</h1>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by item name, description, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <SearchFilters onFilter={handleFilterChange} initialFilters={initialFilters} />
            </div>
          )}
        </div>

        <div className="search-results">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchParams.toString()
                ? 'Search Results'
                : 'All Items'}
            </h2>
            <span className="text-sm text-gray-600">
              {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchParams.toString()
                  ? 'Try adjusting your search filters or search term'
                  : 'There are no items currently available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;