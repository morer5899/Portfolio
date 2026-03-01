import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, FaLaptopCode, FaServer, 
  FaBook, FaGraduationCap, FaBriefcase, 
  FaCoffee, FaHeart, FaRocket, FaBrain,
  FaUsers, FaClock, FaBolt, FaDatabase,
  FaJava, FaJs, FaHtml5, FaCss3Alt, FaGitAlt,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaExternalLinkAlt,
  FaRobot
} from 'react-icons/fa';
import { 
  SiMongodb, SiExpress, SiPostgresql, SiMysql, 
  SiTypescript, SiTailwindcss, SiSocketdotio,
  SiRedis, SiPostman
} from 'react-icons/si';
import { Link } from 'react-router-dom';

// Memoized section components for better performance
const SectionHeader = React.memo(({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    className="text-center mb-12"
  >
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <p className="text-gray-400 text-lg">{subtitle}</p>
  </motion.div>
));

const StatCard = React.memo(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300 text-center">
      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
        <stat.icon className="text-white text-xl" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
      <p className="text-xs text-gray-400">{stat.label}</p>
    </div>
  </motion.div>
));

const TimelineItem = React.memo(({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.1 }}
    className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8`}
  >
    <div className="md:w-1/2 pl-16 md:pl-0">
      <div className={`bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 ${
        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
      }`}>
        <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
            <item.icon className="text-white text-xl" />
          </div>
          <div>
            <span className="text-primary-500 font-semibold">{item.year}</span>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
          </div>
        </div>
        <p className="text-gray-400">{item.description}</p>
      </div>
    </div>
    
    <div className="absolute left-4 md:relative md:left-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 z-10 flex items-center justify-center text-white font-bold">
      {index + 1}
    </div>
    
    <div className="md:w-1/2"></div>
  </motion.div>
));

const EducationCard = React.memo(({ edu, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.05 }}
    className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${edu.color} flex items-center justify-center flex-shrink-0`}>
        <edu.icon className="text-white text-xl" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
            <p className="text-primary-500">{edu.field}</p>
          </div>
          <span className="text-gray-400">{edu.year}</span>
        </div>
        <p className="text-gray-300 mb-2">{edu.institution}</p>
        <p className="text-accent-500 font-semibold">{edu.grade}</p>
      </div>
    </div>
  </motion.div>
));

const ExperienceCard = React.memo(({ exp }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${exp.color} flex items-center justify-center flex-shrink-0`}>
        <exp.icon className="text-white text-2xl" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
        <p className="text-primary-500 text-lg">{exp.company}</p>
        <p className="text-gray-400">{exp.period}</p>
      </div>
    </div>
    <ul className="space-y-3">
      {exp.responsibilities.map((resp, idx) => (
        <li key={idx} className="flex items-start gap-2 text-gray-300">
          <span className="text-primary-500 mt-1.5">•</span>
          {resp}
        </li>
      ))}
    </ul>
  </motion.div>
));

const SkillItem = React.memo(({ skill }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="bg-dark-50/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${skill.color} flex items-center justify-center`}>
        <skill.icon className="text-white text-sm" />
      </div>
      <span className="text-white font-medium">{skill.name}</span>
    </div>
  </motion.div>
));

