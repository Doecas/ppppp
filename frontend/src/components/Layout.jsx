import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, User, Settings, LogOut, Hash, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 fixed h-screen border-r border-gray-200 bg-white p-4 flex flex-col">
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Clone X</span>
            </Link>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-lg">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{user?.displayName}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 min-h-screen">
          <div className="max-w-2xl mx-auto border-x border-gray-200 bg-white min-h-screen">
            {children}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 fixed right-0 h-screen p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Clone X"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={() => navigate('/explore')}
                />
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Trending</h2>
              <div className="space-y-3">
                {['AI', 'WebDev', 'Tech', 'Coding'].map((tag, index) => (
                  <Link
                    key={tag}
                    to={`/hashtag/${tag}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">#{index + 1} Trending</p>
                        <p className="font-semibold text-gray-900">#{tag}</p>
                        <p className="text-xs text-gray-500">{Math.floor(Math.random() * 10000)} posts</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;