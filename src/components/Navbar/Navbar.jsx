import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaGithub, FaCode, FaAward, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

// Memoized nav item component for better performance
const NavItem = React.memo(({ item, isActive, onClick }) => (
  <motion.button
    onClick={() => onClick(item.path)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative group px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      isActive ? 'text-primary-500' : 'text-gray-300 hover:text-white'
    }`}
  >
    <span className="flex items-center space-x-1">
      {item.icon && <item.icon size={12} className="lg:w-3.5 lg:h-3.5" />}
      <span>{item.name}</span>
    </span>
    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`}></span>
  </motion.button>
));

// Memoized mobile nav item component
const MobileNavItem = React.memo(({ item, isActive, onClick, isOpen, index }) => (
  <motion.button
    onClick={() => onClick(item.path)}
    initial={{ opacity: 0, x: -20 }}
    animate={{
      opacity: isOpen ? 1 : 0,
      x: isOpen ? 0 : -20
    }}
    transition={{ duration: 0.2, delay: isOpen ? index * 0.05 : 0 }}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30' 
        : 'text-gray-300 hover:text-white hover:bg-primary-500/10 border border-transparent hover:border-primary-500/30'
    }`}
  >
    {item.icon && <item.icon size={16} className="flex-shrink-0" />}
    <span className="flex-1 text-left">{item.name}</span>
    {isActive && (
      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
    )}
  </motion.button>
));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for performance
  const scrollTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Memoized nav items to prevent recreation
  const navItems = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'GitHub', path: '/github', icon: FaGithub },
    { name: 'Coding', path: '/coding-activity', icon: SiLeetcode },
    { name: 'Contact', path: '/contact' }
  ], []);

  // Optimized scroll handler with RAF and debounce
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    });
  }, []);

  // Optimized resize handler with debounce
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    }, 100);
  }, [isOpen]);

  // Optimized navigation handler
  const handleNavigation = useCallback((path) => {
    setIsOpen(false);
    navigate(path);
  }, [navigate]);

  // Optimized admin navigation handler
  const handleAdminNavigation = useCallback(() => {
    setIsOpen(false);
    navigate('/admin/login');
  }, [navigate]);

  // Optimized dashboard navigation handler
  const handleDashboardNavigation = useCallback(() => {
    setIsOpen(false);
    navigate('/admin/dashboard');
  }, [navigate]);

  // Optimized logout handler
  const handleLogout = useCallback(() => {
    setIsOpen(false);
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Optimized mobile menu toggle
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Optimized overlay click handler
  const handleOverlayClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Scroll effect with proper cleanup
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Resize effect with proper cleanup
  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  // Body scroll lock effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Memoized animation variants
  const navVariants = useMemo(() => ({
    initial: { y: -100 },
    animate: { y: 0 },
    transition: { duration: 0.5 }
  }), []);

  // Memoized mobile menu variants
  const mobileMenuVariants = useMemo(() => ({
    hidden: { height: 0, opacity: 0, pointerEvents: 'none', display: 'none' },
    visible: { height: 'auto', opacity: 1, pointerEvents: 'auto', display: 'block' }
  }), []);

  // Memoized overlay variants
  const overlayVariants = useMemo(() => ({
    hidden: { opacity: 0, pointerEvents: 'none', display: 'none' },
    visible: { opacity: 1, pointerEvents: 'auto', display: 'block' }
  }), []);

  // Memoized navbar classes
  const navbarClasses = useMemo(() => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300';
    let bgClasses = scrolled || isOpen ? 'bg-dark-100/95 shadow-lg border-b border-gray-800/50' : 'bg-dark-100/80';
    const blurClass = !isOpen ? 'backdrop-blur-sm' : '';
    
    return `${baseClasses} ${bgClasses} ${blurClass}`;
  }, [scrolled, isOpen]);

  return (
    <motion.nav
      {...navVariants}
      className={navbarClasses}
      style={{
        backdropFilter: isOpen ? 'none' : undefined
      }}
    >
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 z-10 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent whitespace-nowrap">
              Suhas.dev
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={isActive}
                    onClick={handleNavigation}
                  />
                );
              })}
              
              {/* Admin Section - Conditional Rendering */}
              {isAdmin ? (
                <>
                  <motion.button
                    onClick={handleDashboardNavigation}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
                    className="ml-2 lg:ml-4 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg text-xs lg:text-sm font-medium hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                  >
                    Dashboard
                  </motion.button>
                  
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (navItems.length + 1) * 0.1 }}
                    className="ml-2 lg:ml-4 px-3 lg:px-4 py-1.5 lg:py-2 bg-red-500/20 text-red-400 rounded-lg text-xs lg:text-sm font-medium hover:bg-red-500/30 transition-all duration-300 whitespace-nowrap flex items-center gap-1 border border-red-500/30 hover:border-red-500/50"
                  >
                    <FaSignOutAlt size={12} className="lg:w-3.5 lg:h-3.5" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleAdminNavigation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: navItems.length * 0.1 }}
                  className="ml-2 lg:ml-4 px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs lg:text-sm font-medium hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center gap-1"
                >
                  <FaUserShield size={12} className="lg:w-3.5 lg:h-3.5" />
                  <span>Admin Login</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white focus:outline-none rounded-lg bg-dark-200/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={mobileMenuVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-dark-100 border-t border-gray-800/50 fixed left-0 right-0 z-[9998] shadow-2xl"
        style={{ top: '3.5rem' }}
      >
        <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <MobileNavItem
                key={item.name}
                item={item}
                isActive={isActive}
                onClick={handleNavigation}
                isOpen={isOpen}
                index={index}
              />
            );
          })}
          
          {/* Admin Section for Mobile - Conditional Rendering */}
          {isAdmin ? (
            <>
              <motion.button
                onClick={handleDashboardNavigation}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : -20
                }}
                transition={{ duration: 0.2, delay: isOpen ? navItems.length * 0.05 : 0 }}
                className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                Admin Dashboard
              </motion.button>
              
              <motion.button
                onClick={handleLogout}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : -20
                }}
                transition={{ duration: 0.2, delay: isOpen ? (navItems.length + 1) * 0.05 : 0 }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
              >
                <FaSignOutAlt size={16} className="flex-shrink-0" />
                <span className="flex-1 text-left">Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={handleAdminNavigation}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -20
              }}
              transition={{ duration: 0.2, delay: isOpen ? navItems.length * 0.05 : 0 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
            >
              <FaUserShield size={16} className="flex-shrink-0" />
              <span className="flex-1 text-left">Admin Login</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={overlayVariants}
        transition={{ duration: 0.3 }}
        onClick={handleOverlayClick}
        className="md:hidden fixed inset-0 bg-black/60 z-30"
        style={{ top: '3.5rem' }}
      />
    </motion.nav>
  );
};

export default React.memo(Navbar);