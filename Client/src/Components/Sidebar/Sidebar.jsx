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
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  // You can replace this URL with the actual user's profile image URL
  const profileImageUrl = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop';

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

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="h-screen flex-none">
      {/* Sidebar */}
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
        <div className={`h-[72px] flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} border-b border-gray-300`}>
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
            </div>
          </div>
        </nav>

        {/* Profile Section - Fixed at bottom */}
        <div className="p-4" ref={profileMenuRef}>
          <div className="relative">
            <button
              className="flex items-center gap-3 hover:text-blue-400 transition-colors duration-200 w-full group"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-colors duration-200">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = ''; // Clear the broken image
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.className = 'hidden'; // Hide the img
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-600 flex items-center justify-center"><UserOutlined className="text-white" /></div>';
                  }}
                />
              </div>
              {!collapsed && <span className="flex-1 text-left">Settings</span>}
            </button>

            {/* Dropdown Menu */}
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
                <Link
                  to="/logout"
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <LogoutOutlined />
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Sidebar Link component
function SidebarLink({ to, icon, text, collapsed, className = "" }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }} 
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={to}
        className={`flex items-center gap-4 hover:text-blue-400 transition-colors duration-200 text-lg ${className}`}
      >
        <motion.span
          whileHover={{ rotate: 5 }}
          animate={{ 
            fontSize: collapsed ? "24px" : "20px"
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
          style={{ minWidth: collapsed ? "24px" : "20px" }}
        >
          {icon}
        </motion.span>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}