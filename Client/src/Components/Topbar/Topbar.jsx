import React from 'react';

export default function Topbar() {
  return (
    <div className="flex items-center justify-between shadow px-4 py-3">
      <div className="w-1/3"></div>

      <div className="w-1/3 text-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-2/3 px-3 py-1 border rounded"
        />
      </div>

      <div className="w-1/3 flex justify-end items-center space-x-4">
        <img
          // src=''
          alt="Profile"
          className="w-8 h-8 rounded-full mr-10"
        />
      </div>
    </div>
  );
}