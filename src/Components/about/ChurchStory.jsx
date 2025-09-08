import { motion, useInView } from "framer-motion";
import { Button } from "../../Components/ui/button";
import { Heart, Book, Users, Globe, Calendar, Church, ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const ChurchStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [activeYear, setActiveYear] = useState("1995");
  const [showVideo, setShowVideo] = useState(false);

  const timeline = [
    {
      year: "1995",
      event: "Church Founding",
      description: "Started as a small prayer group under a tree in Kapsomoita village",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7a584bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2002",
      event: "First Sanctuary",
      description: "Built our first permanent structure with mud walls and iron sheets",
      image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2010",
      event: "Community Outreach",
      description: "Launched our first major community development programs",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      year: "2018",
      event: "Current Sanctuary",
      description: "Dedicated our new 500-seat worship center",
      image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const activeTimelineItem = timeline.find(item => item.year === activeYear);

  return (
    <section 
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: 'hsla(35, 40%, 92%, 0.3)' }}
      ref={ref}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-5"
        style={{ backgroundColor: 'hsl(270, 50%, 40%)' }}
        animate={{ 
          scale: [1, 1.5, 1],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-5"
        style={{ backgroundColor: 'hsl(280, 60%, 50%)' }}
        animate={{ 
          scale: [1, 1.8, 1],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'hsl(25, 35%, 25%)' }}
          >
            Our Sacred <span style={{ color: 'hsl(270, 50%, 40%)' }}>Journey</span>
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'hsl(25, 15%, 45%)' }}
          >
            A testament of faith that began with a vision to serve God and transform communities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 
              className="text-2xl font-semibold mb-6"
              style={{ color: 'hsl(25, 35%, 25%)' }}
            >
              <Church className="inline mr-3 w-6 h-6" style={{ color: 'hsl(270, 50%, 40%)' }} />
              Founded in Faith
            </h3>
            <p 
              className="mb-6 leading-relaxed"
              style={{ color: 'hsl(25, 15%, 45%)' }}
            >
              Kapsomoita Africa Gospel Church was born in 1995 out of a deep desire to serve God 
              and bring His love to the people of Kapsomoita and the surrounding regions. 
              What started as a small gathering of 12 believers under a mango tree has grown into 
              a vibrant community of over 500 faithful members.
            </p>
            <p 
              className="mb-6 leading-relaxed"
              style={{ color: 'hsl(25, 15%, 45%)' }}
            >
              Our church has been a cornerstone of spiritual revival in the region, providing not just 
              spiritual guidance but also practical support through various outreach programs, 
              education initiatives, and community development projects that have transformed lives.
            </p>
            
            {/* Interactive Timeline */}
            <div className="mt-10">
              <h4 
                className="text-lg font-medium mb-4"
                style={{ color: 'hsl(25, 35%, 25%)' }}
              >
                <Calendar className="inline mr-2 w-5 h-5" style={{ color: 'hsl(270, 50%, 40%)' }} />
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
                      backgroundColor: activeYear === item.year ? 'hsl(270, 50%, 40%)' : '',
                      color: activeYear === item.year ? 'white' : 'hsl(270, 50%, 40%)'
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
                  <p 
                    className="font-bold text-lg mb-1"
                    style={{ color: 'hsl(270, 50%, 40%)' }}
                  >
                    {activeTimelineItem.event}
                  </p>
                  <p style={{ color: 'hsl(25, 15%, 45%)' }}>{activeTimelineItem.description}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl p-8 relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-5" style={{ backgroundColor: 'hsl(270, 50%, 40%)' }}></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: 'hsl(280, 60%, 50%)' }}></div>
            
            <h3 
              className="text-2xl font-semibold mb-8 text-center relative z-10"
              style={{ color: 'hsl(25, 35%, 25%)' }}
            >
              Our Core Beliefs
            </h3>
            <ul className="space-y-6 relative z-10">
              {[
                {
                  icon: Book,
                  text: "The Bible as God's inspired, inerrant, and authoritative Word for faith and life"
                },
                {
                  icon: Heart,
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
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start group"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <item.icon 
                    className="w-6 h-6 mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" 
                    style={{ color: 'hsl(270, 50%, 40%)' }} 
                  />
                  <span style={{ color: 'hsl(25, 15%, 45%)' }} className="group-hover:text-purple-800 transition-colors">{item.text}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* Video section */}
            <div className="mt-10 relative z-10">
              <div 
                className="h-48 rounded-lg overflow-hidden relative cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=80" 
                  alt="Church video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8" style={{ color: 'hsl(270, 50%, 40%)' }} fill="currentColor" />
                  </div>
                </div>
                <p className="absolute bottom-4 left-4 text-white font-medium">Watch Our Story</p>
              </div>
            </div>
            
            <motion.div
              className="mt-10 text-center relative z-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                asChild
                className="group/btn"
                style={{
                  backgroundColor: 'hsl(270, 50%, 40%)',
                  color: 'hsl(45, 20%, 98%)'
                }}
              >
                <Link to="/contact" className="flex items-center justify-center">
                  Join Our Family <Heart className="ml-2 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowVideo(false)}
        >
          <motion.div 
            className="bg-white rounded-lg overflow-hidden w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Church Story Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 flex justify-end">
              <Button 
                onClick={() => setShowVideo(false)}
                variant="outline"
                style={{
                  borderColor: 'hsl(270, 50%, 40%)',
                  color: 'hsl(270, 50%, 40%)'
                }}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default ChurchStory;