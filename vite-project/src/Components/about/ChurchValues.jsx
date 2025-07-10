// ChurchValues.jsx
import { motion } from "framer-motion";
import { Heart, Users, Book, Globe, Target, Star, Cross, HandHeart,  Handshake } from "lucide-react";

const ChurchValues = () => {
  const values = [
    {
      icon: Cross,
      title: "Christ-Centered",
      description: "We keep Jesus at the center of all we do, seeking to glorify Him in our worship, relationships, and service."
    },
    {
        icon: Book, // or Book
        title: "Bible-Based",
        description: "We are committed to the authority of Scripture as our guide for faith and practice."
      },
      
    {
      icon: Heart,
      title: "Love",
      description: "We demonstrate Christ's love through compassion, forgiveness, and sacrificial service."
    },
    {
      icon: Users,
      title: "Community",
      description: "We cultivate authentic relationships that foster spiritual growth and mutual support."
    },
    {
      icon: Handshake,
      title: "Unity",
      description: "We celebrate diversity while maintaining the unity of the Spirit in the bond of peace."
    },
    {
      icon: Globe,
      title: "Mission",
      description: "We actively participate in God's mission locally and globally through evangelism and discipleship."
    },
    {
      icon: Target,
      title: "Purpose",
      description: "We live intentionally as God's people, using our gifts to build His kingdom."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We offer God our best in worship, ministry, and stewardship of resources."
    },
    {
      icon: HandHeart,
      title: "Service",
      description: "We follow Jesus' example of humble service to meet physical and spiritual needs."
    }
  ];

  return (
    <section 
      className="py-20"
      style={{ backgroundColor: 'hsl(45, 20%, 98%)' }}
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
            Our Guiding Values
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'hsl(25, 15%, 45%)' }}
          >
            The biblical principles that shape our identity and direct our ministry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="rounded-xl p-8 text-center"
              style={{
                backgroundColor: 'hsl(45, 20%, 98%)',
                boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.05)',
                border: '1px solid hsl(35, 20%, 88%)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.floor(index/3) * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 8px 25px hsla(25, 85%, 45%, 0.1)'
              }}
            >
              <value.icon 
                className="w-12 h-12 mx-auto mb-4 p-2 rounded-full" 
                style={{ 
                  color: 'hsl(25, 85%, 45%)',
                  backgroundColor: 'hsla(25, 85%, 45%, 0.1)'
                }} 
              />
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: 'hsl(25, 35%, 25%)' }}
              >
                {value.title}
              </h3>
              <p style={{ color: 'hsl(25, 15%, 45%)' }}>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChurchValues;