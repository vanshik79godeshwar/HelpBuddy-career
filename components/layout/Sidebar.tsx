import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart2, 
  Package, 
  Activity, 
  Users, 
  Calendar, 
  Bell, 
  Settings, 
  HelpCircle,
  Menu,
  Boxes
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const navigationItems = [
  { icon: BarChart2, label: 'Overview', path: '/dashboard' },
  { icon: Package, label: 'Services', path: '/dashboard/services' },
  { icon: Activity, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Users, label: 'Customers', path: '/dashboard/customers' },
  { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help', path: '/dashboard/help' },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          z-50 transform lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Boxes className="h-8 w-8 text-blue-500" />
            <h2 className={`font-bold text-xl transition-opacity duration-300 
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
              HelperBuddy
            </h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 
                  ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <div className="min-w-[20px]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`transition-opacity duration-300 
                  ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 w-0'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-700"
            />
            <div className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 w-0'}`}>
              <p className="text-sm font-medium text-gray-300">John Doe</p>
              <p className="text-xs text-gray-500">Service Professional</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}