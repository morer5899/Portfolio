import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSignOutAlt,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaClock,
  FaCheck,
  FaReply,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config";
import { useAdmin } from "../../context/AdminContext";

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' or 'messages'
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: { url: "" },
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [messageFilter, setMessageFilter] = useState("all"); // 'all', 'new', 'read', 'replied'
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(getApiUrl("/api/projects"));
      setProjects(response.data);
    } catch (error) {
      console.log("Backend not available, using empty projects array");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(getApiUrl("/api/contact"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setMessages(response.data.data.contacts || []);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectForm({
      ...projectForm,
      [name]: type === "checkbox" ? checked : value,
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
      title: "",
      description: "",
      image: { url: "" },
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
    });
    setImagePreview(null);
    setImageFile(null);
    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(projectForm).forEach(([key, value]) => {
      if (key === "image") return;
      if (key !== "technologies" || value) {
        formData.append(key, value);
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (projectForm.image?.url && !imageFile) {
      formData.append("existingImageUrl", projectForm.image.url);
    }

    if (projectForm.technologies) {
      formData.set("technologies", projectForm.technologies);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingProject) {
        const response = await axios.put(
          getApiUrl(`/api/projects/${editingProject}`),
          formData,
          config
        );
        setProjects(
          projects.map((p) =>
            p._id === editingProject ? response.data.project : p
          )
        );
      } else {
        const response = await axios.post(
          getApiUrl("/api/projects"),
          formData,
          config
        );
        setProjects([...projects, response.data.project]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(getApiUrl(`/api/projects/${projectId}`));
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (error) {
        console.log("Backend not available - simulating delete");
        setProjects(projects.filter((p) => p._id !== projectId));
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image || { url: "" },
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
    });
    if (project.image?.url) {
      setImagePreview(project.image.url);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setIsAddingProject(true);
  };

  const handleUpdateMessageStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        getApiUrl(`/api/contact/${messageId}/status`),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages(
          messages.map((msg) =>
            msg._id === messageId ? { ...msg, status: newStatus } : msg
          )
        );
        if (selectedMessage?._id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      alert("Failed to update message status");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(getApiUrl(`/api/contact/${messageId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(messages.filter((msg) => msg._id !== messageId));
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: "bg-blue-500/20 text-blue-400", icon: FaEye },
      read: { color: "bg-green-500/20 text-green-400", icon: FaCheck },
      replied: { color: "bg-purple-500/20 text-purple-400", icon: FaReply },
    };
    const config = statusConfig[status] || statusConfig.new;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredMessages = messages.filter((msg) => {
    if (messageFilter === "all") return true;
    return msg.status === messageFilter;
  });

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
                onClick={() => navigate("/")}
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

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-4 border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 font-medium transition-colors duration-300 relative ${
              activeTab === "projects"
                ? "text-primary-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
            {activeTab === "projects" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 font-medium transition-colors duration-300 relative flex items-center gap-2 ${
              activeTab === "messages"
                ? "text-primary-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FaEnvelope />
            Contact Messages
            {messages.filter(m => m.status === 'new').length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {messages.filter(m => m.status === 'new').length}
              </span>
            )}
            {activeTab === "messages" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
              />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Projects Tab */}
        {activeTab === "projects" && (
          <>
            {/* Add Project Button */}
            {!isAddingProject && (
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
            )}

            {/* Add/Edit Project Form */}
            {isAddingProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingProject ? "Edit Project" : "Add New Project"}
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
                      <label className="block text-white font-medium mb-2">
                        Title
                      </label>
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
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Project Image
                      </label>
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
                          {imageFile ? imageFile.name : "No file chosen"}
                        </span>
                      </div>
                      {(imagePreview || projectForm.image?.url) && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-2">Preview:</p>
                          <img
                            src={imagePreview || projectForm.image.url}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Description
                    </label>
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
                    <label className="block text-white font-medium mb-2">
                      Technologies (comma-separated)
                    </label>
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
                      <label className="block text-white font-medium mb-2">
                        GitHub URL
                      </label>
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
                      <label className="block text-white font-medium mb-2">
                        Live URL
                      </label>
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
                      <span>{editingProject ? "Update" : "Save"} Project</span>
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
              <h2 className="text-2xl font-bold text-white">
                Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FaImage className="text-gray-600 text-6xl mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No projects added yet</p>
                  <p className="text-gray-500">
                    Click "Add New Project" to get started
                  </p>
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
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {project.title}
                            </h3>
                            {project.featured && (
                              <span className="px-2 py-1 bg-accent-500/20 text-accent-300 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 mb-4">
                            {project.description}
                          </p>

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
          </>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-3">Messages</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "new", "read", "replied"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMessageFilter(filter)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                        messageFilter === filter
                          ? "bg-primary-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      {filter !== "all" && (
                        <span className="ml-1">
                          ({messages.filter(m => m.status === filter).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-700/50 max-h-[600px] overflow-y-auto">
                {messagesLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 cursor-pointer hover:bg-gray-700/30 transition-colors duration-300 ${
                        selectedMessage?._id === message._id
                          ? "bg-primary-500/10 border-l-2 border-primary-500"
                          : ""
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" size={14} />
                          <span className="text-white font-medium">
                            {message.name}
                          </span>
                        </div>
                        {getStatusBadge(message.status)}
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {message.subject}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaClock className="mr-1" size={12} />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Message Details
                    </h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) =>
                          handleUpdateMessageStatus(
                            selectedMessage._id,
                            e.target.value
                          )
                        }
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <motion.button
                        onClick={() => handleDeleteMessage(selectedMessage._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Name
                        </label>
                        <p className="text-white font-medium">
                          {selectedMessage.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Email
                        </label>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Subject
                      </label>
                      <p className="text-white">{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Message
                      </label>
                      <p className="text-white whitespace-pre-wrap bg-gray-700/30 p-4 rounded-lg">
                        {selectedMessage.message}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Received
                      </label>
                      <p className="text-gray-300">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {selectedMessage.status === "new" && (
                      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-400 text-sm">
                          This message is marked as new. Consider marking it as read after reviewing.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
                  <FaEnvelope className="text-gray-600 text-6xl mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Select a message to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;