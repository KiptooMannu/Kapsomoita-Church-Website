import { motion } from "framer-motion";
import { Heart, Users, Globe, ArrowLeft } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const Evangelizing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              E1: Evangelizing the Lost
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reaching out with God's love to bring hope and salvation to those who need it most
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Community Outreach</h3>
              <p className="text-gray-600 mb-4">
                We actively engage with our local community through street evangelism, 
                community events, and door-to-door ministry to share the Gospel message.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Weekly street evangelism</li>
                <li>• Community health programs</li>
                <li>• Youth outreach initiatives</li>
                <li>• Prison ministry</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Globe className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Global Mission</h3>
              <p className="text-gray-600 mb-4">
                Our evangelistic mission extends beyond borders as we support 
                missionaries and plant churches across Africa and beyond.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Cross-cultural missions</li>
                <li>• Church planting support</li>
                <li>• Missionary training</li>
                <li>• International partnerships</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Our Approach to Evangelism</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Relationship Building</h4>
                <p className="text-gray-600 text-sm">
                  Building genuine relationships and trust within communities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Gospel Presentation</h4>
                <p className="text-gray-600 text-sm">
                  Sharing the Good News with love, clarity, and cultural sensitivity
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Follow-up & Discipleship</h4>
                <p className="text-gray-600 text-sm">
                  Nurturing new believers and integrating them into the church family
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Join Our Evangelistic Mission</h3>
            <p className="text-gray-600 mb-6">
              Be part of God's great commission and help us reach the lost with His love
            </p>
            <Button 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Get Involved
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Evangelizing;