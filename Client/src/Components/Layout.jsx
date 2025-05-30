import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import { useLocation } from 'react-router-dom';
import '../index.css';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen text-sky-custom">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}