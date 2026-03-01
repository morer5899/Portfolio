import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaCalendar,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from '../config';

// Memoized Project Card Component
const ProjectCard = React.memo(({ project, index, onClick }) => {
  const imageUrl = useMemo(() => 
    project.image?.url || `https://placehold.co/600x400/1a1a2e/ffffff?text=${encodeURIComponent(project.title || 'Project')}`,
    [project.image?.url, project.title]
  );

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
      <div className="relative bg-dark-50/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={project.title || 'Project'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Project Info - Preview */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">
            {project.title || 'Untitled Project'}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description || 'No description available'}
          </p>

          {/* Technologies Preview */}
          <div className="flex flex-wrap gap-2">
            {(project.technologies || [])
              .slice(0, 3)
              .map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            {(project.technologies?.length || 0) > 3 && (
              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Click hint */}
          <div className="mt-4 text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to view details →
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Modal Component
const ProjectModal = React.memo(({ project, isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Format date memoized
  const formattedDate = useMemo(() => 
    project?.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
    [project?.createdAt]
  );

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-dark-200 to-dark-100 rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-700">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-dark-100/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all duration-300"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 pr-10">
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {project.title}
                </span>
              </h2>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                {formattedDate && (
                  <span className="flex items-center gap-2">
                    <FaCalendar className="text-primary-500" />
                    {formattedDate}
                  </span>
                )}
                {project.duration && (
                  <span className="flex items-center gap-2">
                    <FaClock className="text-primary-500" />
                    {project.duration}
                  </span>
                )}
                {project.team && (
                  <span className="flex items-center gap-2">
                    <FaUser className="text-primary-500" />
                    {project.team}
                  </span>
                )}
              </div>

              {/* Full Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium border border-primary-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <FaGithub size={20} />
                    <span>View Source Code</span>
                  </motion.a>
                )}
                {project.liveUrl && project.liveUrl !== project.githubUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300"
                  >
                    <FaExternalLinkAlt size={18} />
                    <span>Live Demo</span>
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

// Main Component
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use refs for values that shouldn't trigger re-renders
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);

  // Memoized variants to prevent recreation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }), []);

  // Memoized placeholder image function
  const getPlaceholderImage = useCallback((title) => {
    return `https://placehold.co/600x400/1a1a2e/ffffff?text=${encodeURIComponent(title || 'Project')}`;
  }, []);

  // Optimized modal handlers with useCallback
  const openModal = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Optimized fetch function
  const loadProjects = useCallback(async () => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      
      const apiUrl = getApiUrl('/api/projects');
      console.log('📡 Fetching from:', apiUrl);
      
      const response = await axios.get(`${apiUrl}?_=${Date.now()}`);
      
      if (mountedRef.current) {
        const projectsData = Array.isArray(response.data) ? response.data : [];
        setProjects(projectsData);
        setError(null);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error('❌ Error:', error);
        setError('Failed to load projects. Please try again.');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, []);

  // Fetch once on component mount
  useEffect(() => {
    mountedRef.current = true;
    loadProjects();

    return () => {
      mountedRef.current = false;
    };
  }, [loadProjects]);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [closeModal]);

  // Memoized project count for debugging
  const projectCount = useMemo(() => projects.length, [projects]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="loader-3d mb-4">
            <div className="loader-cube">
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
              <div className="cube-face"></div>
            </div>
          </div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={loadProjects}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              My{" "}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Click on any project card to view complete details
            </p>
            
            {/* Debug Info - Only in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-dark-50/50 p-2 rounded-lg mb-4 text-left text-xs">
                <p className="text-gray-400">Projects loaded: {projectCount}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl mb-4">
                No projects available at the moment.
              </p>
              <button
                onClick={loadProjects}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Refresh
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id || index}
                  project={project}
                  index={index}
                  onClick={() => openModal(project)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </AnimatePresence>

      {/* Project Request Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl p-12 border border-gray-700/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Have a Project in Mind?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              I'm always open to discussing new projects and opportunities
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
              >
                Let's Work Together
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Add required styles for line-clamp */}
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Projects);