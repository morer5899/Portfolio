import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaSignOutAlt, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../config';

const AdminDashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
// projectData
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: { url: '' }, // Updated to match Cloudinary object structure
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(getApiUrl('/api/projects'));
      setProjects(response.data);
    } catch (error) {
      console.log('Backend not available, using empty projects array');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm({
      ...projectForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProjectForm({
      title: '',
      description: '',
      image: { url: '' },
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      featured: false
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Append all form fields to formData
    Object.entries(projectForm).forEach(([key, value]) => {
      if (key !== 'technologies' || value) {
        formData.append(key, value);
      }
    });
    
    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/projects/${editingProject._id}`,
        formData,
        config
      );
      
      setProjects(
        projects.map((project) =>
          project._id === editingProject._id ? response.data.project : project
        )
      );
      
      setIsAddingProject(false);
      setEditingProject(null);
      resetForm();
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Append all form fields to formData
    Object.entries(projectForm).forEach(([key, value]) => {
      // Skip the image field when it's an object (Cloudinary)
      if (key === 'image') return;
      if (key !== 'technologies' || value) {
        formData.append(key, value);
      }
    });
    
    // Append the image file if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (projectForm.image?.url && !imageFile) {
      // If there's an existing image URL but no new file, ensure it's included
      formData.append('existingImageUrl', projectForm.image.url);
    }
    
    // Convert technologies string to array
    if (projectForm.technologies) {
      formData.set('technologies', projectForm.technologies);
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      if (editingProject) {
        const response = await axios.put(
          `http://localhost:5000/api/projects/${editingProject._id}`,
          formData,
          config
        );
        setProjects(projects.map(p => p._id === editingProject._id ? response.data.project : p));
        setEditingProject(null);
      } else {
        const response = await axios.post(getApiUrl('/api/projects'), formData, config);
        setProjects([...projects, response.data.project]);
      }
      
      setIsAddingProject(false);
      resetForm();
      setImagePreview(null);
      setImageFile(null);
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(getApiUrl(`/api/projects/${projectId}`));
        fetchProjects();
      } catch (error) {
        console.log('Backend not available - simulating delete');
        setProjects(projects.filter(p => p._id !== projectId));
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image || { url: '' },
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured || false
    });
    // Set image preview if image exists
    if (project.image?.url) {
      setImagePreview(project.image.url);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    onLogout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header */}
      <div className="bg-dark-50/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                View Portfolio
              </button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Project Button */}
        <div className="mb-8">
          <motion.button
            onClick={() => setIsAddingProject(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <FaPlus />
            <span>Add New Project</span>
          </motion.button>
        </div>

        {/* Add/Edit Project Form */}
        {isAddingProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            // @ts-ignore - Framer Motion types issue
            as="div"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
                    placeholder="Project title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Project Image</label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-dark-200 hover:bg-dark-300 text-white px-4 py-2 rounded-md transition-colors">
                      Choose File
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-400">
                      {imageFile ? imageFile.name : 'No file chosen'}
                    </span>
                  </div>
                  {(imagePreview || projectForm.image?.url) && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <img 
                        src={imagePreview || projectForm.image.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%236366f1'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3E" + (projectForm.title || 'Project Image') + "%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300 resize-none"
                  placeholder="Project description"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
                  placeholder="React.js, Node.js, MongoDB"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={projectForm.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Live URL</label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={projectForm.liveUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={projectForm.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-500 bg-dark-100 border-gray-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="featured" className="text-white font-medium">
                  Featured Project
                </label>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaSave />
                  <span>{editingProject ? 'Update' : 'Save'} Project</span>
                </motion.button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-600 text-gray-400 rounded-lg hover:border-gray-500 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Projects ({projects.length})</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="text-gray-600 text-6xl mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No projects added yet</p>
              <p className="text-gray-500">Click "Add New Project" to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Project Image */}
                    {project.image?.url && (
                      <div className="w-full md:w-48 flex-shrink-0">
                        <img
                          src={project.image.url}
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%236366f1'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(project.title)}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        {project.featured && (
                          <span className="px-2 py-1 bg-accent-500/20 text-accent-300 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex space-x-4 text-sm">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 transition-colors duration-300"
                          >
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-400 hover:text-accent-300 transition-colors duration-300"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <motion.button
                        onClick={() => handleEdit(project)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors duration-300"
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(project._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
