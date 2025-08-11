import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Typography } from 'antd'; 
import { motion } from 'framer-motion';
import { buildApiUrl } from '../config';
import '../Styles/antDesignOverride.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend
);

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
  hidden: { opacity: 0, x: 100 },
  show: { 
    opacity: 1, 
    x: 0,
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
  const [insights , setInsight] = useState([]);
  const [userLoginsData, setUserLoginsData] = useState([]);
  const [newUsersData, setNewUsersData] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/dashboard'));
      const data = await res.json(); 
      setStats(data);
      setInsight(data.insights || [])
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      console.error('Failed to fetch insights:', err);
    }
  };

  const fetchChartData = async () => {
    try {
      // Fetch user logins data
      const loginsRes = await fetch(buildApiUrl('/api/dashboard/user-logins'));
      const loginsData = await loginsRes.json();
      setUserLoginsData(loginsData);

      // Fetch new users data
      const newUsersRes = await fetch(buildApiUrl('/api/dashboard/new-users'));
      const newUsersData = await newUsersRes.json();
      setNewUsersData(newUsersData);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // User logins bar chart data
  const userLoginsChartData = {
    labels: userLoginsData.map(item => item.month),
    datasets: [
      {
        label: 'User Logins',
        data: userLoginsData.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  // New users line chart data
  const newUsersChartData = {
    labels: newUsersData.map(item => item.month),
    datasets: [
      {
        label: 'New Users',
        data: newUsersData.map(item => item.count),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  return (
    <>
      <Title data-test='title' style={{color: 'white', fontSize: '50px'}}>Dashboard</Title>
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
          <div className="h-48 rounded">
            {userLoginsData.length > 0 ? (
              <Bar data={userLoginsChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 text-white"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold">New Users Added</h3>
          <p className="text-sm mb-2">Monthly count of new users registrations</p>
          <div className="h-48 rounded">
            {newUsersData.length > 0 ? (
              <Line data={newUsersChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>
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
          <h3 className="text-lg font-semibold">AI Insights</h3>
          {insights.length === 0 ? (
            <p className="text-gray-400 text-sm mt-2">No insights available yet.</p>
          ) : (
            <ul className="text-sm ml-2 list-inside">
              {insights.map((item, index) => (
                <li
                  key={index}
                  className="w-fit mt-4 text-white rounded-full px-6 py-2 bg-opacity-20"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

        </motion.div>

        <motion.div 
          className="shadow rounded p-4"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="flex flex-col space-y-6 mt-6">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 w-full flex items-center justify-center">Add Event</button>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 w-full flex items-center justify-center">Add New Member</button>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 w-full flex items-center justify-center">Create Report</button>
          </div>
        </motion.div>

        <motion.div 
          className="shadow rounded p-4 width"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white">Activity Notifications</h3>
          <ul className="text-sm ml-2 list-inside">
          </ul>
          <a href="#" className="text-blue-500 text-sm mt-2 inline-block">View All</a>
        </motion.div>
      </motion.div>
    </>
  );
} 