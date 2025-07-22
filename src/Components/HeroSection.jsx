import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link as ScrollLink } from 'react-scroll';
import InfoCard from "./hero/InfoCard";

// Import your local images
import image1 from '../assets/hero/church1.jpg';
import image2 from '../assets/hero/church2.jpg';
import image3 from '../assets/hero/church3.jpg';
import image4 from '../assets/hero/church4.jpg';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const images = [image1, image2, image3, image4];
  const intervalRef = useRef(null);

  // Auto-rotate images with directional control
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(0);
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handlePrev = () => {
    setDirection(1);
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    resetInterval();
  };

  const handleNext = () => {
    setDirection(0);
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(0);
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  const imageVariants = {
    enter: (direction) => ({
      opacity: 0,
      scale: direction === 0 ? 1.1 : 0.9
    }),
    center: {
      opacity: 0.4,
      scale: 1,
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }
    },
    exit: (direction) => ({
      opacity: 0,
      scale: direction === 0 ? 0.9 : 1.1,
      transition: { duration: 1.2 }
    })
  };

  // Color scheme
  const primaryPurple = 'hsl(270, 50%, 40%)';
  const accentPurple = 'hsl(280, 60%, 50%)';
  const darkText = 'hsl(270, 30%, 15%)';
  const mediumText = 'hsl(270, 20%, 30%)';

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {images.map((img, index) => (
          (index === currentImageIndex || index === (currentImageIndex - 1 + images.length) % images.length) && (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(10%) brightness(0.85)'
              }}
            />
          )
        ))}
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
      
      {/* Background pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30S-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30z' fill='%2325a45f' fill-opacity='0.1'/%3E%3C/svg%3E\")"
        }}
      ></div>
      
      {/* Slideshow controls */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <motion.div
            key={index}
            className="h-1.5 rounded-full"
            initial={{ width: index === currentImageIndex ? 24 : 8 }}
            animate={{ 
              width: index === currentImageIndex ? 24 : 8,
              backgroundColor: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6"
          style={{ color: darkText }}
          variants={itemVariants}
        >
          Welcome to{" "}
          <motion.span 
            className="inline-block"
            style={{
              background: `linear-gradient(135deg, ${primaryPurple}, ${accentPurple})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
            whileHover={{ 
              scale: 1.05,
              background: `linear-gradient(135deg, ${accentPurple}, ${primaryPurple})`
            }}
            transition={{ duration: 0.4 }}
          >
            Kapsomoita
          </motion.span>
        </motion.h1>
        
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6"
          style={{ color: mediumText }}
          variants={itemVariants}
        >
          Africa Gospel Church
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl max-w-2xl md:max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed"
          style={{ color: 'hsl(270, 15%, 45%)' }}
          variants={itemVariants}
        >
          Come as you are, leave transformed. Join our community of faith, love, and service 
          as we grow together in Christ's love and spread His message throughout Africa and beyond.
        </motion.p>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button 
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center"
              style={{
                backgroundColor: primaryPurple,
                color: 'white',
                boxShadow: `0 4px 20px hsla(270, 50%, 40%, 0.2)`
              }}
            >
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer w-full justify-center"
              >
                Learn About Us <ArrowRight className="ml-2 w-5 h-5" />
              </ScrollLink>
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button 
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${accentPurple}, hsl(280, 70%, 60%))`,
                color: 'white',
                fontWeight: 600,
                boxShadow: `0 8px 25px hsla(280, 60%, 50%, 0.3)`
              }}
            >
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer w-full justify-center"
              >
                <Heart className="mr-2 w-5 h-5" />
                Give & Support
              </ScrollLink>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick info cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <InfoCard 
              icon={Clock}
              title="Sunday Service"
              mainText="Every Sunday at 9:00 AM"
              subText="Join us for worship and fellowship"
              iconColor={primaryPurple}
              bgColor="hsla(270, 40%, 95%, 0.8)"
              borderColor="hsl(270, 20%, 88%)"
            />
          </motion.div>
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <InfoCard 
              icon={MapPin}
              title="Visit Us"
              mainText="Kapsomoita, Kenya"
              subText="Everyone is welcome"
              iconColor={primaryPurple}
              bgColor="hsla(270, 40%, 95%, 0.8)"
              borderColor="hsl(270, 20%, 88%)"
            />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 1.2 }
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center text-white"
        >
          <span className="text-sm mb-1">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;