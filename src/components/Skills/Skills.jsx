import React from 'react';
import { motion } from 'framer-motion';
import htmlImg from '../../assets/html.png';
import cssImg from '../../assets/css.jpg';
import jsImg from '../../assets/javascript.jpg';
import reactImg from '../../assets/reactjs.jpg';
import nodeImg from '../../assets/nodejs.jpg';
import expressImg from '../../assets/express.png';
import mongoImg from '../../assets/mongodb.png';
import restImg from '../../assets/rest.png';
// Using express as fallback for socket.io since socketio.png is missing
import socketImg from '../../assets/socket.png';

const Skills = () => {

  const skills = [
    { name: 'HTML', image: htmlImg },
    { name: 'CSS', image: cssImg },
    { name: 'JavaScript', image: jsImg },
    { name: 'React JS', image: reactImg },
    { name: 'Node JS', image: nodeImg },
    { name: 'Express JS', image: expressImg },
    { name: 'MongoDB', image: mongoImg },
    { name: 'REST API', image: restImg },
    { name: 'Socket.io', image: socketImg },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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
    <section id="skills" className="py-16 sm:py-12 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-10 lg:mb-12"
        >
            <motion.h2
                       variants={itemVariants}
                       className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4"
                     >
                       <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        Skills
                       </span>
                     </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4"
          >
            Technologies and tools I work with
          </motion.p>
        </motion.div>

        {/* Container for both slider and skills list */}
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          
          {/* 3D Skill Slider */}
          <div className="relative w-full max-w-2xl h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-visible mb-8 sm:mb-12">
            <div 
              className="skill-slider"
              style={{
                width: '200px',
                height: '200px',
                transformStyle: 'preserve-3d',
                animation: 'autoRun 20s linear infinite',
                zIndex: 100,
                transformOrigin: 'center center'
              }}
            >
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="skill-item absolute"
                  style={{
                    position: 'absolute',
                    inset: '0',
                    width: '200px',
                    height: '150px',
                    borderRadius: '15px',
                    '--position': index + 1,
                    '--quantity': skills.length,
                    transform: `rotateY(${(index + 1) * (360 / skills.length)}deg) translateZ(350px)`
                  }}
                >
                  <div className="w-full h-full bg-gray-900/70 backdrop-blur-lg border-2 border-primary-500/50 rounded-2xl overflow-hidden group hover:border-primary-400 transition-all duration-300 shadow-2xl hover:shadow-primary-500/30 flex flex-col [backface-visibility:hidden] [transform-style:preserve-3d]">
                    {/* Back side of the card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 backdrop-blur-xl rounded-2xl -z-10" />
                    <div className="w-full h-2/3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img
                          src={skill.image || "/placeholder.svg"}
                          alt={skill.name}
                          className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-110"
                          style={{
                            borderRadius: '8px',
                            objectFit: 'cover',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%236366f1'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='16' fill='white' text-anchor='middle' dy='.3em'%3E" + skill.name + "%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full h-1/3 bg-gray-900/95 flex items-center justify-center relative border-t border-primary-500/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <h3 className="text-white font-bold text-xs lg:text-sm tracking-wider group-hover:text-primary-200 transition-colors duration-300 relative z-10 text-center px-1">
                        {skill.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Content */}
          <div className="w-full flex flex-col items-center justify-center px-4">
            <div className="text-center mb-8 lg:mb-12">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-transparent bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text opacity-30 mb-4"
                style={{
                  WebkitTextStroke: '1px #6366f1',
                  textStroke: '1px #6366f1'
                }}
              >
                SKILLS
              </h1>
              <p className="text-lg lg:text-xl text-gray-400 max-w-md mx-auto">
                Technologies and tools I work with
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 lg:gap-8 max-w-md lg:max-w-lg mx-auto">
              {['Frontend', 'Backend', 'Database', 'Tools'].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-primary-500/40 rounded-xl p-4 lg:p-6 hover:border-primary-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <div className="relative group">
                    <h4 className="text-base lg:text-lg xl:text-xl font-bold mb-3 lg:mb-4 text-center relative z-10">
                      <span className="relative z-10 bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                        {category}
                        <motion.span 
                          className="absolute -inset-1 bg-gradient-to-r from-primary-500/40 to-accent-500/40 rounded-full blur -z-10"
                          initial={{ opacity: 0.7 }}
                          animate={{ 
                            opacity: [0.5, 0.8, 0.5],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: 'reverse'
                          }}
                        />
                      </span>
                    </h4>
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        top: '50%',
                        left: '50%',
                        width: '140%',
                        height: '140%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        top: '50%',
                        left: '50%',
                        width: '160%',
                        height: '160%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    {category === 'Frontend' && (
                      <>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">HTML</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">CSS</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">JavaScript</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">React JS</p>
                      </>
                    )}
                    {category === 'Backend' && (
                      <>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Node JS</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Express JS</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">REST API</p>
                      </>
                    )}
                    {category === 'Database' && (
                      <>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">MongoDB</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Postgresql</p>
                      </>
                    )}
                    {category === 'Tools' && (
                      <>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Git</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">VS Code</p>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Postman</p>
                      </>
                    )}
                    {category === 'Frontend' && (
                      <>
                        <p className="text-gray-200 text-sm lg:text-base text-center hover:text-primary-200 transition-colors duration-200 font-medium">Socket.io</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes autoRun {
          0% {
            transform: translate(-50%, -50%) perspective(1000px) rotateX(-16deg) rotateY(0deg);
          }
          100% {
            transform: translate(-50%, -50%) perspective(1000px) rotateX(-16deg) rotateY(360deg);
          }
        }
        
        .skill-slider {
          transform-style: preserve-3d;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-origin: center center;
        }
        
        .skill-item {
          position: absolute;
        }
        
        @media (min-width: 768px) {
          .skill-slider {
            width: 200px !important;
            height: 200px !important;
          }
          .skill-item {
            width: 180px !important;
            height: 135px !important;
            transform: rotateY(calc(var(--position) * (360 / var(--quantity)) * 1deg)) translateZ(300px) !important;
          }
        }
        
        @media (max-width: 640px) {
          .skill-slider {
            width: 160px !important;
            height: 160px !important;
          }
          .skill-item {
            width: 140px !important;
            height: 105px !important;
            transform: rotateY(calc(var(--position) * (360 / var(--quantity)) * 1deg)) translateZ(190px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .skill-slider {
            width: 140px !important;
            height: 140px !important;
          }
          .skill-item {
            width: 120px !important;
            height: 90px !important;
            transform: rotateY(calc(var(--position) * (360 / var(--quantity)) * 1deg)) translateZ(170px) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;
