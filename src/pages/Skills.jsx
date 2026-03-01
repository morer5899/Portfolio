import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, 
  FaJava, FaGitAlt, FaCode
} from 'react-icons/fa';
import { 
  SiMongodb, SiExpress, SiPostgresql, SiMysql, 
  SiTypescript, SiTailwindcss, SiSocketdotio,
  SiRedis
} from 'react-icons/si';

// Memoized Category Button Component
const CategoryButton = React.memo(({ category, selectedCategory, onClick }) => (
  <motion.button
    onClick={() => onClick(category.id)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
      selectedCategory === category.id
        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
        : 'bg-dark-50/50 text-gray-400 hover:text-white border border-gray-700 hover:border-primary-500'
    }`}
  >
    {category.name}
  </motion.button>
));

// Memoized Skill Card Component
const SkillCard = React.memo(({ skill, index, categoryName }) => {
  const getLevelColor = useCallback((level) => {
    if (level >= 85) return 'text-green-500';
    if (level >= 70) return 'text-blue-500';
    if (level >= 55) return 'text-yellow-500';
    return 'text-orange-500';
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
      <div className="relative bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
            <skill.icon className="text-white text-2xl" />
          </div>
          <span className={`text-sm font-semibold ${getLevelColor(skill.level)}`}>
            {skill.level}%
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Experience: {skill.experience}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${skill.color} bg-opacity-20 text-white`}>
            {categoryName}
          </span>
          {skill.experience === 'Learning' && (
            <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
              Learning
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Category Distribution Component
const CategoryDistribution = React.memo(({ category, index, skillsData }) => {
  const categorySkills = useMemo(() => 
    skillsData.filter(s => s.category === category.id),
    [skillsData, category.id]
  );
  
  const avgLevel = useMemo(() => 
    Math.round(categorySkills.reduce((acc, s) => acc + s.level, 0) / categorySkills.length),
    [categorySkills]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">{category.name}</span>
        <span className="text-primary-500">{avgLevel}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${avgLevel}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
        />
      </div>
      <div className="flex gap-2 mt-1 text-xs text-gray-400">
        <span>{categorySkills.length} skills</span>
      </div>
    </motion.div>
  );
});

// Memoized Learning Section Component
const LearningSection = React.memo(({ section, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300 h-full">
      <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
        {section.title}
      </h3>
      <ul className="space-y-3">
        {section.skills.map((skill, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-400">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.color}`}></span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
));

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized categories to prevent recreation
  const categories = useMemo(() => [
    { id: 'all', name: 'All Skills', color: 'from-gray-500 to-gray-700' },
    { id: 'languages', name: 'Languages', color: 'from-indigo-500 to-blue-500' },
    { id: 'frontend', name: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { id: 'backend', name: 'Backend', color: 'from-green-500 to-emerald-500' },
    { id: 'database', name: 'Database', color: 'from-yellow-500 to-orange-500' },
    { id: 'tools', name: 'Tools', color: 'from-red-500 to-rose-500' }
  ], []);

  // Memoized skills data
  const skillsData = useMemo(() => [
    // Programming Languages
    { name: 'Java', icon: FaJava, level: 75, category: 'languages', color: 'from-red-500 to-orange-500', experience: 'Academic' },
    { name: 'JavaScript', icon: FaJs, level: 88, category: 'languages', color: 'from-yellow-500 to-amber-500', experience: 'Academic' },
    { name: 'TypeScript', icon: SiTypescript, level: 70, category: 'languages', color: 'from-blue-500 to-indigo-500', experience: 'Learning' },

    // Frontend Technologies
    { name: 'HTML5', icon: FaHtml5, level: 92, category: 'frontend', color: 'from-orange-500 to-red-500', experience: 'Academic' },
    { name: 'CSS3', icon: FaCss3Alt, level: 90, category: 'frontend', color: 'from-blue-500 to-indigo-500', experience: 'Academic' },
    { name: 'React.js', icon: FaReact, level: 88, category: 'frontend', color: 'from-cyan-500 to-blue-500', experience: 'Academic' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, level: 85, category: 'frontend', color: 'from-teal-400 to-cyan-500', experience: 'Academic' },
    { name: 'Socket.io', icon: SiSocketdotio, level: 75, category: 'frontend', color: 'from-gray-600 to-gray-800', experience: 'Academic' },

    // Backend Technologies
    { name: 'Node.js', icon: FaNodeJs, level: 85, category: 'backend', color: 'from-green-600 to-green-800', experience: 'Academic' },
    { name: 'Express.js', icon: SiExpress, level: 85, category: 'backend', color: 'from-gray-500 to-gray-700', experience: 'Academic' },

    // Databases
    { name: 'MongoDB', icon: SiMongodb, level: 82, category: 'database', color: 'from-green-500 to-green-700', experience: 'Academic' },
    { name: 'PostgreSQL', icon: SiPostgresql, level: 75, category: 'database', color: 'from-blue-500 to-indigo-600', experience: 'Academic' },
    { name: 'MySQL', icon: SiMysql, level: 70, category: 'database', color: 'from-blue-600 to-blue-800', experience: 'Academic' },
    { name: 'Redis', icon: SiRedis, level: 60, category: 'database', color: 'from-red-500 to-red-700', experience: 'Learning' },

    // Tools and Platforms
    { name: 'Git', icon: FaGitAlt, level: 88, category: 'tools', color: 'from-orange-500 to-red-500', experience: 'Academic' },
    { name: 'Postman', icon: FaCode, level: 85, category: 'tools', color: 'from-orange-500 to-red-500', experience: 'Academic' },
    { name: 'VS Code', icon: FaCode, level: 90, category: 'tools', color: 'from-blue-500 to-indigo-500', experience: 'Academic' },

    // AI-assisted Coding Tools
    { name: 'GitHub Copilot', icon: FaCode, level: 85, category: 'tools', color: 'from-purple-500 to-pink-500', experience: 'Learning' },
    { name: 'Cursor', icon: FaCode, level: 80, category: 'tools', color: 'from-green-500 to-emerald-500', experience: 'Learning' },
    { name: 'Windsurf', icon: FaCode, level: 75, category: 'tools', color: 'from-blue-400 to-cyan-500', experience: 'Learning' }
  ], []);

  // Memoized learning sections
  const learningSections = useMemo(() => [
    {
      title: 'Currently Learning',
      skills: ['TypeScript', 'Redis', 'Java', 'Next.js', 'System Design Basics'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Future Goals',
      skills: ['AWS Services', 'Docker', 'GraphQL', 'Microservices', 'Kubernetes'],
      color: 'from-green-500 to-emerald-500'
    }
  ], []);

  // Memoized filtered skills for better performance
  const filteredSkills = useMemo(() => {
    return skillsData.filter(skill => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skillsData, selectedCategory, searchTerm]);

  // Memoized category lookup function
  const getCategoryName = useCallback((categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  }, [categories]);

  // Memoized variants to prevent recreation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.05
      }
    }
  }), []);

  // Optimized handlers
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

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
              Technical{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Skills
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              A comprehensive overview of my technical expertise as a fresher
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-6 py-4 bg-dark-50/50 backdrop-blur-sm border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                selectedCategory={selectedCategory}
                onClick={handleCategoryChange}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredSkills.map((skill, index) => (
              <SkillCard
                key={`${skill.name}-${index}`}
                skill={skill}
                index={index}
                categoryName={getCategoryName(skill.category)}
              />
            ))}
          </motion.div>

          {filteredSkills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl">No skills found matching your criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Skill Distribution Chart */}
      <section className="py-20 bg-gradient-to-b from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Skill Distribution
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Breakdown of skills by category</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {categories.filter(c => c.id !== 'all').map((category, index) => (
              <CategoryDistribution
                key={category.id}
                category={category}
                index={index}
                skillsData={skillsData}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Current focus and future goals</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {learningSections.map((section, index) => (
              <LearningSection
                key={index}
                section={section}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Skills);