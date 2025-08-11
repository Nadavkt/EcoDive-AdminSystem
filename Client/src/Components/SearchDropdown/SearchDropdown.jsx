import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchDropdown = ({ results, isVisible, onItemClick }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    onItemClick();
    navigate(item.path);
  };

  if (!isVisible || results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="py-2">
        {results.map((item, index) => (
          <div
            key={item.id}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
                <div className="text-xs text-blue-500 mt-1 capitalize">{item.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
