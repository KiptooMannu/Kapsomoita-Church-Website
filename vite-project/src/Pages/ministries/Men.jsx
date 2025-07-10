import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import { Link as ScrollLink } from 'react-scroll';
import menImage from '../../assets/men-ministry.jpg';

const Men = () => {
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
                  Men's Ministry
                </span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'hsl(25, 15%, 45%)' }}>
                Strengthening men in faith, character, and leadership through biblical fellowship.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  style={{
                    backgroundColor: 'hsl(25, 85%, 45%)',
                    color: 'hsl(45, 20%, 98%)'
                  }}
                >
                  <ScrollLink to="contact-form" smooth={true} duration={500} offset={-80}>
                    Contact Leaders
                  </ScrollLink>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: 'hsl(25, 85%, 45%)',
                    color: 'hsl(25, 85%, 45%)'
                  }}
                >
                  <ScrollLink to="events" smooth={true} duration={500} offset={-80}>
                    Upcoming Events
                  </ScrollLink>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src={menImage} 
                alt="Men's Ministry" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leaders" className="mb-20">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Bro. James Kariuki",
                role: "Ministry Head",
                bio: "Leading men's ministry since 2015 with a passion for discipleship",
                contact: "james@church.org"
              },
              {
                name: "Bro. Michael Omondi",
                role: "Bible Study Coordinator",
                bio: "Facilitating weekly men's Bible studies and small groups",
                contact: "michael@church.org"
              },
              {
                name: "Bro. Peter Maina",
                role: "Outreach Director",
                bio: "Organizing community service and evangelism initiatives",
                contact: "peter@church.org"
              }
            ].map((leader, index) => (
              <motion.div
                key={leader.name}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: 'hsl(35, 40%, 92%)' }}>
                  👨‍🦰
                </div>
                <h3 className="text-xl font-semibold mb-1" style={{ color: 'hsl(25, 25%, 15%)' }}>
                  {leader.name}
                </h3>
                <p className="text-sm mb-3" style={{ color: 'hsl(25, 85%, 45%)' }}>
                  {leader.role}
                </p>
                <p className="text-sm mb-4" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  {leader.bio}
                </p>
                <a 
                  href={`mailto:${leader.contact}`}
                  className="text-sm underline" 
                  style={{ color: 'hsl(25, 85%, 45%)' }}
                >
                  {leader.contact}
                </a>
              </motion.div>
            ))}
          </div>
        </section>

      {/* Direct Contact Section */}
<section id="contact-form" className="mb-20">
  <motion.div
    className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-2xl mx-auto text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h2 className="text-2xl font-bold mb-6" style={{ color: 'hsl(25, 35%, 25%)' }}>
      Contact the Men's Ministry Chair
    </h2>
    <p className="text-md mb-4 text-gray-600">
      For inquiries, prayer requests, or to get involved with our programs, please reach out to our Men's Ministry Chair directly.
    </p>

    <div className="mb-6">
      <p className="text-lg font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>Bro. James Kariuki</p>
      <p className="text-sm text-gray-600 mb-1">Ministry Chair</p>
      <a href="mailto:james@church.org" className="text-orange-600 underline block mb-1">
        james@church.org
      </a>
      <a href="tel:+254712345678" className="text-orange-600 underline">
        +254 712 345 678
      </a>
    </div>

    <Button 
      asChild
      style={{
        backgroundColor: 'hsl(25, 85%, 45%)',
        color: 'hsl(45, 20%, 98%)'
      }}
    >
      <a href="tel:+254712345678">Call Now</a>
    </Button>
  </motion.div>
</section>

      </div>
    </div>
  );
};

export default Men;