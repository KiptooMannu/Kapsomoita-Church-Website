import { motion, useInView } from "framer-motion";
import { Target, Star, Cross, Globe, BookOpen, Users, Heart, ArrowRight } from "lucide-react";
import { useRef } from "react";

const MissionVision = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const visionPoints = [
    {
      icon: Users,
      text: "Thriving churches nurturing spiritual growth"
    },
    {
      icon: Heart,
      text: "Families restored through biblical values"
    },
    {
      icon: Star,
      text: "Youth empowered to fulfill their God-given purpose"
    },
    {
      icon: Globe,
      text: "Social justice and compassion in action"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: 'hsla(35, 40%, 92%, 0.5)' }} ref={ref}>
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-10"
        style={{ backgroundColor: 'hsl(270, 50%, 40%)' }}
        animate={{ 
          scale: [1, 1.5, 1],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-16 h-16 rounded-full opacity-10"
        style={{ backgroundColor: 'hsl(280, 60%, 50%)' }}
        animate={{ 
          scale: [1, 1.8, 1],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mission Block */}
          <motion.div
            className="rounded-xl p-8 relative overflow-hidden group"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(270, 50%, 40%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-5" style={{ backgroundColor: 'hsl(270, 50%, 40%)' }}></div>
            
            <div className="flex items-center mb-6">
              <Target
                className="w-10 h-10 mr-4 p-2 rounded-full"
                style={{
                  color: 'hsl(270, 50%, 40%)',
                  backgroundColor: 'hsla(270, 50%, 40%, 0.1)'
                }}
              />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(25, 35%, 25%)' }}>
                Our Mission
              </h2>
            </div>
            <p className="text-lg leading-relaxed mb-6" style={{ color: 'hsl(25, 15%, 45%)' }}>
              The purpose of the Africa Gospel Church is to fulfill the Great Commandment and Great Commission of the Lord Jesus Christ according to the Great Plan.
            </p>
            <div className="flex items-center">
              <Cross className="w-5 h-5 mr-2" style={{ color: 'hsl(270, 50%, 40%)' }} />
              <p style={{ color: 'hsl(25, 15%, 45%)' }}>
                <strong>Matthew 28:19-20</strong> — "Go therefore and make disciples..."
              </p>
            </div>
            
            {/* Interactive element */}
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'hsla(270, 50%, 40%, 0.05)' }}>
              <p className="font-semibold mb-2 flex items-center" style={{ color: 'hsl(270, 50%, 40%)' }}>
                <BookOpen className="w-4 h-4 mr-2" />
                How we live out our mission:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li style={{ color: 'hsl(25, 15%, 45%)' }}>Weekly worship services</li>
                <li style={{ color: 'hsl(25, 15%, 45%)' }}>Community outreach programs</li>
                <li style={{ color: 'hsl(25, 15%, 45%)' }}>Discipleship training</li>
                <li style={{ color: 'hsl(25, 15%, 45%)' }}>Mission trips and partnerships</li>
              </ul>
            </div>
          </motion.div>

          {/* Vision Block */}
          <motion.div
            className="rounded-xl p-8 relative overflow-hidden group"
            style={{
              backgroundColor: 'hsl(45, 20%, 98%)',
              boxShadow: '0 4px 20px hsla(270, 50%, 40%, 0.1)',
              border: '1px solid hsl(35, 20%, 88%)'
            }}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: 'hsl(280, 60%, 50%)' }}></div>
            
            <div className="flex items-center mb-6">
              <Star
                className="w-10 h-10 mr-4 p-2 rounded-full"
                style={{
                  color: 'hsl(270, 50%, 40%)',
                  backgroundColor: 'hsla(270, 50%, 40%, 0.1)'
                }}
              />
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(25, 35%, 25%)' }}>
                Our Vision
              </h2>
            </div>
            <p className="text-lg leading-relaxed mb-6" style={{ color: 'hsl(25, 15%, 45%)' }}>
              The Whole Church taking the Whole Gospel to the Whole World.
              (Swahili: KANISA LOTE, likieneza INJILI YOTE, ULIMWENGUNI KOTE)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {visionPoints.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-3 rounded-lg bg-white border border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3 mt-1 flex-shrink-0" style={{ color: 'hsl(270, 50%, 40%)' }} />
                  <span style={{ color: 'hsl(25, 15%, 45%)' }}>{item.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Call to action */}
            <motion.div
              className="mt-6 p-4 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: 'hsla(270, 50%, 40%, 0.05)' }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="font-medium" style={{ color: 'hsl(25, 35%, 25%)' }}>
                Join us in fulfilling our vision
              </p>
              <button className="flex items-center text-sm font-semibold" style={{ color: 'hsl(270, 50%, 40%)' }}>
                Get involved <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;