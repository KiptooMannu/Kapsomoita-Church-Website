import { motion, useInView } from "framer-motion";
import { Heart, Users, Book, Globe, Target, Star, Cross, HandHeart, Handshake, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

const ChurchValues = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeValue, setActiveValue] = useState(null);

  const values = [
    {
      icon: Cross,
      title: "Christ-Centered",
      description: "We keep Jesus at the center of all we do, seeking to glorify Him in our worship, relationships, and service.",
      verse: "Colossians 1:18",
      color: "hsl(270, 50%, 40%)"
    },
    {
      icon: Book,
      title: "Bible-Based",
      description: "We are committed to the authority of Scripture as our guide for faith and practice.",
      verse: "2 Timothy 3:16-17",
      color: "hsl(280, 60%, 50%)"
    },
    {
      icon: Heart,
      title: "Love",
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
    },
    {
      icon: Handshake,
      title: "Unity",
      description: "We celebrate diversity while maintaining the unity of the Spirit in the bond of peace.",
      verse: "Ephesians 4:3",
      color: "hsl(310, 70%, 50%)"
    },
    {
      icon: Globe,
      title: "Mission",
      description: "We actively participate in God's mission locally and globally through evangelism and discipleship.",
      verse: "Matthew 28:19-20",
      color: "hsl(320, 70%, 50%)"
    },
    {
      icon: Target,
      title: "Purpose",
      description: "We live intentionally as God's people, using our gifts to build His kingdom.",
      verse: "Ephesians 2:10",
      color: "hsl(330, 70%, 50%)"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We offer God our best in worship, ministry, and stewardship of resources.",
      verse: "Colossians 3:23",
      color: "hsl(340, 70%, 50%)"
    },
    {
      icon: HandHeart,
      title: "Service",
      description: "We follow Jesus' example of humble service to meet physical and spiritual needs.",
      verse: "Mark 10:45",
      color: "hsl(350, 70%, 50%)"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: 'hsl(45, 20%, 98%)' }} ref={ref}>
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-5"
        style={{ backgroundColor: 'hsl(270, 50%, 40%)' }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-5"
        style={{ backgroundColor: 'hsl(280, 60%, 50%)' }}
        animate={{ scale: [1, 1.8, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'hsl(25, 35%, 25%)' }}>
            Our Guiding <span style={{ color: 'hsl(270, 50%, 40%)' }}>Values</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'hsl(25, 15%, 45%)' }}>
            The biblical principles that shape our identity and direct our ministry
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                className="rounded-xl p-8 text-center group cursor-pointer relative overflow-hidden"
                style={{
                  backgroundColor: 'hsl(45, 20%, 98%)',
                  boxShadow: '0 4px 20px hsla(270, 50%, 40%, 0.05)',
                  border: '1px solid hsl(35, 20%, 88%)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: Math.floor(index / 3) * 0.2 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 8px 25px hsla(270, 50%, 40%, 0.1)'
                }}
                onClick={() => setActiveValue(index)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                
                <Icon
                  className="w-12 h-12 mx-auto mb-4 p-2 rounded-full relative z-10"
                  style={{
                    color: value.color,
                    backgroundColor: `${value.color}15`
                  }}
                />
                <h3 className="text-xl font-semibold mb-3 relative z-10" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  {value.title}
                </h3>
                <p className="relative z-10" style={{ color: 'hsl(25, 15%, 45%)' }}>{value.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                  <p className="text-sm italic" style={{ color: value.color }}>
                    {value.verse}
                  </p>
                </div>
                
                <ChevronRight 
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  size={16} 
                  style={{ color: value.color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Value Detail Modal */}
        {activeValue !== null && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setActiveValue(null)}
          >
            <motion.div 
              className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                border: `2px solid ${values[activeValue].color}20`
              }}
            >
              {(() => {
                const Icon = values[activeValue].icon;
                return (
                  <div className="flex items-center mb-6">
                    <Icon
                      className="w-12 h-12 mr-4 p-2 rounded-full"
                      style={{
                        color: values[activeValue].color,
                        backgroundColor: `${values[activeValue].color}15`
                      }}
                    />
                    <h3 className="text-2xl font-bold" style={{ color: 'hsl(25, 35%, 25%)' }}>
                      {values[activeValue].title}
                    </h3>
                    <button 
                      className="ml-auto text-gray-400 hover:text-gray-600"
                      onClick={() => setActiveValue(null)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })()}

              <p className="mb-6" style={{ color: 'hsl(25, 15%, 45%)' }}>
                {values[activeValue].description}
              </p>
              
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: `${values[activeValue].color}10` }}>
                <p className="font-semibold mb-2" style={{ color: values[activeValue].color }}>
                  Biblical Foundation:
                </p>
                <p className="italic" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  "{values[activeValue].verse}"
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  How we live this out:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li style={{ color: 'hsl(25, 15%, 45%)' }}>Regular Bible study and application</li>
                  <li style={{ color: 'hsl(25, 15%, 45%)' }}>Prayerful decision-making</li>
                  <li style={{ color: 'hsl(25, 15%, 45%)' }}>Service opportunities in the community</li>
                  <li style={{ color: 'hsl(25, 15%, 45%)' }}>Accountability partnerships</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ChurchValues;
                                                                                      