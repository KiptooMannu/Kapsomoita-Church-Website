import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart, Cross, Book, ChurchIcon, Calendar, Users, Volume2, ExternalLink, ChevronDown, Play, Star, Bell, Facebook, Youtube, Instagram, Globe } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import InfoCard from "./hero/InfoCard";
import { useState, useEffect, useRef } from "react";

const HeroSection = () => {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Church purple color scheme
  const primaryPurple = "hsl(270, 50%, 40%)";
  const accentPurple = "hsl(280, 60%, 50%)";

  // Optimized background images with smaller versions for faster loading
  const backgroundImages = [
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSL5sSO_nrgJbi7lQf0Ltp7HLapQFDxanFCvtwaqGRYOR9RcXUmF5GnZA5XvQuLuUagLcimCk70yDqk10hjLzWXvKxS6lPm4-wIQspXM_XbxwBArIoCDrjw4A&usqp=CAc",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518834103328-4dbb0d8400de?q=80&w=1920&auto=format&fit=crop"
  ];

  // Bible verses to cycle through
  const bibleVerses = [
    { text: "For I know the plans I have for you, declares the Lord", verse: "Jeremiah 29:11" },
    { text: "I can do all things through Christ who strengthens me", verse: "Philippians 4:13" },
    { text: "The Lord is my shepherd, I shall not want", verse: "Psalm 23:1" },
    { text: "Trust in the Lord with all your heart", verse: "Proverbs 3:5" },
    { text: "The Whole Church taking the Whole Gospel to the Whole World", verse: "Our Vision" }
  ];

  // Announcements
  const announcements = [
    { title: "Sunday School Resumes", date: "Jan 15", time: "9:00 AM" },
    { title: "Men's Breakfast", date: "Jan 20", time: "8:00 AM" },
    { title: "Youth Camp Registration", date: "Jan 25", time: "Ongoing" },
    { title: "Community Outreach", date: "Feb 3", time: "10:00 AM" }
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "#1877F2", url: "#" },
    { icon: Youtube, label: "YouTube", color: "#FF0000", url: "#" },
    { icon: Instagram, label: "Instagram", color: "#E4405F", url: "#" },
    { icon: Globe, label: "Website", color: primaryPurple, url: "#" }
  ];

  // Preload first image only to show content quickly
  useEffect(() => {
    const preloadFirstImage = () => {
      const img = new Image();
      img.src = backgroundImages[0];
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false); // Continue even if image fails
      };
    };
    
    preloadFirstImage();
    
    // Preload other images in background
    for (let i = 1; i < backgroundImages.length; i++) {
      const img = new Image();
      img.src = backgroundImages[i];
    }
  }, []);

  // Calculate next service countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date(now);
      
      // Set to next Sunday at 9:00 AM
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setHours(9, 0, 0, 0);
      
      if (nextSunday < now) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }
      
      const difference = nextSunday - now;
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cycle through bible verses
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % bibleVerses.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if currently in live service
  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hour = now.getHours();
    
    setIsLive(day === 0 && hour >= 8 && hour <= 12);
  }, []);

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

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pb-20 bg-gradient-to-br from-gray-900 to-purple-950"
    >
      {/* Background image carousel - Simplified */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={backgroundImages[currentImage]}
              alt="Church Background"
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: "center 30%",
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900/90 to-blue-900/80"></div>
      </div>

      {/* Social media sidebar */}
      <motion.div 
        className="hidden md:flex fixed left-6 top-1/2 transform -translate-y-1/2 flex-col gap-4 z-30"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: social.color }}
            aria-label={social.label}
          >
            <social.icon className="w-5 h-5" />
          </motion.a>
        ))}
      </motion.div>

      {/* Main content container */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top bar with verse and announcements */}
        <div className="mb-8 md:mb-12">
          {/* Bible verse carousel */}
          <motion.div 
            className="relative mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-2">
                <Book className="w-5 h-5 md:w-6 md:h-6 text-purple-200 mr-3" />
                <h3 className="text-sm md:text-base font-medium text-white">Today's Word</h3>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVerse}
                  className="overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg md:text-xl font-semibold text-white mb-1">
                    "{bibleVerses[currentVerse].text}"
                  </p>
                  <p className="text-purple-200 text-sm md:text-base">
                    — {bibleVerses[currentVerse].verse}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Announcements bar */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-xl p-3 md:p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center overflow-x-auto space-x-4 md:space-x-6">
              <div className="flex items-center text-white whitespace-nowrap">
                <Bell className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-300" />
                <span className="font-medium">Upcoming Events:</span>
              </div>
              {announcements.map((announcement, index) => (
                <div key={index} className="flex items-center bg-white/10 px-3 py-2 rounded-lg whitespace-nowrap">
                  <Calendar className="w-4 h-4 mr-2 text-purple-300" />
                  <div>
                    <p className="text-sm font-medium text-white">{announcement.title}</p>
                    <p className="text-xs text-purple-200">
                      {announcement.date} • {announcement.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main hero content */}
        <div className="text-center mb-10 md:mb-16">
          {/* Church logo/icon */}
          <motion.div
            className="mb-6 md:mb-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white/20 to-purple-500/20 backdrop-blur-lg border border-white/30 shadow-2xl">
              <ChurchIcon className="w-12 h-12 md:w-14 md:h-14 text-white" />
            </div>
          </motion.div>

          {/* Main heading with animated gradient */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl"
            variants={itemVariants}
          >
            Welcome to{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kapsomoita
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] opacity-30 blur-xl"
                animate={{
                  backgroundPosition: ["0% 0%", "200% 0%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </span>
          </motion.h1>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 text-white/90 drop-shadow-lg"
            variants={itemVariants}
          >
            Africa Gospel Church
          </motion.h2>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl max-w-3xl md:max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed text-white/90 px-4 font-light"
            variants={itemVariants}
          >
            Come as you are, leave transformed. Join our community of faith, love,
            and service as we grow together in Christ's love and spread His
            message throughout Africa and beyond.
          </motion.p>

          {/* Live/Countdown section */}
          <motion.div
            className="mb-8 md:mb-12"
            variants={fadeInUp}
          >
            {isLive ? (
              <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-2xl animate-pulse">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <div className="flex items-center">
                  <Volume2 className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  <div>
                    <p className="font-bold text-lg md:text-xl">LIVE NOW: Sunday Service</p>
                    <p className="text-sm md:text-base">Join us in worship!</p>
                  </div>
                </div>
                <a href="#" className="ml-4 px-4 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors">
                  <div className="flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Live
                  </div>
                </a>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl inline-block">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Next Service Countdown</h3>
                <div className="flex justify-center space-x-4 md:space-x-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-black/30 rounded-xl flex items-center justify-center mb-2">
                        <span className="text-2xl md:text-3xl font-bold text-white">
                          {value.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-sm md:text-base text-purple-200 uppercase">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-16"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -3 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:min-w-64 md:min-w-72 flex items-center justify-center rounded-full group text-lg font-semibold shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, white, #f8fafc)`,
                  color: primaryPurple,
                  border: `2px solid ${primaryPurple}`,
                }}
              >
                <ScrollLink
                  to="about"
                  smooth={true}
                  duration={700}
                  offset={-80}
                  className="flex items-center cursor-pointer"
                >
                  Discover Our Story
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </ScrollLink>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -3 }} 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:min-w-64 md:min-w-72 flex items-center justify-center rounded-full group text-lg font-semibold shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${accentPurple}, ${primaryPurple})`,
                  color: "white",
                  border: `2px solid white`,
                }}
              >
                <ScrollLink
                  to="contact"
                  smooth={true}
                  duration={700}
                  offset={-80}
                  className="flex items-center cursor-pointer"
                >
                  <Heart className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Plan Your Visit
                </ScrollLink>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats and quick info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
          variants={containerVariants}
        >
          {/* Stats cards */}
          <motion.div 
            className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={fadeInUp}
          >
            {[
              { icon: Users, value: "500+", label: "Members", color: "bg-blue-500/20" },
              { icon: Star, value: "28", label: "Years", color: "bg-yellow-500/20" },
              { icon: Cross, value: "15+", label: "Ministries", color: "bg-purple-500/20" },
              { icon: Calendar, value: "Weekly", label: "Services", color: "bg-green-500/20" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg ${stat.color} mr-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-purple-200">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main info cards */}
          <motion.div className="md:col-span-2" variants={fadeInUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -8, scale: 1.02 }}>
                <div className="bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center mb-4">
                    <Clock className="w-8 h-8 text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">Service Times</h3>
                  </div>
                  <p className="text-2xl font-semibold text-white mb-2">Sunday: 8:00 AM & 10:30 AM</p>
                  <p className="text-lg text-purple-200">Wednesday Prayer: 5:30 PM</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -8, scale: 1.02 }}>
                <div className="bg-gradient-to-r from-purple-700/90 to-purple-600/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-8 h-8 text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">Visit Us</h3>
                  </div>
                  <p className="text-2xl font-semibold text-white mb-2">Kapsomoita, Bomet County</p>
                  <p className="text-lg text-purple-200">Get Directions →</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick links card */}
          <motion.div variants={fadeInUp}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { icon: ExternalLink, text: "Give Online", link: "#" },
                  { icon: Calendar, text: "Events Calendar", link: "#" },
                  { icon: Book, text: "Latest Sermons", link: "#" },
                  { icon: Users, text: "Ministries", link: "#" },
                ].map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <item.icon className="w-5 h-5 text-purple-300 mr-3" />
                    <span className="text-white group-hover:text-purple-200 transition-colors">
                      {item.text}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-purple-200 mb-2">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background image indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentImage === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm z-20">
        Kapsomoita AGC © {new Date().getFullYear()}
      </div>

      {/* Simplified loading state - Only show briefly */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-950 flex items-center justify-center z-30"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          onAnimationComplete={() => setIsLoading(false)}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;