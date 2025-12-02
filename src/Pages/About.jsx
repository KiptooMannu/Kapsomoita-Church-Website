import { motion } from "framer-motion";
import { Church, HeartHandshake, BookOpen, Users, Cross, Target, Star, Globe, Calendar } from "lucide-react";
import { useState } from "react";

// ✅ Shared church color scheme
const primaryPurple = "hsl(270, 50%, 40%)"; 
const darkText = "hsl(0, 0%, 15%)"; 
const mediumText = "hsl(0, 0%, 30%)"; 

const About = () => {
  const [activeYear, setActiveYear] = useState("1995");
  const [activeValue, setActiveValue] = useState(null);

  const stats = [
    { value: "200+", label: "Members", icon: Users },
    { value: "15", label: "Ministries", icon: HeartHandshake },
    { value: "52", label: "Sermons/Yr", icon: BookOpen },
    { value: "1995", label: "Founded", icon: Church },
  ];

  const timeline = [
    {
      year: "1995",
      event: "Church Founding",
      description: "Started as a small prayer group under a tree in Kapsomoita village",
      image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2002",
      event: "First Sanctuary",
      description: "Built our first permanent structure with mud walls and iron sheets",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2010",
      event: "Community Outreach",
      description: "Launched our first major community development programs",
      image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2018",
      event: "Current Sanctuary",
      description: "Dedicated our new 500-seat worship center",
      image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const values = [
    {
      icon: Cross,
      title: "Christ-Centered",
      description: "We keep Jesus at the center of all we do, seeking to glorify Him in our worship, relationships, and service.",
      verse: "Colossians 1:18",
      color: primaryPurple
    },
    {
      icon: BookOpen,
      title: "Bible-Based",
      description: "We are committed to the authority of Scripture as our guide for faith and practice.",
      verse: "2 Timothy 3:16-17",
      color: "hsl(280, 60%, 50%)"
    },
    {
      icon: HeartHandshake,
      title: "Compassionate",
      description: "We demonstrate Christ's love through compassion, forgiveness, and sacrificial service.",
      verse: "1 John 4:7-8",
      color: "hsl(290, 70%, 50%)"
    },
    {
      icon: Users,
      title: "Community",
      description: "We cultivate authentic relationships that foster spiritual growth and mutual support.",
      verse: "Acts 2:42-47",
      color: "hsl(300, 70%, 50%)"
    }
  ];

  const visionPoints = [
    { icon: Users, text: "Thriving churches nurturing spiritual growth" },
    { icon: HeartHandshake, text: "Families restored through biblical values" },
    { icon: Star, text: "Youth empowered to fulfill their God-given purpose" },
    { icon: Globe, text: "Social justice and compassion in action" }
  ];

  const activeTimelineItem = timeline.find(item => item.year === activeYear);

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
    <div className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-28 text-center bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-300"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-200"></div>
          </div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-800"
            variants={itemVariants}
          >
            About{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${primaryPurple}, hsl(280, 60%, 50%))`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Our Church
            </span>
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600"
            variants={itemVariants}
          >
            Learn about our history, mission, and the heart behind{" "}
            <span style={{ color: primaryPurple, fontWeight: 600 }}>
              Kapsomoita Africa Gospel Church
            </span>
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                variants={itemVariants}
              >
                <stat.icon
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: primaryPurple }}
                />
                <p
                  className="text-4xl font-bold mb-2 text-gray-800"
                >
                  {stat.value}
                </p>
                <p
                  className="text-base font-medium text-gray-600"
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Block */}
            <motion.div
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Target
                  className="w-10 h-10 mr-4 p-2 rounded-full"
                  style={{
                    color: primaryPurple,
                    backgroundColor: `${primaryPurple}15`
                  }}
                />
                <h2 className="text-3xl font-bold text-gray-800">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed mb-6 text-gray-600">
                To fulfill the Great Commandment and Great Commission of the Lord Jesus Christ 
                according to the Great Plan - making disciples of all nations.
              </p>
              <div className="flex items-center">
                <Cross className="w-5 h-5 mr-2" style={{ color: primaryPurple }} />
                <p className="text-gray-600">
                  <strong>Matthew 28:19-20</strong> — "Go therefore and make disciples..."
                </p>
              </div>
            </motion.div>

            {/* Vision Block */}
            <motion.div
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Star
                  className="w-10 h-10 mr-4 p-2 rounded-full"
                  style={{
                    color: primaryPurple,
                    backgroundColor: `${primaryPurple}15`
                  }}
                />
                <h2 className="text-3xl font-bold text-gray-800">
                  Our Vision
                </h2>
              </div>
              <p className="text-lg leading-relaxed mb-6 text-gray-600">
                The Whole Church taking the Whole Gospel to the Whole World.
                (Swahili: KANISA LOTE, likieneza INJILI YOTE, ULIMWENGUNI KOTE)
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {visionPoints.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start p-3 rounded-lg bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: primaryPurple }} />
                      <span className="text-gray-600">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Church Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Sacred <span style={{ color: primaryPurple }}>Journey</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              A testament of faith that began with a vision to serve God and transform communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                <Church className="inline mr-3 w-6 h-6" style={{ color: primaryPurple }} />
                Founded in Faith
              </h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Kapsomoita Africa Gospel Church was born in 1995 out of a deep desire to serve God 
                and bring His love to the people of Kapsomoita and the surrounding regions. 
                What started as a small gathering of 12 believers under a mango tree has grown into 
                a vibrant community of over 500 faithful members.
              </p>
              
              {/* Interactive Timeline */}
              <div className="mt-10">
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  <Calendar className="inline mr-2 w-5 h-5" style={{ color: primaryPurple }} />
                  Our Timeline
                </h4>
                <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                  {timeline.map((item, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                        activeYear === item.year 
                          ? "text-white" 
                          : "text-purple-800 bg-purple-100"
                      }`}
                      style={{
                        backgroundColor: activeYear === item.year ? primaryPurple : '',
                        color: activeYear === item.year ? 'white' : primaryPurple
                      }}
                      onClick={() => setActiveYear(item.year)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.year}
                    </motion.button>
                  ))}
                </div>
                
                {activeTimelineItem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="h-40 mb-4 overflow-hidden rounded">
                      <img 
                        src={activeTimelineItem.image} 
                        alt={activeTimelineItem.event}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-lg mb-1" style={{ color: primaryPurple }}>
                      {activeTimelineItem.event}
                    </p>
                    <p className="text-gray-600">{activeTimelineItem.description}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
                Our Core Beliefs
              </h3>
              <ul className="space-y-6">
                {[
                  {
                    icon: BookOpen,
                    text: "The Bible as God's inspired, inerrant, and authoritative Word for faith and life"
                  },
                  {
                    icon: HeartHandshake,
                    text: "Salvation by grace alone through faith alone in Christ alone"
                  },
                  {
                    icon: Users,
                    text: "The Church as Christ's body called to worship, fellowship, and discipleship"
                  },
                  {
                    icon: Globe,
                    text: "The Great Commission to make disciples of all nations"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="w-6 h-6 mr-4 mt-1 flex-shrink-0" style={{ color: primaryPurple }} />
                      <span className="text-gray-600">{item.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Church Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Guiding <span style={{ color: primaryPurple }}>Values</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              The biblical principles that shape our identity and direct our ministry
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveValue(index)}
                >
                  <Icon
                    className="w-12 h-12 mx-auto mb-4 p-2 rounded-full"
                    style={{
                      color: value.color,
                      backgroundColor: `${value.color}15`
                    }}
                  />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20" style={{ backgroundColor: primaryPurple }}>
        <div className="max-w-5xl mx-auto text-center px-4 text-white">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join Us in Our Mission
          </motion.h2>
          <motion.p
            className="text-xl mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Become part of our growing community and help us spread God's love to the world.
          </motion.p>
          <motion.button
            className="bg-white text-purple-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Visit Us This Sunday
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default About;