  import { motion } from "framer-motion";
  import Navbar from "../Components/Navbar";
  import { Button } from "../Components/ui/button";
  import { Link } from "react-router-dom";
  import MissionVision from "../Components/about/MissionVision";
  import ChurchStory from "../Components/about/ChurchStory";
  import ChurchValues from "../Components/about/ChurchValues";
  import { Church, Cross, HeartHandshake, BookOpen, Users } from "lucide-react";

  const About = () => {
    const stats = [
      { value: "200+", label: "Members", icon: Users },
      { value: "15", label: "Ministries", icon: HeartHandshake },
      { value: "52", label: "Sermons/Yr", icon: BookOpen },
      { value: "1995", label: "Founded", icon: Church }
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: 'hsl(45, 20%, 98%)' }}>
    
        {/* Hero Section */}
        <section 
          className="relative py-28"
          style={{
            background: 'linear-gradient(180deg, hsl(45, 25%, 97%), hsl(45, 20%, 98%))'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: 'hsl(25, 25%, 15%)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About{" "}
              <span 
                style={{
                  background: 'linear-gradient(135deg, hsl(25, 85%, 45%), hsl(35, 90%, 65%))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Our Church
              </span>
            </motion.h1>
            <motion.p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: 'hsl(25, 15%, 45%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Learn about our history, mission, and the heart behind Kapsomoita Africa Gospel Church
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <stat.icon 
                    className="w-10 h-10 mx-auto mb-3" 
                    style={{ color: 'hsl(25, 85%, 45%)' }} 
                  />
                  <p className="text-3xl font-bold" style={{ color: 'hsl(25, 35%, 25%)' }}>
                    {stat.value}
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <MissionVision />
        <ChurchStory />
        <ChurchValues />

        {/* Leadership Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: 'hsl(25, 35%, 25%)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Meet Our Leadership
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="h-48 bg-gray-100 flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(35, 40%, 92%)' }}
                  >
                    <Cross className="w-12 h-12" style={{ color: 'hsl(25, 85%, 45%)' }} />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>
                      Pastor {item === 1 ? 'John Mwangi' : item === 2 ? 'Sarah Wambui' : 'James Kariuki'}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'hsl(25, 85%, 45%)' }}>
                      {item === 1 ? 'Senior Pastor' : item === 2 ? 'Worship Leader' : 'Youth Minister'}
                    </p>
                    <p className="text-sm mt-3" style={{ color: 'hsl(25, 15%, 45%)' }}>
                      {item === 1 
                        ? 'Leading our congregation since 2010' 
                        : item === 2 
                        ? 'Guiding our worship ministry' 
                        : 'Empowering the next generation'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section 
          className="py-20"
          style={{
            background: 'linear-gradient(135deg, hsl(25, 85%, 45%), hsl(35, 90%, 65%))'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: 'hsl(45, 20%, 98%)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join Our Family
            </motion.h2>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{ color: 'hsla(45, 20%, 98%, 0.9)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Experience the love of Christ and become part of our growing community. 
              Everyone is welcome at Kapsomoita Africa Gospel Church.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg"
                asChild
                style={{
                  backgroundColor: 'hsl(45, 20%, 98%)',
                  color: 'hsl(25, 35%, 25%)',
                  boxShadow: '0 4px 20px hsla(45, 20%, 98%, 0.2)'
                }}
              >
                <Link to="/contact">Visit Us This Sunday</Link>
              </Button>
              <Button 
                size="lg"
                asChild
                style={{
                  backgroundColor: 'hsl(25, 35%, 25%)',
                  color: 'hsl(45, 20%, 98%)',
                  boxShadow: '0 4px 20px hsla(25, 35%, 25%, 0.2)'
                }}
              >
                <Link to="/events">See Upcoming Events</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  };

  export default About;