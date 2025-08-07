import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove the '#' from href
    const element = document.getElementById(targetId);
    
    if (element) {
      setIsOpen(false);
      
      requestAnimationFrame(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled || isOpen ? 'bg-dark-100/95 shadow-lg border-b border-gray-800/50' : 'bg-dark-100/80'
      } ${!isOpen ? 'backdrop-blur-sm' : ''}`}
      style={{
        backdropFilter: isOpen ? 'none' : undefined
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 z-10"
          >
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Portfolio
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={(e) => scrollToSection(e, item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2 rounded-md bg-dark-200/50 backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          display: isOpen ? 'block' : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-dark-100 border-t border-gray-800/50 fixed top-16 left-0 right-0 z-[9998] shadow-2xl"
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={(e) => scrollToSection(e, item.href)}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -20
              }}
              transition={{ duration: 0.3, delay: isOpen ? index * 0.1 : 0 }}
              className="text-gray-300 hover:text-white hover:bg-primary-500/20 block w-full px-6 py-4 rounded-lg text-base font-medium text-left transition-all duration-200 border border-transparent hover:border-primary-500/30 active:bg-primary-500/30 active:scale-95"
              aria-label={`Go to ${item.name} section`}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          display: isOpen ? 'block' : 'none'
        }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(false)}
        className="md:hidden fixed inset-0 bg-black/40 z-30"
      />
    </motion.nav>
  );
};

export default Navbar;
