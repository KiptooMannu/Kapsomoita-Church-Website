import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import youthImage from '../../assets/youth-ministry.jpg';
import leader1 from '../../assets/youth-ministry.jpg';
import leader2 from '../../assets/youth-ministry.jpg';

const Youth = () => {
  const contact = {
    phone: "+254-700-123-456",
    email: "youth@kapsomoitachurch.org"
  };

  const leaders = [
    {
      name: "John Kipkemoi",
      role: "Youth Pastor",
      message: "Our mission is to guide young people to live boldly for Christ.",
      image: leader1
    },
    {
      name: "Faith Cherop",
      role: "Youth Worship Leader",
      message: "Worship is our weapon, and the youth are rising up with purpose.",
      image: leader2
    }
  ];

  const programs = [
    {
      title: "Friday Night Live",
      description: "Weekly worship and teaching sessions every Friday at 7 PM",
      icon: "🎵"
    },
    {
      title: "Bible Study",
      description: "In-depth Scripture study every Wednesday evening",
      icon: "📖"
    },
    {
      title: "Missions Trips",
      description: "Annual mission opportunities to serve communities",
      icon: "🌍"
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
                  Youth Ministry
                </span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'hsl(25, 15%, 45%)' }}>
                Empowering the next generation of believers through fellowship, worship, and discipleship.
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
                  Join Our Youth Group
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
                src={youthImage} 
                alt="Youth Ministry" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Programs */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Programs
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
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

        {/* Leaders */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our Youth Leaders
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

        {/* Testimonials */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Youth Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah K.",
                quote: "The youth ministry helped me grow in my faith and find amazing Christian friends.",
                role: "Member since 2019"
              },
              {
                name: "David M.",
                quote: "The mission trips changed my perspective on serving others in Christ's name.",
                role: "Member since 2020"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-lg italic mb-6" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>
                    {testimonial.name}
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
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
              Reach out to learn more about our Youth Ministry
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

export default Youth;
