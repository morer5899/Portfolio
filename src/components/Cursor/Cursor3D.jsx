import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Cursor3D = () => {
  const containerRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add point lights for better 3D effect
    const light1 = new THREE.PointLight(0x00ffff, 1, 30);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 1, 30);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    // Create particles
    const particleCount = 150;
    const particles = [];

    // Color palette for particles
    const colors = [
      0x00ffff, // Cyan
      0xff00ff, // Magenta
      0xffff00, // Yellow
      0x00ff00, // Green
      0xff6600, // Orange
      0x9900ff, // Purple
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create geometry
      const geometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 8);
      
      // Create material with random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 30,
        transparent: true,
        opacity: 0.8
      });

      // Create mesh
      const sphere = new THREE.Mesh(geometry, material);
      
      // Random position in a sphere
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      sphere.position.x = radius * Math.sin(phi) * Math.cos(theta);
      sphere.position.y = radius * Math.sin(phi) * Math.sin(theta);
      sphere.position.z = radius * Math.cos(phi);
      
      // Store additional properties for animation
      sphere.userData = {
        originalPos: sphere.position.clone(),
        speed: 0.005 + Math.random() * 0.01,
        offset: Math.random() * Math.PI * 2,
        radius: radius,
        color: color
      };

      scene.add(sphere);
      particles.push(sphere);
    }

    // Add some floating cubes for variety
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6
      });

      const cube = new THREE.Mesh(geometry, material);
      
      const radius = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      cube.position.x = radius * Math.sin(phi) * Math.cos(theta);
      cube.position.y = radius * Math.sin(phi) * Math.sin(theta);
      cube.position.z = radius * Math.cos(phi);
      
      cube.userData = {
        originalPos: cube.position.clone(),
        speed: 0.003 + Math.random() * 0.008,
        offset: Math.random() * Math.PI * 2,
        radius: radius,
        rotationSpeed: 0.01 + Math.random() * 0.02
      };

      scene.add(cube);
      particles.push(cube);
    }

    particlesRef.current = particles;

    // Mouse move handler
    const handleMouseMove = (e) => {
      // Calculate normalized mouse position (-1 to 1)
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Smooth follow for mouse position
      targetPosition.current.x += (mousePosition.current.x - targetPosition.current.x) * 0.05;
      targetPosition.current.y += (mousePosition.current.y - targetPosition.current.y) * 0.05;

      // Rotate camera based on mouse position
      cameraRef.current.position.x = targetPosition.current.x * 5;
      cameraRef.current.position.y = targetPosition.current.y * 5;
      cameraRef.current.lookAt(0, 0, 0);

      // Animate particles
      particlesRef.current.forEach((particle) => {
        // Gentle floating animation
        const time = Date.now() * particle.userData.speed;
        const offset = particle.userData.offset;
        
        // Orbital motion
        particle.position.x = particle.userData.originalPos.x + Math.sin(time + offset) * 0.5;
        particle.position.y = particle.userData.originalPos.y + Math.cos(time + offset) * 0.5;
        particle.position.z = particle.userData.originalPos.z + Math.sin(time * 0.5 + offset) * 0.5;

        // Rotate cubes
        if (particle.isMesh && particle.geometry.type === 'BoxGeometry') {
          particle.rotation.x += particle.userData.rotationSpeed;
          particle.rotation.y += particle.userData.rotationSpeed;
        }

        // Pulsing scale based on distance from center
        const distance = Math.sqrt(
          particle.position.x ** 2 + 
          particle.position.y ** 2 + 
          particle.position.z ** 2
        );
        
        const scale = 1 + Math.sin(time * 2 + offset) * 0.2;
        particle.scale.set(scale, scale, scale);
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      particlesRef.current.forEach(particle => {
        particle.geometry.dispose();
        particle.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default Cursor3D;