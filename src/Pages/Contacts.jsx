import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

// ✅ Shared color scheme
const primaryPurple = "hsl(270, 50%, 40%)";
const accentPurple = "hsl(280, 60%, 50%)";
const darkText = "hsl(0, 0%, 15%)";
const mediumText = "hsl(0, 0%, 30%)";

const Contact = ({ asHomeSection = false }) => {
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      value: "info@kapsomoitagospel.org",
      href: "mailto:info@kapsomoitagospel.org",
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
      value: "Kapsomoita, Bomet County",
      href: "https://maps.google.com?q=Kapsomoita+Bomet",
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
    <section 
      id="contact" 
      className={`relative bg-white ${asHomeSection ? 'py-12' : 'py-20'}`}
    >
      {/* Animated background elements - only for standalone page */}
      {!asHomeSection && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: primaryPurple }}></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: accentPurple }}></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {asHomeSection ? (
            <>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">
                Contact <span style={{ color: primaryPurple }}>Us</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Reach out to us for any inquiries or visit our services
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Get In <span style={{ color: primaryPurple }}>Touch</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We'd love to hear from you. Reach out through any of these channels.
              </p>
            </>
          )}
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <div 
                  className="p-2 rounded-full mr-4"
                  style={{ 
                    backgroundColor: `${primaryPurple}15`,
                    color: primaryPurple
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>

              {item.href !== "#" ? (
                <a 
                  href={item.href} 
                  className="block group"
                  style={{ color: primaryPurple }}
                >
                  <p className="font-medium group-hover:underline transition-colors mb-2">
                    {item.value}
                  </p>
                </a>
              ) : (
                <p className="text-gray-800 font-medium mb-2">{item.value}</p>
              )}
              <p className="text-gray-500 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 rounded-xl overflow-hidden shadow-sm border border-gray-100"
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

        {/* Weekly Service Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-xl p-6 md:p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Weekly Service Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-3 text-lg" style={{ color: primaryPurple }}>Sunday</h4>
              <div className="space-y-2">
                <p className="text-gray-700 flex justify-between">
                  <span>Morning Service:</span>
                  <span className="font-medium">8:00am</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Main Service:</span>
                  <span className="font-medium">10:30am</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Sunday School:</span>
                  <span className="font-medium">9:00am</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-3 text-lg" style={{ color: primaryPurple }}>Wednesday</h4>
              <div className="space-y-2">
                <p className="text-gray-700 flex justify-between">
                  <span>Bible Study:</span>
                  <span className="font-medium">5:30pm</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Prayer Meeting:</span>
                  <span className="font-medium">6:30pm</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Choir Practice:</span>
                  <span className="font-medium">7:30pm</span>
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-3 text-lg" style={{ color: primaryPurple }}>Friday</h4>
              <div className="space-y-2">
                <p className="text-gray-700 flex justify-between">
                  <span>Youth Service:</span>
                  <span className="font-medium">4:00pm</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Ladies Fellowship:</span>
                  <span className="font-medium">6:00pm</span>
                </p>
                <p className="text-gray-700 flex justify-between">
                  <span>Men's Meeting:</span>
                  <span className="font-medium">7:00pm</span>
                </p>
              </div>
            </div>
          </div>

          {/* Special Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-gray-600">
              <span className="font-medium" style={{ color: primaryPurple }}>Note:</span> All are welcome to join our services. 
              Children's programs available during all Sunday services.
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Contact Form - Optional */}
        {!asHomeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Send Us a Message</h3>
            <form className="max-w-2xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: primaryPurple }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: primaryPurple }}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryPurple }}
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryPurple }}
              >
                Send Message
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Contact;