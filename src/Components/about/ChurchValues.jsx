import { motion } from "framer-motion";
import { Heart, Users, Book, Globe, Target, Star, Cross, HandHeart, Handshake, Church } from "lucide-react";

const ChurchValues = () => {
  const values = [
    {
      icon: Cross,
      title: "Faith",
      description: "Rooted in Christ since our humble beginning under a tree, faith remains our foundation."
    },
    {
      icon: Church,
      title: "Worship",
      description: "From our first sanctuary to our current center, we gather to glorify God in spirit and truth."
    },
    {
      icon: Book,
      title: "Scripture",
      description: "We rely on the Bible as God’s inspired Word to guide every step of our journey."
    },
    {
      icon: HandHeart,
      title: "Service",
      description: "Like our 2010 outreach programs, we serve the community with compassion and love."
    },
    {
      icon: Users,
      title: "Community",
      description: "We are a family of believers united in Christ, supporting one another in faith and life."
    },
    {
      icon: Handshake,
      title: "Unity",
      description: "We celebrate diversity while remaining one body in Christ."
    },
    {
      icon: Globe,
      title: "Mission",
      description: "We carry the Gospel beyond Kapsomoita, reaching out locally and globally."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Our new sanctuary reflects our call to give God our best in worship and stewardship."
    },
    {
      icon: Target,
      title: "Purpose",
      description: "We live intentionally, using our gifts to fulfill God’s calling and expand His kingdom."
    }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: 'hsl(45, 20%, 98%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'hsl(25, 35%, 25%)' }}>
            Our Guiding Values
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'hsl(25, 15%, 45%)' }}>
            Shaped by our history, these biblical values direct our ministry and mission today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="rounded-xl p-8 text-center"
              style={{
                backgroundColor: 'hsl(45, 20%, 98%)',
                boxShadow: '0 4px 20px hsla(270, 50%, 40%, 0.05)',
                border: '1px solid hsl(35, 20%, 88%)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.floor(index / 3) * 0.2 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: '0 8px 25px hsla(270, 50%, 40%, 0.1)'
              }}
            >
              <value.icon
                className="w-12 h-12 mx-auto mb-4 p-2 rounded-full"
                style={{
                  color: 'hsl(270, 50%, 40%)',
                  backgroundColor: 'hsla(270, 50%, 40%, 0.1)'
                }}
              />
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'hsl(25, 35%, 25%)' }}>
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
