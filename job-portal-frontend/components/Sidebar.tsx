'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import {
  Home,
  Search,
  BarChart3,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/recruiter/dashboard', label: 'Dashboard', icon: Home },
    { href: '/recruiter/postjob', label: 'Post Job', icon: PlusCircle },
    { href: '/recruiter/search', label: 'Find Job', icon: Search },
    { href: '/recruiter/charts', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="relative">
      {/* Backdrop (Mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 md:hidden transition"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64
          bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-900
          text-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-10 tracking-wide">
            <span className="text-blue-300">R</span>ecruiter
          </h1>

          {/* Navigation */}
          <nav className="space-y-3">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-lg font-semibold'
                        : 'hover:bg-blue-600/30 hover:translate-x-1 text-gray-200'
                    }`}
                >
                  <Icon
                    size={22}
                    className={`${
                      isActive ? 'text-blue-700' : 'group-hover:text-white'
                    } transition-colors`}
                  />
                  <span className="text-base">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-300 hover:text-red-500 transition-all duration-200"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
