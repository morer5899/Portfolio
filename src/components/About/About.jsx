import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaMobile, FaServer } from 'react-icons/fa';

const About = () => {
  const services = [
    {
      icon: FaCode,
      title: 'Frontend Development',
      description: 'Creating responsive and interactive user interfaces with React.js and modern CSS frameworks.'
    },
    {
      icon: FaServer,
      title: 'Backend Development',
      description: 'Building robust server-side applications with Node.js, Express.js, and database integration.'
    },
    {
      icon: FaMobile,
      title: 'Responsive Design',
      description: 'Ensuring seamless user experience across all devices and screen sizes.'
    },
    {
      icon: FaLaptopCode,
      title: 'Full Stack Solutions',
      description: 'End-to-end web application development from concept to deployment.'
    }
  ];

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
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            About <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Me</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Passionate full-stack developer with expertise in modern web technologies
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Hi, I'm Suhas
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
              I'm a passionate full-stack developer specializing in React.js, Node.js, MongoDB, PostgreSQL, and Socket.io. With strong Java and DSA fundamentals, I build efficient, real-time web applications through clean code and optimized solutions.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                My journey in web development started with curiosity and has evolved into a passion for 
                building applications that make a difference. I believe in continuous learning and staying 
                updated with the latest industry trends and best practices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-50/50 backdrop-blur-sm rounded-lg p-4 border border-primary-500/20">
                <h4 className="text-primary-500 font-semibold mb-2">Experience</h4>
                <p className="text-white text-2xl font-bold">Fresher</p>
              </div>
              <div className="bg-dark-50/50 backdrop-blur-sm rounded-lg p-4 border border-accent-500/20">
                <h4 className="text-accent-500 font-semibold mb-2">Projects</h4>
                <p className="text-white text-2xl font-bold">10+</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Services */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="text-white text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2">
                      {service.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
