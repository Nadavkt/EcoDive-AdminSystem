import React, { useState } from 'react';
import { SearchOutlined, BulbOutlined, QuestionOutlined } from '@ant-design/icons';

export default function Topbar() {
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Here you can add your theme switching logic
  };

  return (
    <div className="flex items-center justify-between shadow px-6 py-4">
      <div className="w-1/3"></div>

      <div className="w-1/3 text-center relative">
        <div className={`flex items-center transition-all duration-300 ${isFocused ? 'w-full' : 'w-2/3'} mx-auto`}>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 border-2 border-transparent rounded-full 
                       transition-all duration-300 ease-in-out
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <SearchOutlined className="absolute left-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                   bg-white text-dark-blue hover:bg-gray-100"
        >
          <BulbOutlined className="text-lg" />
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                   bg-white text-dark-blue hover:bg-gray-100"
        >
          <QuestionOutlined className="text-lg" />
        </button>
      </div>
    </div>
  );
}