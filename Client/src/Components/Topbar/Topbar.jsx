import React, { useState, useEffect, useRef } from 'react';
import { SearchOutlined, SunOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { searchItems } from '../../utils/searchData';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import SupportModal from '../SupportModal/SupportModal';

export default function Topbar() {
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const searchRef = useRef(null);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
    } else {
      const results = searchItems(query);
      setSearchResults(results);
      setShowDropdown(true);
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim() !== '') {
      setShowDropdown(true);
    }
  };

  // Handle search blur
  const handleSearchBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Handle dropdown item click
  const handleDropdownItemClick = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle support modal
  const handleSupportClick = () => {
    setShowSupportModal(true);
  };

  const handleSupportClose = () => {
    setShowSupportModal(false);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="w-1/3"></div>

      <div className="w-1/3 text-center relative" ref={searchRef}>
        <div className={`flex items-center transition-all duration-300 ${isFocused ? 'w-full' : 'w-2/3'} mx-auto`}>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search pages, users, events..."
              value={searchQuery}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border-2 border-transparent rounded-full 
                       transition-all duration-300 ease-in-out
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <SearchOutlined className="absolute left-3 text-gray-400" />
            <SearchDropdown 
              results={searchResults}
              isVisible={showDropdown}
              onItemClick={handleDropdownItemClick}
            />
          </div>
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-4">
        <button
          onClick={handleSupportClick}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                   bg-white text-dark-blue hover:bg-gray-100"
          title="Contact Support"
        >
          <QuestionCircleOutlined className="text-lg" />
        </button>
      </div>
      
      <SupportModal 
        isVisible={showSupportModal}
        onClose={handleSupportClose}
      />
    </div>
  );
}