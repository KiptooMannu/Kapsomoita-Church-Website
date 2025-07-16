import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';


const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      value: "info@churchdomain.com",
      href: "mailto:info@churchdomain.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      value: "+254 712 345 678",
      href: "tel:+254712345678",
      description: "Mon-Fri, 9am-5pm"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      value: "123 Chebole, Bomet",
      href: "https://maps.google.com?q=123+Faith+Avenue,+Nairobi",
      description: "Get directions to our location"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Service Times",
      value: "Sunday: 8am & 10:30am",
      href: "#",
      description: "Wednesday Prayer: 5:30pm"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Get In <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you. Reach out through any of these channels.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
              
              {item.href !== "#" ? (
                <a 
                  href={item.href}
                  className="block group"
                >
                  <p className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors mb-2">
                    {item.value}
                  </p>
                </a>
              ) : (
                <p className="text-gray-800 font-medium mb-2">
                  {item.value}
                </p>
              )}
              
              <p className="text-gray-500 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl overflow-hidden shadow-lg border border-gray-200"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808156238038!2d36.82154831533049!3d-1.2923595359796903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664f5f5e7%3A0x4e35e6a5e6a5e6a5!2sNairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Church Location Map"
            className="rounded-xl"
          ></iframe>
        </motion.div>

        {/* Service Times Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-blue-50 rounded-xl p-8 text-center"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Weekly Service Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-600 mb-2">Sunday</h4>
              <p className="text-gray-700">Morning Service: 8:00am</p>
              <p className="text-gray-700">Main Service: 10:30am</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-600 mb-2">Wednesday</h4>
              <p className="text-gray-700">Bible Study: 5:30pm</p>
              <p className="text-gray-700">Prayer Meeting: 6:30pm</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-600 mb-2">Friday</h4>
              <p className="text-gray-700">Youth Service: 4:00pm</p>
              <p className="text-gray-700">Choir Practice: 6:00pm</p>
            </div>
          </div>
        </motion.div>
      </div>
      
    </section>
    
  );
};

export default Contact;