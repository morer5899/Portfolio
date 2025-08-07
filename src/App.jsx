import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

// Global styles
const globalStyles = `
  /* Global styles can be added here */
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin from localStorage
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <style>{globalStyles}</style>
      <Router>
        <div className="App bg-dark-900 text-gray-100 min-h-screen flex flex-col">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/admin/login" element={
                <AdminLogin onLogin={handleAdminLogin} />
              } />
              <Route path="/admin/dashboard" element={
                isAdmin ? (
                  <AdminDashboard onLogout={handleAdminLogout} />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } />
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Navbar />
                  <Hero />
                  <About />
                  <Skills />
                  <Projects />
                  <Contact />
                  <Footer />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </>
  );
}

export default App;
