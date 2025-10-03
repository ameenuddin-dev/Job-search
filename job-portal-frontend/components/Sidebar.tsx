'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  setIsOpen: (val: boolean) => void;
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
    { href: '/recruiter/search', label: 'FindJOb', icon: Search },
    { href: '/recruiter/charts', label: 'Charts', icon: BarChart3 },
  ];

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col justify-between transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-8">Recruiter</h1>
          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg 
                    ${
                      isActive
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setIsOpen(false)} // mobile पर click के बाद sidebar auto-close
                >
                  <Icon size={20} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
