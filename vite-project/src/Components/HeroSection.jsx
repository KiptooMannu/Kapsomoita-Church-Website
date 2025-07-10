// HeroSection.jsx
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import InfoCard from "./hero/InfoCard";

const HeroSection = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-amber-50 overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30S-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30z' fill='%233b82f6' fill-opacity='0.1'/%3E%3C/svg%3E\")"
      }}></div>
      
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Kapsomoita
          </span>
        </motion.h1>
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-semibold text-amber-800 mb-6"
          variants={itemVariants}
        >
          Africa Gospel Church
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed"
          variants={itemVariants}
        >
          Come as you are, leave transformed. Join our community of faith, love, and service 
          as we grow together in Christ's love and spread His message throughout Africa and beyond.
        </motion.p>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" size="lg" className="min-w-56" asChild>
              <Link to="/about" className="flex items-center">
                Learn About Us <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="gold" size="lg" className="min-w-56" asChild>
              <Link to="/giving" className="flex items-center">
                <Heart className="mr-2 w-5 h-5" />
                Give & Support
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick info cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard 
              icon={Clock}
              title="Sunday Service"
              mainText="Every Sunday at 9:00 AM"
              subText="Join us for worship and fellowship"
            />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard 
              icon={MapPin}
              title="Visit Us"
              mainText="Kapsomoita, Kenya"
              subText="Everyone is welcome"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;