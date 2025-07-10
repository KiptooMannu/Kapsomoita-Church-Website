import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart } from "lucide-react";
import { Link as ScrollLink } from 'react-scroll'; // Changed from react-router-dom
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
    <section 
      id="home" // Added ID for navigation
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(180deg, hsl(45, 25%, 97%), hsl(45, 20%, 98%))'
      }}
    >
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30S-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30z' fill='%2325a45f' fill-opacity='0.1'/%3E%3C/svg%3E\")"
        }}
      ></div>
      
      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ color: 'hsl(25, 25%, 15%)' }}
          variants={itemVariants}
        >
          Welcome to{" "}
          <span 
            style={{
              background: 'linear-gradient(135deg, hsl(25, 85%, 45%), hsl(35, 90%, 65%))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Kapsomoita
          </span>
        </motion.h1>
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
          style={{ color: 'hsl(25, 35%, 25%)' }}
          variants={itemVariants}
        >
          Africa Gospel Church
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'hsl(25, 15%, 45%)' }}
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
            <Button 
              size="lg"
              className="min-w-56 flex items-center"
              style={{
                backgroundColor: 'hsl(25, 85%, 45%)',
                color: 'hsl(45, 20%, 98%)',
                boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.15)'
              }}
            >
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer"
              >
                Learn About Us <ArrowRight className="ml-2 w-5 h-5" />
              </ScrollLink>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg"
              className="min-w-56 flex items-center"
              style={{
                background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%))',
                color: 'hsl(25, 35%, 25%)',
                fontWeight: 600,
                boxShadow: '0 8px 25px hsla(45, 95%, 55%, 0.3)'
              }}
            >
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="flex items-center cursor-pointer"
              >
                <Heart className="mr-2 w-5 h-5" />
                Give & Support
              </ScrollLink>
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
              iconColor="hsl(25, 85%, 45%)"
              bgColor="hsla(35, 40%, 92%, 0.8)"
              borderColor="hsl(35, 20%, 88%)"
            />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard 
              icon={MapPin}
              title="Visit Us"
              mainText="Kapsomoita, Kenya"
              subText="Everyone is welcome"
              iconColor="hsl(25, 85%, 45%)"
              bgColor="hsla(35, 40%, 92%, 0.8)"
              borderColor="hsl(35, 20%, 88%)"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;