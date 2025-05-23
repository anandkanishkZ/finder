import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ui/ItemCard';
import SearchFilters from '../components/ui/SearchFilters';
import { Item, ItemCategory, ItemStatus } from '../types';

const SearchPage: React.FC = () => {
  const { items, searchItems, filterItems } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get filter params from URL
  const categoryParam = searchParams.get('category') as ItemCategory | null;
  const statusParam = searchParams.get('status') as ItemStatus | null;
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
    const category = searchParams.get('category') as ItemCategory | undefined;
    const status = searchParams.get('status') as ItemStatus | undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom') as string) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo') as string) : undefined;
    
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
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    
    setSearchParams(newParams);
  };
  
  const handleFilterChange = (filters: {
    status?: ItemStatus;
    category?: ItemCategory;
    dateFrom?: Date | null;
    dateTo?: Date | null;
  }) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Items</h1>
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by item name, description, or location"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Search
          </button>
        </form>
      </div>
      
      <SearchFilters onFilter={handleFilterChange} initialFilters={initialFilters} />
      
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {searchParams.toString()
              ? 'Search Results'
              : 'All Items'}
          </h2>
          <span className="text-sm text-gray-500">
            {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
          </span>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
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