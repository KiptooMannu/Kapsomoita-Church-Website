import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, HeartHandshake, HandHeart } from "lucide-react";

// ✅ Shared color scheme
const primaryPurple = "hsl(270, 50%, 40%)";
const accentPurple = "hsl(280, 60%, 50%)";

const Serve = () => {
  const ministries = [
    { name: "Worship Team", icon: "🎵", color: "bg-purple-100 text-purple-600" },
    { name: "Children's Ministry", icon: "👶", color: "bg-blue-100 text-blue-600" },
    { name: "Ushering", icon: "🤝", color: "bg-green-100 text-green-600" },
    { name: "Youth Ministry", icon: "🎯", color: "bg-orange-100 text-orange-600" },
    { name: "Men's Ministry", icon: "👨", color: "bg-indigo-100 text-indigo-600" },
    { name: "Women's Ministry", icon: "👩", color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <section id="serve" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <HeartHandshake className="w-10 h-10 mr-3" style={{ color: primaryPurple }} />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Serve <span style={{ color: primaryPurple }}>With Us</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your calling and join a ministry that matches your gifts and passion
          </p>
        </motion.div>

        {/* Main Content Card */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Column - Text */}
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Find Your Place in God's House
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                At Kapsomoita Africa Gospel Church, we believe every believer has a unique 
                <span className="font-semibold text-gray-800"> God-given purpose and spiritual gifts</span> 
                {" "}to contribute to the body of Christ. Whether you're passionate about worship, 
                teaching children, welcoming guests, or supporting your peers, there's a special 
                place for you here.
              </p>

              <p className="text-gray-600 leading-relaxed mb-8">
                Our ministries are designed to help you grow in faith while making a tangible 
                difference in our community. When you serve, you're not just filling a role — 
                you're <span className="font-semibold text-gray-800">partnering with God</span> to 
                transform lives and spread Christ's love.
              </p>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <HandHeart className="w-5 h-5 mr-2" style={{ color: primaryPurple }} />
                  Benefits of Serving
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                    Spiritual growth and maturity
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                    Meaningful relationships
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                    Discovering your gifts
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                    Making eternal impact
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/serve"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                  style={{ backgroundColor: primaryPurple }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  JOIN A MINISTRY TEAM
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Ministries Grid */}
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              <h3 className="text-xl font-bold mb-6 text-gray-800 text-center">
                Ministry Areas
              </h3>
              
              <div className="space-y-4">
                {ministries.map((ministry, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-purple-300 transition-colors cursor-pointer group"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-2xl mr-4">{ministry.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {ministry.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {index === 0 && "Lead worship and praise"}
                        {index === 1 && "Teach and nurture children"}
                        {index === 2 && "Welcome and assist guests"}
                        {index === 3 && "Engage and mentor youth"}
                        {index === 4 && "Strengthen and support men"}
                        {index === 5 && "Empower and encourage women"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ministry.color}`}>
                      Join
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">150+</p>
                    <p className="text-xs text-gray-500">Volunteers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">12</p>
                    <p className="text-xs text-gray-500">Ministries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-xs text-gray-500">Impact</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial/Quote */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-xl italic text-gray-700 mb-4">
              "Serving in the children's ministry has been one of the most rewarding experiences 
              of my life. Watching young hearts grow in faith reminds me why we do what we do."
            </p>
            <footer className="text-gray-600">
              <span className="font-semibold">Sarah M.</span> – Children's Ministry Leader
            </footer>
          </blockquote>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            Not sure where to serve? Take our <span className="font-semibold" style={{ color: primaryPurple }}>spiritual gifts assessment</span> 
            {" "}or speak with one of our ministry leaders to find your perfect fit.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/serve"
              className="px-6 py-3 rounded-full font-medium border hover:bg-gray-50 transition-colors"
              style={{ borderColor: primaryPurple, color: primaryPurple }}
            >
              Spiritual Gifts Test
            </Link>
            <Link
              to="/serve"
              className="px-6 py-3 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Talk to a Leader
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Serve;