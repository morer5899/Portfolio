import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Layout from './components/Layout/Layout';
import Loader from './components/Loader/Loader';
import ChatBot from './components/ChatBot/ChatBot';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const GitHubActivity = lazy(() => import('./pages/GitHubActivity'));
const CodingActivity = lazy(() => import('./pages/CodingActivity'));

const AdminLogin = lazy(() => import('./components/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));

// Protected Route Component

const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdmin();
  
  if (isLoading) {
    return <Loader />; 
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

const globalStyles = `
  /* Global styles can be added here */
  .chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
`;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <style>{globalStyles}</style>
      <AdminProvider>
        <Router>
          <div className="App bg-dark-900 text-gray-100 min-h-screen flex flex-col">
            <AnimatePresence mode="wait">
              <Suspense fallback={<Loader />}>
                <Routes>
                  {/* Admin login route - PUBLIC */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Admin dashboard route - PROTECTED */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Main routes - INSIDE Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="skills" element={<Skills />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="github" element={<GitHubActivity />} />
                    <Route path="coding-activity" element={<CodingActivity />} />
                  </Route>
                </Routes>
              </Suspense>
            </AnimatePresence>
            
            <ChatBot />
          </div>
        </Router>
      </AdminProvider>
    </>
  );
}

export default App;