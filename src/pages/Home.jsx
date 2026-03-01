import React, { useRef, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaDownload,
  FaCode,
  FaRocket,
  FaServer,
  FaShieldAlt,
  FaDatabase,
  FaCloud,
  FaBrain,
  FaChartLine,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaJava,
  FaPython,
  FaGitAlt,
  FaDocker,
} from "react-icons/fa";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiHackerrank,
  SiCodeforces,
  SiCodechef,
  SiMongodb,
  SiExpress,
  SiPostgresql,
  SiSocketdotio,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
} from "react-icons/si";
import resume from "../assets/SuhasResume.pdf";
import { Link } from "react-router-dom";


const AchievementCard = memo(({ achievement, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
    <div className="relative bg-dark-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300">
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center`}
      >
        <achievement.icon className="text-white text-2xl" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">
        {achievement.count}
      </h3>
      <p className="text-gray-400 text-sm">{achievement.label}</p>
    </div>
  </motion.div>
));

const PlatformCard = memo(({ platform, index }) => (
  <motion.a
    href={platform.link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, scale: 1.05 }}
    className="group"
  >
    <div className="bg-dark-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300 text-center w-[300px]">
      <platform.icon className={`text-4xl mx-auto mb-3 ${platform.color}`} />
      <h3 className="text-white font-semibold mb-1">{platform.name}</h3>
      <p className={`text-sm ${platform.color}`}>{platform.solved}</p>
    </div>
  </motion.a>
));

const QuickLink = memo(({ link }) => (
  <Link to={link.to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-dark-50/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
    >
      <span className="flex items-center gap-2 text-gray-300 hover:text-white">
        <link.icon className="text-primary-500" />
        {link.label}
      </span>
    </motion.div>
  </Link>
));

const Home = () => {
  const sliderRef = useRef(null);
  const rotationAngle = useRef(0);
  const rafId = useRef(null);

  // Memoized variants to prevent recreation
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.1,
        },
      },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
      },
    }),
    [],
  );

  // Memoized static data
  const skills3D = useMemo(
    () => [
      {
        name: "HTML5",
        icon: FaHtml5,
        color: "from-orange-500 to-red-500",
        level: 95,
      },
      {
        name: "CSS3",
        icon: FaCss3Alt,
        color: "from-blue-500 to-indigo-500",
        level: 92,
      },
      {
        name: "JavaScript",
        icon: FaJs,
        color: "from-yellow-500 to-amber-500",
        level: 90,
      },
      {
        name: "React",
        icon: FaReact,
        color: "from-cyan-500 to-blue-500",
        level: 90,
      },
      {
        name: "Node.js",
        icon: FaNodeJs,
        color: "from-green-500 to-emerald-500",
        level: 85,
      },
      {
        name: "Express",
        icon: SiExpress,
        color: "from-gray-500 to-gray-700",
        level: 88,
      },
      {
        name: "MongoDB",
        icon: SiMongodb,
        color: "from-green-600 to-green-800",
        level: 82,
      },
      {
        name: "PostgreSQL",
        icon: SiPostgresql,
        color: "from-blue-600 to-indigo-600",
        level: 75,
      },
      {
        name: "Socket.io",
        icon: SiSocketdotio,
        color: "from-gray-600 to-gray-800",
        level: 70,
      },
      {
        name: "Java",
        icon: FaJava,
        color: "from-red-500 to-orange-500",
        level: 85,
      },
      {
        name: "TypeScript",
        icon: SiTypescript,
        color: "from-blue-600 to-indigo-600",
        level: 75,
      },
      {
        name: "Next.js",
        icon: SiNextdotjs,
        color: "from-gray-700 to-gray-900",
        level: 70,
      },
      {
        name: "Redux",
        icon: SiRedux,
        color: "from-purple-500 to-pink-500",
        level: 80,
      },
      {
        name: "Tailwind",
        icon: SiTailwindcss,
        color: "from-teal-400 to-cyan-500",
        level: 90,
      },
      {
        name: "Git",
        icon: FaGitAlt,
        color: "from-orange-600 to-red-600",
        level: 88,
      },
      {
        name: "Docker",
        icon: FaDocker,
        color: "from-blue-400 to-blue-600",
        level: 65,
      },
    ],
    [],
  );

  const achievements = useMemo(
    () => [
      {
        icon: FaCode,
        count: "100+",
        label: "DSA Problems",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: FaRocket,
        count: "15+",
        label: "Projects Completed",
        color: "from-purple-500 to-pink-500",
      },
      {
        icon: FaChartLine,
        count: "1000+",
        label: "Hours of Coding",
        color: "from-green-500 to-emerald-500",
      },
      {
        icon: FaBrain,
        count: "5+",
        label: "Technologies Mastered",
        color: "from-orange-500 to-red-500",
      },
    ],
    [],
  );

  const platforms = useMemo(
    () => [
      {
        icon: SiLeetcode,
        name: "LeetCode",
        solved: "100+",
        color: "text-yellow-500",
        link: "https://leetcode.com/u/suhas_sonwane1234",
      },
      {
        icon: SiGeeksforgeeks,
        name: "GeeksforGeeks",
        solved: "50+",
        color: "text-green-500",
        link: "https://www.geeksforgeeks.org/profile/suhassoe8md",
      },
      {
        icon: SiHackerrank,
        name: "HackerRank",
        solved: "25+",
        color: "text-emerald-500",
        link: "https://www.hackerrank.com/profile/suhassonwane8",
      },
    ],
    [],
  );

  const quickLinks = useMemo(
    () => [
      { to: "/about", label: "About Me", icon: FaCode },
      { to: "/skills", label: "Skills", icon: FaServer },
      { to: "/projects", label: "Projects", icon: FaRocket },
      { to: "/github", label: "GitHub", icon: FaGithub },
      { to: "/coding-activity", label: "Coding", icon: SiLeetcode },
      { to: "/contact", label: "Contact", icon: FaDatabase },
    ],
    [],
  );

  // Optimized mouse handlers with useCallback
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startRotation = rotationAngle.current;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      rotationAngle.current = startRotation + deltaX * 0.5;
      if (sliderRef.current) {
        sliderRef.current.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${rotationAngle.current}deg)`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });
  }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const startX = e.touches[0].clientX;
    const startRotation = rotationAngle.current;

    const handleTouchMove = (e) => {
      const deltaX = e.touches[0].clientX - startX;
      rotationAngle.current = startRotation + deltaX * 0.5;
      if (sliderRef.current) {
        sliderRef.current.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${rotationAngle.current}deg)`;
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  }, []);

  // Optimized auto-rotate with requestAnimationFrame
  useEffect(() => {
    let lastTime = 0;

    const animate = (time) => {
      if (
        lastTime !== 0 &&
        sliderRef.current &&
        !sliderRef.current.matches(":hover")
      ) {
        const delta = time - lastTime;
        rotationAngle.current += delta * 0.005;
        sliderRef.current.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${rotationAngle.current}deg)`;
      }
      lastTime = time;
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Optimized floating elements - reduced count and memoized
  const floatingElements = useMemo(
    () =>
      [...Array(15)].map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 2,
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        {/* Floating Elements - Optimized */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingElements.map((style, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
              style={{
                left: style.left,
                top: style.top,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: style.duration,
                repeat: Infinity,
                delay: style.delay,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Profile Image */}
            <motion.div
              variants={itemVariants}
              className="relative mx-auto w-48 h-48 md:w-64 md:h-64 mb-8 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-1 transform group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-dark-100 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-8xl font-bold text-white">
                    SS
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap"
              >
                🟢 Available for work
              </motion.div>
            </motion.div>

            {/* Name and Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
                <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                  Suhas Sonwane
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light">
                Full Stack Developer & Problem Solver
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mt-6 leading-relaxed"
            >
              MERN stack developer specializing in building scalable web
              applications with React.js, Node.js, and MongoDB. Expert in
              real-time systems using Socket.io and PostgreSQL. Strong
              foundation in Java and Data Structures & Algorithms.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center mt-8"
            >
              <motion.a
                href={resume}
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-full overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaDownload />
                  Download Resume
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ opacity: 0.2 }}
                />
              </motion.a>

              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-primary-500 text-primary-500 font-semibold rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300"
                >
                  View My Work
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="fixed flex flex-col gap-3 top-[50%] right-2"
            >
              <div className="border border-violet-600"></div>
              {[
                {
                  icon: FaGithub,
                  href: "https://github.com/morer5899",
                  color: "hover:text-gray-300",
                },
                {
                  icon: FaLinkedin,
                  href: "https://linkedin.com/in/suhas-sonwane-ab927a378",
                  color: "hover:text-blue-500",
                },
              ].map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className={`text-gray-400 ${social.color} transition-colors duration-300 `}
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
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
        </motion.div> */}
      </section>

      {/* 3D Skills Slider Section */}
      <section className="py-24 bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#0a0f1c] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-wide mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Technical Expertise
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              Drag to rotate • Hover for interaction
            </p>
          </motion.div>

          <div className="relative w-full h-[420px] md:h-[520px] flex justify-center perspective-[1200px]">
            <div
              ref={sliderRef}
              className="relative w-[220px] h-[250px] transform-style-preserve-3d cursor-grab active:cursor-grabbing"
              style={{
                transform: "perspective(1200px) rotateX(-8deg) rotateY(0deg)",
                transition: "transform 0.1s ease-out",
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {skills3D.map((skill, index) => {
                const angle = (index / skills3D.length) * 360;
                const Icon = skill.icon;

                return (
                  <div
                    key={skill.name}
                    className="absolute w-44 h-full transform-style-preserve-3d"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(480px)`,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="relative w-full h-full rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-cyan-400/30 to-purple-500/40 hover:from-indigo-500 hover:to-cyan-400 transition-all duration-500 group">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Card */}
                      <div className="relative w-full h-full bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-cyan-400/60 transition-all duration-500 transform group-hover:-translate-y-4 group-hover:rotate-x-3 group-hover:rotate-y-3">
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          {/* Icon */}
                          <Icon className="text-6xl text-slate-200 mb-5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:text-cyan-400" />

                          {/* Skill Name */}
                          <h3 className="text-lg font-semibold text-slate-100 tracking-wide mb-4 group-hover:text-white transition-colors duration-300">
                            {skill.name}
                          </h3>

                          {/* Animated Progress Bar */}
                          <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 transition-all duration-1000 ease-out group-hover:brightness-125"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>

                          <span className="text-sm text-slate-400 font-medium group-hover:text-cyan-300 transition-colors duration-300">
                            {skill.level}% Proficiency
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-b from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
            <p className="text-gray-400 text-lg">My journey in numbers</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                achievement={achievement}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Coding Platforms Section */}
      <section className="py-20 bg-gradient-to-t from-dark-100 to-dark-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Coding Profiles
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Active on competitive programming platforms
            </p>
          </motion.div>

          <div className="flex flex-col items-center lg:flex-row gap-5 lg:justify-center">
            {platforms.map((platform, index) => (
              <PlatformCard key={index} platform={platform} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <QuickLink key={index} link={link} />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .perspective-\[1000px\] {
          perspective: 1000px;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(Home);
