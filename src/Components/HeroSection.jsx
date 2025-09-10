import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart, Cross, Book, ChurchIcon } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import InfoCard from "./hero/InfoCard";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentVerse, setCurrentVerse] = useState(0);
  
  // Bible verses to cycle through
  const bibleVerses = [
    "For I know the plans I have for you, declares the Lord - Jeremiah 29:11",
    "I can do all things through Christ who strengthens me - Philippians 4:13",
    "The Lord is my shepherd, I shall not want - Psalm 23:1",
    "Trust in the Lord with all your heart - Proverbs 3:5"
  ];

  // Cycle through bible verses
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % bibleVerses.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bibleVerses.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  // Church purple color scheme
  const primaryPurple = "hsl(270, 50%, 40%)";
  const accentPurple = "hsl(280, 60%, 50%)";
  const darkText = "hsl(270, 30%, 15%)";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background image without parallax */}
      <div className="absolute inset-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJsUBWBAfnUdIZ_Swif8RvZ2ENyNVNVfPYZw&s"
          alt="Church Background"
          className="w-full h-full object-cover object-center scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
      </div>

      {/* Animated floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-purple-200 opacity-40 hidden sm:block"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-full bg-purple-300 opacity-30 hidden md:block"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-12 h-12 hidden lg:block"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      >
        <Cross className="w-full h-full text-purple-200 opacity-60" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-10 h-10 hidden md:block"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, delay: 1.5 }}
      >
        <Book className="w-full h-full text-purple-300 opacity-50" />
      </motion.div>

      {/* Bible verse carousel */}
      <motion.div 
        className="absolute top-4 md:top-6 left-0 right-0 mx-auto w-full max-w-2xl px-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-lg">
          <motion.p 
            key={currentVerse}
            className="text-center font-medium text-purple-900 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {bibleVerses[currentVerse]}
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Church logo/icon */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <ChurchIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg"
          variants={itemVariants}
        >
          Welcome to{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${accentPurple}, hsl(280, 70%, 70%))`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Kapsomoita
          </span>
        </motion.h1>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 text-white"
          variants={itemVariants}
        >
          Africa Gospel Church
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl max-w-2xl md:max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed text-white drop-shadow-md px-2"
          variants={itemVariants}
        >
          Come as you are, leave transformed. Join our community of faith, love,
          and service as we grow together in Christ's love and spread His
          message throughout Africa and beyond.
        </motion.p>

        {/* Live service indicator */}
        <motion.div 
          className="inline-flex items-center bg-red-600/90 text-white px-3 py-1 md:px-4 md:py-2 rounded-full mb-6 md:mb-8 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full mr-2 animate-pulse"></div>
          <span className="font-medium">Live Now: Sunday Service</span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16 px-2"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="w-full sm:min-w-48 md:min-w-56 flex items-center rounded-xl md:rounded-2xl group text-sm md:text-base"
              style={{
                backgroundColor: "white",
                color: primaryPurple,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.2)`,
              }}
            >
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer"
              >
                Learn About Us <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </ScrollLink>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="w-full sm:min-w-48 md:min-w-56 flex items-center rounded-xl md:rounded-2xl group text-sm md:text-base"
              style={{
                background: `linear-gradient(135deg, ${accentPurple}, hsl(280, 70%, 60%))`,
                color: "white",
                fontWeight: 600,
                boxShadow: `0 8px 25px hsla(280, 60%, 50%, 0.3)`,
              }}
            >
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer"
              >
                <Heart className="mr-2 w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                Give & Support
              </ScrollLink>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick info cards - Now always visible */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto mb-16 md:mb-20 px-2"
          variants={itemVariants}
        >
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard
              icon={Clock}
              title="Sunday Service"
              mainText="Every Sunday at 9:00 AM"
              subText="Join us for worship and fellowship"
              iconColor={primaryPurple}
              bgColor="hsla(0, 0%, 100%, 0.95)"
              borderColor="hsl(270, 20%, 88%)"
              textColor={darkText}
            />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard
              icon={MapPin}
              title="Visit Us"
              mainText="Kapsomoita, Kenya"
              subText="Everyone is welcome"
              iconColor={primaryPurple}
              bgColor="hsla(0, 0%, 100%, 0.95)"
              borderColor="hsl(270, 20%, 88%)"
              textColor={darkText}
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
   
        </motion.div>
      </motion.div>

      {/* Media queries as style tag for additional control */}
      <style jsx>{`
        @media (max-width: 640px) {
          .hero-content {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
        
        @media (min-width: 1280px) {
          .hero-bg img {
            object-position: center 25%;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-bg img {
            object-position: center 30%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;