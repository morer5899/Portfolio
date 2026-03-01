// components/LeetCodeActivity.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaChartLine, FaTrophy, FaCalendar, FaCheckCircle, FaCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import axios from 'axios';
import { getApiUrl, PLATFORM_URLS } from '../../config';

const LeetCodeActivity = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [problems, setProblems] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0
  });

  useEffect(() => {
    if (username) {
      fetchLeetCodeData();
    }
  }, [username]);

  const fetchLeetCodeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(getApiUrl(`/api/coding/leetcode/${username}`));
      
      if (response.data && response.data.stats) {
        const { stats } = response.data;
        setProblems({
          easy: stats.easy || 0,
          medium: stats.medium || 0,
          hard: stats.hard || 0,
          total: stats.total || 0
        });
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      setError('Failed to fetch LeetCode data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loader-3d">
          <div className="loader-cube">
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button 
          onClick={fetchLeetCodeData}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Platform Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-yellow-500/10 rounded-xl">
            <SiLeetcode className="text-4xl text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">LeetCode Statistics</h2>
            <p className="text-gray-400">@{username}</p>
          </div>
        </div>
        <a
          href={PLATFORM_URLS.leetcode(username)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-dark-50/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group"
        >
          <span className="text-gray-400 group-hover:text-yellow-500">View Profile</span>
          <FaExternalLinkAlt className="text-gray-500 group-hover:text-yellow-500" size={14} />
        </a>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Total Solved</h3>
            <FaCode className="text-primary-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{problems.total}</p>
        </div>

        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Easy</h3>
            <FaCheckCircle className="text-green-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-green-500">{problems.easy}</p>
        </div>

        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Medium</h3>
            <FaChartLine className="text-yellow-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-yellow-500">{problems.medium}</p>
        </div>

        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Hard</h3>
            <FaTrophy className="text-red-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-red-500">{problems.hard}</p>
        </div>
      </motion.div>

      {/* Progress Bars */}
      <motion.div
        variants={itemVariants}
        className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">Progress by Difficulty</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Easy</span>
              <span className="text-white">{problems.easy}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((problems.easy / 100) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-green-500 h-2.5 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Medium</span>
              <span className="text-white">{problems.medium}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((problems.medium / 100) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-yellow-500 h-2.5 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Hard</span>
              <span className="text-white">{problems.hard}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((problems.hard / 100) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.9 }}
                className="bg-red-500 h-2.5 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeetCodeActivity;