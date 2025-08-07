import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaDownload } from 'react-icons/fa';
import resume from '../../assets/Suhas_Sonwane_Resume .pdf'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="home" className="min-h-screen pt-16 md:pt-0 flex items-center justify-center relative overflow-hidden lg:pb-20">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16 md:py-0 lg:pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto w-48 h-48 md:w-64 md:h-64 lg:mb-8"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-1 animate-glow">
              <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-6xl md:text-8xl font-bold text-white">
                  S
                </div>
              </div>
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Suhas
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light">
              Full Stack Developer
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed "
          >
            MERN stack developer building scalable web applications with React Node.js and MongoDB. Skilled in real-time systems using Socket.io and PostgreSQL databases. Strong Java and Data Structures expertise for high-performance solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </motion.button>
            <motion.a
              href={resume}
              download="Suhas_Sonwane_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <FaDownload />
              Download CV
            </motion.a>
          </motion.div>

          {/* Social Links - Vertical Right */}
          <motion.div
            variants={itemVariants}
            className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col items-center space-y-6"
          >
            {[
              { icon: FaGithub, href: "https://github.com/morer5899", label: "GitHub" },
              { icon: FaLinkedin, href: "https://www.linkedin.com/in/suhas-sonwane-ab927a378/", label: "LinkedIn" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-primary-500 transition-all duration-300 cursor-pointer"
                aria-label={social.label}
              >
                <social.icon size={20} className="pointer-events-none" />
              </motion.a>
            ))}
            <div className="w-px h-16 bg-gray-600 mx-auto mt-2"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-9 left-1/2 transform -translate-x-1/2 lg:bottom-3"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-500 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