const AIToolItem = React.memo(({ tool }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="bg-dark-50/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
  >
    <div className="flex flex-col items-center text-center">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-2`}>
        <FaCode className="text-white text-sm" />
      </div>
      <span className="text-white font-medium text-sm">{tool.name}</span>
    </div>
  </motion.div>
));

const ProjectCard = React.memo(({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="h-full bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-3">{project.name}</h3>
      <p className="text-gray-400 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
          >
            {tech}
          </span>
        ))}
      </div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
      >
        <span>View Project</span>
        <FaExternalLinkAlt size={12} />
      </a>
    </div>
  </motion.div>
));

const ContactInfoItem = React.memo(({ item }) => (
  <div className="flex items-center gap-2 text-gray-400">
    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
      <item.icon className="text-white text-sm" />
    </div>
    <span>{item.text}</span>
  </div>
));

const SocialLink = React.memo(({ link }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-dark-50/50 backdrop-blur-sm rounded-full border border-gray-700 hover:border-primary-500 transition-all duration-300 text-gray-300 hover:text-white"
  >
    <span>{link.name}</span>
    <link.icon size={14} />
  </a>
));

const About = () => {
  // Memoized variants to prevent recreation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }), []);

  // Memoized static data
  const timeline = useMemo(() => [
    {
      year: '2024',
      title: 'Front-end Web Developer Intern',
      description: 'DevSkillHub - Developed React.js applications, collaborated with teams, implemented responsive designs',
      icon: FaBriefcase,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2023',
      title: 'Full Stack Projects',
      description: 'Built multiple MERN stack projects including authentication systems, media processing apps, and rating platforms',
      icon: FaRocket,
      color: 'from-purple-500 to-pink-500'
    },
    {
      year: '2022',
      title: 'Data Structures & Algorithms',
      description: 'Strengthened problem-solving skills with Java, solved DSA problems',
      icon: FaBrain,
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2021',
      title: 'Started Engineering',
      description: 'Began Bachelor of Engineering in Computer Engineering',
      icon: FaBook,
      color: 'from-orange-500 to-red-500'
    }
  ], []);

  const stats = useMemo(() => [
    { icon: FaCode, value: '10+', label: 'Projects Completed', color: 'from-blue-500 to-cyan-500' },
    { icon: FaClock, value: '1000+', label: 'Hours of Coding', color: 'from-green-500 to-emerald-500' },
    { icon: FaDatabase, value: '4+', label: 'Database Technologies', color: 'from-yellow-500 to-orange-500' },
    { icon: FaUsers, value: '3+', label: 'Team Projects', color: 'from-purple-500 to-pink-500' },
  ], []);

  const contactInfo = useMemo(() => [
    { icon: FaMapMarkerAlt, text: 'Pune, India', color: 'from-red-500 to-rose-500' },
    { icon: FaEnvelope, text: 'suhassonwane8@gmail.com', color: 'from-blue-500 to-indigo-500' },
    { icon: FaPhone, text: '9307781964', color: 'from-green-500 to-emerald-500' },
  ], []);

  const socialLinks = useMemo(() => [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/suhas-sonwane-ab927a378', icon: FaExternalLinkAlt },
    { name: 'GitHub', url: 'https://github.com/morer5899', icon: FaExternalLinkAlt },
    { name: 'Portfolio', url: '/', icon: FaExternalLinkAlt },
  ], []);

  const education = useMemo(() => [
    {
      degree: 'Bachelor of Engineering',
      field: 'Computer Engineering',
      institution: 'NBN Sinhgad School of Engineering, Pune',
      year: '2021 – 2025',
      grade: 'CGPA: 6.7',
      icon: FaGraduationCap,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      degree: '12th (HSC)',
      field: 'Science',
      institution: 'SOU. Malanbai Devidasrao Deshmukh JR. College, Sirsala',
      year: '2019 – 2020',
      grade: 'Percentage: 69.38%',
      icon: FaBook,
      color: 'from-green-500 to-emerald-500'
    },
    {
      degree: '10th (SSC)',
      field: 'General',
      institution: 'Yogeshwari Nutan Vidyalaya, Ambajogai',
      year: '2017 – 2018',
      grade: 'Percentage: 82.60%',
      icon: FaBook,
      color: 'from-orange-500 to-red-500'
    }
  ], []);

  const skills = useMemo(() => ({
    languages: [
      { name: 'Java', icon: FaJava, level: 85, color: 'from-red-500 to-orange-500' },
      { name: 'JavaScript', icon: FaJs, level: 88, color: 'from-yellow-500 to-amber-500' },
      { name: 'TypeScript', icon: SiTypescript, level: 70, color: 'from-blue-500 to-indigo-500' },
    ],
    frontend: [
      { name: 'HTML5', icon: FaHtml5, level: 92, color: 'from-orange-500 to-red-500' },
      { name: 'CSS3', icon: FaCss3Alt, level: 90, color: 'from-blue-500 to-indigo-500' },
      { name: 'React.js', icon: FaLaptopCode, level: 88, color: 'from-cyan-500 to-blue-500' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 85, color: 'from-teal-400 to-cyan-500' },
      { name: 'Socket.io', icon: SiSocketdotio, level: 75, color: 'from-gray-600 to-gray-800' },
    ],
    backend: [
      { name: 'Node.js', icon: FaServer, level: 85, color: 'from-green-600 to-green-800' },
      { name: 'Express.js', icon: SiExpress, level: 85, color: 'from-gray-500 to-gray-700' },
    ],
    database: [
      { name: 'MongoDB', icon: SiMongodb, level: 82, color: 'from-green-500 to-green-700' },
      { name: 'PostgreSQL', icon: SiPostgresql, level: 75, color: 'from-blue-500 to-indigo-600' },
      { name: 'MySQL', icon: SiMysql, level: 70, color: 'from-blue-600 to-blue-800' },
    ],
    tools: [
      { name: 'Git', icon: FaGitAlt, level: 88, color: 'from-orange-500 to-red-500' },
      { name: 'Postman', icon: SiPostman, level: 85, color: 'from-orange-500 to-red-500' },
      { name: 'Hugging Face APIs', icon: FaRobot, level: 70, color: 'from-yellow-500 to-amber-500' },
    ],
    aiTools: [
      { name: 'GitHub Copilot', level: 85, color: 'from-purple-500 to-pink-500' },
      { name: 'Cursor', level: 80, color: 'from-green-500 to-emerald-500' },
      { name: 'Windsurf', level: 75, color: 'from-blue-400 to-cyan-500' },
    ]
  }), []);

  const experience = useMemo(() => [
    {
      title: 'Front-end Web Developer Intern',
      company: 'DevSkillHub',
      period: 'Feb 2024 – Apr 2024',
      responsibilities: [
        'Developed and maintained dynamic web applications using ReactJS, ensuring responsive and user-friendly interfaces',
        'Collaborated with cross-functional teams to enhance application features and fix bugs in real-time',
        'Utilized Git for version control and code collaboration in a fast-paced development environment',
        'Gained hands-on experience with modern development workflows, tools, and best practices',
        'Demonstrated strong problem-solving skills and adaptability in meeting project deadlines'
      ],
      icon: FaBriefcase,
      color: 'from-blue-500 to-cyan-500'
    }
  ], []);

  const projects = useMemo(() => [
    {
      name: 'User Authentication and Authorization',
      description: 'Built a secure authentication system using the MERN stack with JWT authentication, role-based access control, and OTP-based password recovery',
      technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'bcrypt'],
      link: '#'
    },
    {
      name: 'VisionCrafter',
      description: 'Developed a media processing app with file compression, image enhancement, and background removal using React, Framer Motion, GSAP, Express.js, and MongoDB',
      technologies: ['React', 'Express.js', 'MongoDB', 'Framer Motion', 'GSAP'],
      link: '#'
    },
    {
      name: 'Mini Store Rating',
      description: 'Full-stack application with role-based access control, JWT authentication, complete rating system, admin dashboard with analytics, and advanced search functionality',
      technologies: ['Node.js', 'Express', 'React', 'MySQL', 'JWT', 'Tailwind CSS'],
      link: '#'
    },
    {
      name: 'Flight Booking',
      description: 'Flight Booking backend using Node.js and Express.js with SQL-based relational schemas, RESTful APIs for flight search, booking, cancellation, and role-based access control',
      technologies: ['Node.js', 'Express.js', 'MySQL'],
      link: '#'
    }
  ], []);

  return (
    <div className="min-h-screen bg-dark-100 pt-20">
      {/* Hero Section with Personal Info */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-4 text-center"
            >
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Suhas Sonwane
              </span>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-8">
              {contactInfo.map((item, index) => (
                <ContactInfoItem key={index} item={item} />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
              {socialLinks.map((link, index) => (
                <SocialLink key={index} link={link} />
              ))}
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-dark-50/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Summary</h2>
              <p className="text-gray-300 leading-relaxed">
                Passionate Full-Stack Developer with a solid foundation in Java, Data Structures & Algorithms (DSA),
                and the MERN stack (MongoDB, Express.js, React.js, Node.js). Proficient in building responsive and
                interactive web applications using JavaScript, React.js, and Node.js. Experienced in developing
                RESTful APIs, handling database operations with MongoDB and PostgreSQL, and applying OOP
                principles. Strong problem-solving skills, quick to learn new technologies, and committed to writing
                clean, efficient code.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader title="My Journey" subtitle="The path that shaped my career" />
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-500"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <TimelineItem key={index} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 bg-gradient-to-b from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <SectionHeader title="Education" subtitle="Academic background" />
          <div className="max-w-4xl mx-auto space-y-6">
            {education.map((edu, index) => (
              <EducationCard key={index} edu={edu} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader title="Experience" subtitle="Professional journey" />
          <div className="max-w-4xl mx-auto">
            {experience.map((exp, index) => (
              <ExperienceCard key={index} exp={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-20 bg-gradient-to-b from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <SectionHeader title="Technical Skills" subtitle="Technologies I work with" />

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Programming Languages */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Programming Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.languages.map((skill, index) => (
                  <SkillItem key={index} skill={skill} />
                ))}
              </div>
            </div>

            {/* Frontend */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend Technologies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.frontend.map((skill, index) => (
                  <SkillItem key={index} skill={skill} />
                ))}
              </div>
            </div>

            {/* Backend & Database */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Backend</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.backend.map((skill, index) => (
                    <SkillItem key={index} skill={skill} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Databases</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.database.map((skill, index) => (
                    <SkillItem key={index} skill={skill} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tools & AI Tools */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tools & Platforms</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.tools.map((skill, index) => (
                    <SkillItem key={index} skill={skill} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">AI-assisted Coding Tools</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.aiTools.map((tool, index) => (
                    <AIToolItem key={index} tool={tool} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader title="Key Projects" subtitle="Some of my recent work" />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mt-8"
          >
            <Link to="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
              >
                View All Projects
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl p-12 border border-gray-700/50"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Let's Work Together
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                >
                  View My Work
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-primary-500 text-primary-500 font-semibold rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300"
                >
                  Get In Touch
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(About);