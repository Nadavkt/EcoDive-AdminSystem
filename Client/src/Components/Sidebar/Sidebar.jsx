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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={` text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-n border-gray-300">
          {!collapsed && <h1 className="text-xl font-bold">EcoDive</h1>}
          <button onClick={toggleSidebar}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">

          {/* Data Section */}
          <div>
            {!collapsed && <div className="text-xs text-gray-400 uppercase mb-2">Data</div>}
            <div className="space-y-3">
              <SidebarLink to="/dashboard" icon={<HomeOutlined />} text="Dashboard" collapsed={collapsed} />
              <SidebarLink to="/calendar" icon={<CalendarOutlined />} text="Calendar" collapsed={collapsed} />
              <SidebarLink to="/team" icon={<TeamOutlined />} text="Team Management" collapsed={collapsed} />
              <SidebarLink to="/users" icon={<UserOutlined />} text="Users Info" collapsed={collapsed} />
              <SidebarLink to="/businesses" icon={<ShopOutlined />} text="Businesses Info" collapsed={collapsed} />
            </div>
          </div>

          {/* Pages Section */}
          <div>
            {!collapsed && <div className="text-xs text-gray-400 uppercase mb-2">Pages</div>}
            <div className="space-y-3">
              <SidebarLink to="/add-user" icon={<UserAddOutlined />} text="Add User" collapsed={collapsed} />
              <SidebarLink to="/add-business" icon={<PlusOutlined />} text="Add Business" collapsed={collapsed} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

// Reusable Sidebar Link component
function SidebarLink({ to, icon, text, collapsed }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 hover:text-blue-400 transition-colors duration-200"
    >
      {icon}
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}