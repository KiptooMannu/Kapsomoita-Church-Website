import { motion } from "framer-motion";
import { Button } from "../Components/ui/button";
import MissionVision from "../Components/about/MissionVision";
import ChurchStory from "../Components/about/ChurchStory";
import ChurchValues from "../Components/about/ChurchValues";
import { Church, HeartHandshake, BookOpen, Users } from "lucide-react";

const About = () => {
  const stats = [
    { value: "200+", label: "Members", icon: Users },
    { value: "15", label: "Ministries", icon: HeartHandshake },
    { value: "52", label: "Sermons/Yr", icon: BookOpen },
    { value: "1995", label: "Founded", icon: Church },
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "hsl(45, 20%, 98%)" }}>
      {/* Floating Background Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 rounded-full bg-purple-200 opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-20 h-20 rounded-full bg-purple-300 opacity-30"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Hero Section */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, hsl(45, 25%, 97%), hsl(45, 20%, 98%))",
        }}
      >
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: "hsl(25, 25%, 15%)" }}
            variants={itemVariants}
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg, hsl(270, 50%, 40%), hsl(280, 60%, 50%))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Our Church
            </span>
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: "hsl(25, 15%, 45%)" }}
            variants={itemVariants}
          >
            Learn about our history, mission, and the heart behind Kapsomoita Africa Gospel Church
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-transform"
                whileHover={{ scale: 1.05, y: -5 }}
                variants={itemVariants}
              >
                <stat.icon
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "hsl(270, 50%, 40%)" }}
                />
                <p className="text-3xl font-bold" style={{ color: "hsl(25, 35%, 25%)" }}>
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: "hsl(25, 15%, 45%)" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <MissionVision />
      <ChurchStory />
      <ChurchValues />

      {/* Leadership Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-16"
            style={{ color: "hsl(25, 35%, 25%)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Leadership
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Rev. Dr. Robert Lang'at",
                role: "Bishop – AGC Kenya",
                img: "https://agckenya.org/wp-content/uploads/2021/08/New-Project-10-1-1200x883.jpg",
              },
              {
                name: "Rev. John ole Kisotu",
                role: "Assistant Bishop – AGC Kenya",
                img: "https://agckenya.org/wp-content/uploads/2021/08/New-Project-12-1200x883.jpg",
              },
              {
                name: "Raymond Tonui",
                role: "Administrative Secretary",
                img: "https://agckenya.org/wp-content/uploads/2021/08/New-Project-11-1-1200x883.jpg",
              },
            ].map((leader, index) => (
              <motion.div
                key={leader.name}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
                whileHover={{ scale: 1.05, y: -8 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={leader.img}
                    alt={leader.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold" style={{ color: "hsl(25, 25%, 15%)" }}>
                    {leader.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "hsl(25, 85%, 45%)" }}>
                    {leader.role}
                  </p>
                  <p className="text-sm mt-3 text-left" style={{ color: "hsl(25, 15%, 45%)" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dedicated to guiding
                    the church with faith, vision, and servant leadership.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "hsl(25, 35%, 25%)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Our Journey Through the Years
          </motion.h2>
          <div className="space-y-8">
            {[
              { year: "1995", text: "Kapsomoita AGC was founded with a vision to spread the Gospel." },
              { year: "2005", text: "Expansion into multiple ministries and community outreach." },
              { year: "2015", text: "Launch of youth and women’s programs empowering the next generation." },
              { year: "2025", text: "Continuing the mission with faith and technology-driven ministry." },
            ].map((event, index) => (
              <motion.div
                key={event.year}
                className="relative pl-10 border-l-4 border-purple-300"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-purple-400 border-4 border-white shadow"></div>
                <h3 className="text-xl font-bold" style={{ color: "hsl(270, 50%, 40%)" }}>
                  {event.year}
                </h3>
                <p className="text-gray-600">{event.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
