import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Typography } from 'antd'; 
import { motion } from 'framer-motion';
import '../Styles/antDesignOverride.css';

const { Text, Title } = Typography;

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    emailsSent: 0,
    activeSessions: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/dashboard/stats');
      const data = await res.json(); 
      setStats(data); 
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <Title style={{color: 'white'}} level={1}>Dashboard</Title>
      <p className="text-white mb-6">Small step for the server, big step for the ocean !!</p>

      {/* Row 1 - Counters */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="shadow rounded p-4 flex justify-between items-center text-white"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm">Total Users</p>
            <h2 className="text-2xl font-semibold">{stats.totalUsers}</h2>
          </div>
          <span><FontAwesomeIcon icon={faUser} /></span>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 flex justify-between items-center text-white"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm">Emails Sent</p>
            <h2 className="text-2xl font-semibold">Loading...</h2>
          </div>
          <span><FontAwesomeIcon icon={faEnvelope} /></span>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 text-white"
          variants={itemVariants}
        >
          <p className="text-sm">Active Sessions</p>
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-xs">current users online</p>
        </motion.div>
      </motion.div>

      {/* Row 2 - Charts */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="shadow rounded p-4 text-white"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold">User Logins Over Time</h3>
          <p className="text-sm mb-2">Monthly trend of users login activity</p>
          <div className="h-48 rounded flex items-center justify-center">[Chart Placeholder]</div>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 text-white"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold">New Users Added</h3>
          <p className="text-sm mb-2">Monthly count of new users registrations</p>
          <div className="h-48 rounded flex items-center justify-center">[Chart Placeholder]</div>
        </motion.div>
      </motion.div>

      {/* Row 3 - Lists */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="shadow rounded p-4 h-82 text-white"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold">Insights</h3>
          <ul className="text-sm ml-2 list-inside">
          </ul>
          <a href="#" className="text-blue-500 text-sm mt-2 inline-block">View All</a>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="flex flex-col space-y-2 mt-2">
            <button className="bg-blue-500 text-white py-1 rounded">Add Event</button>
            <button className="bg-blue-500 text-white py-1 rounded">Add New Member</button>
            <button className="bg-blue-500 text-white py-1 rounded">Create Report</button>
          </div>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 width"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white">System Alerts</h3>
          <ul className="text-sm ml-2 list-inside">
            <li className='w-fit mt-2 bg-red-500 text-white rounded-full px-6 py-2'>Database backup failed last night</li>
            <li className='w-fit mt-4 bg-orange-500 text-white rounded-full px-6 py-2'>High login activity detected</li>
            <li className='w-fit mt-4 bg-green-600 text-white rounded-full px-6 py-2'>Scheduled maintenance on Friday</li>
          </ul>
        </motion.div>
      </motion.div>
    </>
  );
}
