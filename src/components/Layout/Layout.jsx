import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen"
    >
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Layout;