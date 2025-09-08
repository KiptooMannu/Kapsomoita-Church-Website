import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Clock, Heart } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import InfoCard from "./hero/InfoCard";
import heroBg from '../assets/agc.png';  // ✅ Local image import (place in src/assets/)



const HeroSection = () => {
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
  const primaryPurple = "hsl(270, 50%, 40%)"; // Deep purple
  const accentPurple = "hsl(280, 60%, 50%)"; // Brighter purple
  const darkText = "hsl(270, 30%, 15%)"; // Dark purple for text
  const mediumText = "hsl(270, 20%, 30%)"; // Medium purple for text

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* ✅ Local background image with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Church Background"
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/95"></div>
      </div>

      {/* Floating decorative circles */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-purple-200 opacity-40"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-12 w-20 h-20 rounded-full bg-purple-300 opacity-30"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-lg"
          style={{ color: darkText }}
          variants={itemVariants}
        >
          Welcome to{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${primaryPurple}, ${accentPurple})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Kapsomoita
          </span>
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6"
          style={{ color: mediumText }}
          variants={itemVariants}
        >
          Africa Gospel Church
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md"
          style={{ color: "hsl(270, 15%, 45%)" }}
          variants={itemVariants}
        >
          Come as you are, leave transformed. Join our community of faith, love,
          and service as we grow together in Christ's love and spread His
          message throughout Africa and beyond.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="min-w-56 flex items-center rounded-2xl"
              style={{
                backgroundColor: primaryPurple,
                color: "white",
                boxShadow: `0 4px 20px hsla(270, 50%, 40%, 0.2)`,
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
              className="min-w-56 flex items-center rounded-2xl"
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
              iconColor={primaryPurple}
              bgColor="hsla(270, 40%, 95%, 0.85)"
              borderColor="hsl(270, 20%, 88%)"
            />
          </motion.div>
          <motion.div whileHover={{ y: -5 }}>
            <InfoCard
              icon={MapPin}
              title="Visit Us"
              mainText="Kapsomoita, Kenya"
              subText="Everyone is welcome"
              iconColor={primaryPurple}
              bgColor="hsla(270, 40%, 95%, 0.85)"
              borderColor="hsl(270, 20%, 88%)"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
