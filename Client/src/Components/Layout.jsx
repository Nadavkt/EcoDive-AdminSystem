import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import React from 'react';
import '../index.css';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen text-sky-custom min-w-fit">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}