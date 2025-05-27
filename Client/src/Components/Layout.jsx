import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import React from 'react';
import '../index.css';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-dark-blue text-sky-custom">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}