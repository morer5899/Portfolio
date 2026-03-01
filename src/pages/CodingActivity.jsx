import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaExternalLinkAlt 
} from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { FaHackerrank } from 'react-icons/fa';
import LeetCodeActivity from '../components/coding/LeetCode';
import GFGActivity from "../components/coding/GFG";
import HackerRankActivity from '../components/coding/HackerRank';

// Memoized platform card component
const PlatformCard = memo(({ platform, isActive, onClick }) => {
  const Icon = platform.icon;
  
  return (
    <button
      onClick={onClick}
      className={`relative group px-6 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? `${platform.bgColor} border-2 border-${platform.textColor.replace('text-', '')}`
          : 'bg-dark-50/50 border border-gray-700/50 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`text-xl ${isActive ? platform.textColor : 'text-gray-400'}`} />
        <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
          {platform.name}
        </span>
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activePlatform"
          className={`absolute inset-0 rounded-xl border-2 ${platform.textColor.replace('text', 'border')} opacity-50`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
});

// Memoized stats card component
const StatsCard = memo(({ platform }) => {
  const Icon = platform.icon;
  
  return (
    <a
      href={`https://${platform.id}.com/${platform.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${platform.bgColor}`}>
          <Icon className={`text-2xl ${platform.textColor}`} />
        </div>
        <FaExternalLinkAlt className="text-gray-500 group-hover:text-primary-500 transition-colors" size={16} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{platform.name}</h3>
      <p className="text-sm text-gray-400 mb-2">@{platform.username}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${platform.bgColor} ${platform.textColor}`}>
          Active
        </span>
        <span className="text-xs text-gray-500">Click to visit</span>
      </div>
    </a>
  );
});

// Custom hook for platform data
const usePlatforms = () => {
  return useMemo(() => [
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: SiLeetcode,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-500',
      username: 'suhas_sonwane1234',
      component: LeetCodeActivity
    },
    {
      id: 'gfg',
      name: 'GeeksforGeeks',
      icon: SiGeeksforgeeks,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500',
      username: 'suhassoe8md',
      component: GFGActivity
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: FaHackerrank,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500',
      username: 'suhassonwane8',
      component: HackerRankActivity
    }
  ], []);
};

// Custom hook for animations
const useAnimations = () => {
  return useMemo(() => ({
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.1
        }
      }
    },
    itemVariants: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1
      }
    }
  }), []);
};

// Memoized background component
const BackgroundElements = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
  </div>
));

// Memoized header component
const Header = memo(() => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
      Coding <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Activity</span>
    </h1>
    <p className="text-xl text-gray-400">Track my progress across coding platforms</p>
  </div>
));

// Main component
const CodingActivity = () => {
  const [activePlatform, setActivePlatform] = useState('leetcode');
  const platforms = usePlatforms();
  const animations = useAnimations();

  // Memoized callback for platform change
  const handlePlatformChange = useCallback((platformId) => {
    setActivePlatform(platformId);
  }, []);

  // Memoized active component
  const ActiveComponent = useMemo(() => 
    platforms.find(p => p.id === activePlatform)?.component,
    [activePlatform, platforms]
  );

  // Memoized username for active platform
  const activeUsername = useMemo(() => 
    platforms.find(p => p.id === activePlatform)?.username,
    [activePlatform, platforms]
  );

  // Memoized platform navigation buttons
  const platformButtons = useMemo(() => 
    platforms.map((platform) => (
      <PlatformCard
        key={platform.id}
        platform={platform}
        isActive={activePlatform === platform.id}
        onClick={() => handlePlatformChange(platform.id)}
      />
    )),
    [platforms, activePlatform, handlePlatformChange]
  );

  // Memoized stats cards
  const statsCards = useMemo(() => 
    platforms.map((platform) => (
      <StatsCard key={platform.id} platform={platform} />
    )),
    [platforms]
  );

  return (
    <section className="py-20 relative overflow-hidden min-h-screen">
      <BackgroundElements />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={animations.containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={animations.itemVariants}>
            <Header />
          </motion.div>

          {/* Platform Navigation */}
          <motion.div 
            variants={animations.itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {platformButtons}
          </motion.div>

          {/* Platform Stats Overview */}
          <motion.div 
            variants={animations.itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsCards}
          </motion.div>

          {/* Active Platform Component */}
          <motion.div
            key={activePlatform}
            variants={animations.itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {ActiveComponent && <ActiveComponent username={activeUsername} />}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Memoize the entire component
export default memo(CodingActivity);