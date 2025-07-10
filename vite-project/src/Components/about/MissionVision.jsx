import { motion } from "framer-motion";
import { Target, Star, Cross, Globe } from "lucide-react";

const MissionVision = () => {
  // ✅ Moved the array outside JSX to avoid JSX parsing issues
  const visionPoints = [
    "Thriving churches nurturing spiritual growth",
    "Families restored through biblical values",
    "Youth empowered to fulfill their God-given purpose",
    "Social justice and compassion in action"
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'hsla(35, 40%, 92%, 0.5)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Mission Block */}
          <motion.div
            className="rounded-xl p-8"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-6">
              <Target 
                className="w-10 h-10 mr-4 p-2 rounded-full" 
                style={{ 
                  color: 'hsl(25, 85%, 45%)',
                  backgroundColor: 'hsla(25, 85%, 45%, 0.1)'
                }} 
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: 'hsl(25, 35%, 25%)' }}
              >
                Our Mission
              </h2>
            </div>
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(25, 15%, 45%)' }}
            >
              To proclaim the Gospel of Jesus Christ throughout Africa and beyond, building a 
              vibrant community of believers who demonstrate God's love through worship, 
              discipleship, and compassionate service.
            </p>
            <div className="flex items-center">
              <Cross className="w-5 h-5 mr-2" style={{ color: 'hsl(25, 85%, 45%)' }} />
              <p style={{ color: 'hsl(25, 15%, 45%)' }}>
                <strong>Matthew 28:19-20</strong> — "Go therefore and make disciples..."
              </p>
            </div>
          </motion.div>

          {/* Vision Block */}
          <motion.div
            className="rounded-xl p-8"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center mb-6">
              <Star 
                className="w-10 h-10 mr-4 p-2 rounded-full" 
                style={{ 
                  color: 'hsl(25, 85%, 45%)',
                  backgroundColor: 'hsla(25, 85%, 45%, 0.1)'
                }} 
              />
              <h2 
                className="text-3xl font-bold"
                style={{ color: 'hsl(25, 35%, 25%)' }}
              >
                Our Vision
              </h2>
            </div>
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(25, 15%, 45%)' }}
            >
              To see transformed communities across Africa where Christ's love is evident through:
            </p>
            <ul className="space-y-3">
              {visionPoints.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Globe className="w-5 h-5 mr-3 mt-1" style={{ color: 'hsl(25, 85%, 45%)' }} />
                  <span style={{ color: 'hsl(25, 15%, 45%)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
