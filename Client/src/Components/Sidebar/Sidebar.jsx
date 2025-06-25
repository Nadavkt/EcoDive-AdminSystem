import React, { useState, useRef, useEffect } from 'react';
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined,
  UserAddOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role;

  // Debug logging
  console.log('Sidebar user data:', user);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="h-screen flex-none">
      <motion.div 
        className={`text-white h-full ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      >
        {/* Header */}
        <div className={`h-[72px] flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} `}>
          <motion.h1 
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold"
          >
            {!collapsed && "EcoDive"}
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="text-xl"
            transition={{ duration: 0.2 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Dashboard Link - Separate Section */}
          <motion.div 
            className="mb-8"
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SidebarLink 
              to="/dashboard" 
              icon={<HomeOutlined />} 
              text="Dashboard" 
              collapsed={collapsed}
              className="text-xl"
            />
          </motion.div>

          {/* Data Section */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-400 uppercase mb-4 font-semibold"
              >
                Data
              </motion.div>
            )}
            <div className="space-y-5">
              <SidebarLink to="/calendar" icon={<CalendarOutlined />} text="Calendar" collapsed={collapsed} />
              <SidebarLink to="/team" icon={<TeamOutlined />} text="Team Management" collapsed={collapsed} />
              <SidebarLink to="/users" icon={<UserOutlined />} text="Users Info" collapsed={collapsed} />
              <SidebarLink to="/businesses" icon={<ShopOutlined />} text="Businesses Info" collapsed={collapsed} />
            </div>
          </motion.div>

          {/* Pages Section */}
          <div>
            {!collapsed && <div className="text-xs text-gray-400 uppercase mb-2">Pages</div>}
            <div className="space-y-3">
              <SidebarLink to="/add-user" icon={<UserAddOutlined />} text="Add User" collapsed={collapsed} />
              <SidebarLink to="/add-business" icon={<PlusOutlined />} text="Add Business" collapsed={collapsed} />
              {userRole === 'Admin' && (
                <SidebarLink 
                  to="/add-team-member" 
                  icon={<UserAddOutlined />} 
                  text="Add Team Member" 
                  collapsed={collapsed} 
                />
              )}
            </div>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 ">
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 w-full"
            >
              {user?.profile_image ? (
                <img
                  src={`http://localhost:5001/${user.profile_image}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.first_name?.[0] || ''}{user?.last_name?.[0] || ''}
                </div>
              )}
              {!collapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.first_name} {user?.last_name}</span>
                  <span className="text-xs text-gray-400 capitalize">{user?.role}</span>
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-dark-blue rounded-lg shadow-lg py-1 border border-gray-700">
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <EditOutlined />
                  <span>Edit Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-200 w-full"
                >
                  <LogoutOutlined />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Sidebar Link component
function SidebarLink({ to, icon, text, collapsed, className = '' }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 ${className}`}
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}