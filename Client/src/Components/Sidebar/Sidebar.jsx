import React, { useState } from 'react';
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined,
  UserAddOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

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
                Pages
              </motion.div>
            )}
            <div className="space-y-5">
              <SidebarLink to="/add-user" icon={<UserAddOutlined />} text="Add User" collapsed={collapsed} />
              <SidebarLink to="/add-business" icon={<PlusOutlined />} text="Add Business" collapsed={collapsed} />
            </div>
          </motion.div>
        </nav>
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