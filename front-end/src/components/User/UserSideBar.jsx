import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  TrendingUp,
  User,
  Target,
  LogOut
} from 'lucide-react';

const UserSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: TrendingUp,
      label: 'Progress',
      path: '/user/update-progress',
      description: 'Update status'
    },
    {
      icon: Home,
      label: 'Home',
      path: '/user/add-task',
      description: 'Add new AI tasks'
    },
    {
      icon: BarChart3,
      label: 'Dashboard',
      path: '/user/dashboard',
      description: 'View analytics'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/user/profile',
      description: 'Manage account'
    }
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
  <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 z-40 flex-col justify-between">
      <div className="p-6">
        {/* Navigation Section */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-[#8FE877] text-white shadow-lg shadow-green-500/25 transform scale-[1.02]'
                    : 'text-gray-700 hover:text-green-500 hover:bg-green-500/5 hover:translate-x-1'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md transition-colors duration-300 ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-green-500/10'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 group-hover:text-green-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium text-sm ${
                      isActive ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-xs ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1 h-6 bg-white/50 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Section */}
        <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-green-500/5 rounded-xl border border-gray-200/50">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-500" />
            <span>Quick Stats</span>
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Active Tasks</span>
              <span className="font-semibold text-green-500">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-gray-900">48</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-[#8FE877]">+15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          className="w-full group flex items-center space-x-3 px-3 py-3 rounded-lg 
                    transition-all duration-300 text-gray-700 
                    hover:text-green-500 hover:bg-green-500/5 hover:translate-x-1"
        >
          <span>Logout</span>
          <LogOut />
        </button>
      </div>
    </aside>
  );
};

export default UserSideBar;
