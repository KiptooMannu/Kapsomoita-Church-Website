import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import womenImage from '../../assets/women-ministry.jpg'; // Your image
import leader1 from '../../assets/women-ministry.jpg';
import leader2 from '../../assets/women-ministry.jpg';

const Women = () => {
  const contact = {
    phone: "+254-712-345-678",
    email: "women@kapsomoitachurch.org"
  };

  const leaders = [
    {
      name: "Mama Grace Wanjiku",
      role: "Chairlady",
      message: "We welcome every woman to join us as we grow in faith, love, and service.",
      image: leader1
    },
    {
      name: "Eunice Kiprotich",
      role: "Prayer Coordinator",
      message: "Prayer changes everything — come be part of our intercessory fellowship.",
      image: leader2
    },
  ];

  const activities = [
    {
      title: "Weekly Bible Study",
      description: "Every Tuesday at 10 AM in the fellowship hall",
      icon: "✝️"
    },
    {
      title: "Prayer Breakfast",
      description: "Monthly gathering for prayer and fellowship",
      icon: "🙏"
    },
    {
      title: "Retreats",
      description: "Annual spiritual retreat in the mountains",
      icon: "⛰️"
    }
  ];

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: 'hsl(45, 20%, 98%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="relative mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'hsl(25, 25%, 15%)' }}>
                <span 
                  style={{
                    background: 'linear-gradient(135deg, hsl(25, 85%, 45%), hsl(35, 90%, 65%))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Women's Ministry
                </span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'hsl(25, 15%, 45%)' }}>
                Building godly women through fellowship, Bible study, and prayer.
              </p>
              <Button 
                size="lg"
                asChild
                style={{
                  backgroundColor: 'hsl(25, 85%, 45%)',
                  color: 'hsl(45, 20%, 98%)'
                }}
              >
                <a href={`mailto:${contact.email}`}>
                  Join Our Women's Group
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src={womenImage} 
                alt="Women's Ministry" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Activities
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((program, index) => (
              <motion.div
                key={program.title}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(25, 25%, 15%)' }}>
                  {program.title}
                </h3>
                <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaders Section */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Leaders
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-6 items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 object-cover rounded-full border border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'hsl(25, 25%, 15%)' }}>{leader.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'hsl(25, 15%, 45%)' }}>{leader.role}</p>
                  <p className="text-sm italic" style={{ color: 'hsl(25, 15%, 45%)' }}>"{leader.message}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <motion.h2 
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Contact Us
          </motion.h2>

          <div className="text-center space-y-4">
            <p className="text-lg" style={{ color: 'hsl(25, 15%, 45%)' }}>
              Reach out to join or learn more about our Women's Ministry
            </p>
            <p>
              📞 <a href={`tel:${contact.phone}`} className="text-lg text-primary font-semibold">{contact.phone}</a>
            </p>
            <p>
              📧 <a href={`mailto:${contact.email}`} className="text-lg text-primary font-semibold">{contact.email}</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Women;
