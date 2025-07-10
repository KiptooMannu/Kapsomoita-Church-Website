// ChurchStory.jsx
import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import { Heart, Book, Users, Globe, Calendar, Church } from "lucide-react";
import { Link } from "react-router-dom";

const ChurchStory = () => {
  const timeline = [
    {
      year: "1995",
      event: "Church Founding",
      description: "Started as a small prayer group under a tree in Kapsopmoita village"
    },
    {
      year: "2002",
      event: "First Sanctuary",
      description: "Built our first permanent structure with mud walls and iron sheets"
    },
    {
      year: "2010",
      event: "Community Outreach",
      description: "Launched our first major community development programs"
    },
    {
      year: "2018",
      event: "Current Sanctuary",
      description: "Dedicated our new 500-seat worship center"
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'hsla(35, 40%, 92%, 0.3)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'hsl(25, 35%, 25%)' }}
          >
            Our Sacred Journey
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
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 
              className="text-2xl font-semibold mb-6"
              style={{ color: 'hsl(25, 35%, 25%)' }}
            >
              <Church className="inline mr-3 w-6 h-6" style={{ color: 'hsl(25, 85%, 45%)' }} />
              Founded in Faith
            </h3>
            <p 
              className="mb-6 leading-relaxed"
              style={{ color: 'hsl(25, 15%, 45%)' }}
            >
              Kapsopmoita Africa Gospel Church was born in 1995 out of a deep desire to serve God 
              and bring His love to the people of Kapsopmoita and the surrounding regions. 
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
            
            <div className="mt-10">
              <h4 
                className="text-lg font-medium mb-4"
                style={{ color: 'hsl(25, 35%, 25%)' }}
              >
                <Calendar className="inline mr-2 w-5 h-5" style={{ color: 'hsl(25, 85%, 45%)' }} />
                Our Timeline
              </h4>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    className="pl-6 border-l-2"
                    style={{ borderColor: 'hsl(25, 85%, 45%)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <p 
                      className="font-bold"
                      style={{ color: 'hsl(25, 85%, 45%)' }}
                    >
                      {item.year}
                    </p>
                    <p 
                      className="font-medium"
                      style={{ color: 'hsl(25, 35%, 25%)' }}
                    >
                      {item.event}
                    </p>
                    <p style={{ color: 'hsl(25, 15%, 45%)' }}>{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl p-8"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <h3 
              className="text-2xl font-semibold mb-8 text-center"
              style={{ color: 'hsl(25, 35%, 25%)' }}
            >
              Our Core Beliefs
            </h3>
            <ul className="space-y-6">
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
                  className="flex items-start"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <item.icon 
                    className="w-6 h-6 mr-4 mt-1 flex-shrink-0" 
                    style={{ color: 'hsl(25, 85%, 45%)' }} 
                  />
                  <span style={{ color: 'hsl(25, 15%, 45%)' }}>{item.text}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button 
                asChild
                style={{
                  backgroundColor: 'hsl(25, 85%, 45%)',
                  color: 'hsl(45, 20%, 98%)'
                }}
              >
                <Link to="/contact" className="flex items-center justify-center">
                  Join Our Family <Heart className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChurchStory;