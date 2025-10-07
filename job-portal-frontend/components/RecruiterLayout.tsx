'use client';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 
         
        `}
      >
        {children}
      </main>
    </div>
  );
}
