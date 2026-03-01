// components/HackerRankActivity.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaTrophy, FaExternalLinkAlt, FaMedal } from 'react-icons/fa';
import { FaHackerrank } from 'react-icons/fa';
import axios from 'axios';
import { getApiUrl, PLATFORM_URLS } from '../../config';

const HackerRankActivity = ({ username }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetchHackerRankData();
    }
  }, [username]);

  const fetchHackerRankData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(getApiUrl(`/api/coding/hackerrank/${username}`));
      
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching HackerRank data:', error);
      setError('Failed to fetch HackerRank data. Please try again later.');
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
          onClick={fetchHackerRankData}
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
          <div className="p-4 bg-emerald-500/10 rounded-xl">
            <FaHackerrank className="text-4xl text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">HackerRank Statistics</h2>
            <p className="text-gray-400">@{username}</p>
          </div>
        </div>
        <a
          href={PLATFORM_URLS.hackerrank(username)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-dark-50/50 rounded-lg border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group"
        >
          <span className="text-gray-400 group-hover:text-emerald-500">View Profile</span>
          <FaExternalLinkAlt className="text-gray-500 group-hover:text-emerald-500" size={14} />
        </a>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Total Badges</h3>
            <FaMedal className="text-emerald-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{data?.badges || 'N/A'}</p>
        </div>

        <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400">Certifications</h3>
            <FaTrophy className="text-yellow-500" size={24} />
          </div>
          <p className="text-4xl font-bold text-yellow-500">{data?.certifications || 'N/A'}</p>
        </div>
      </motion.div>

      {/* Note about HackerRank */}
      <motion.div
        variants={itemVariants}
        className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-4">Note</h3>
        <p className="text-gray-400">
          {data?.message || "HackerRank's API has limitations. For complete statistics, please visit the profile directly."}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HackerRankActivity;