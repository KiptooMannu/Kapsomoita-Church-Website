import { motion } from "framer-motion";
import { Church, Users, Map, ArrowLeft } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const Establishing = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Church className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              E2: Establishing Churches
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building strong, sustainable church communities that serve as beacons of faith
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Church className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Church Planting</h3>
              <p className="text-gray-600 mb-4">
                We strategically plant new churches in communities that need a Gospel presence, 
                focusing on sustainable growth and local leadership development.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Strategic location assessment</li>
                <li>• Community needs analysis</li>
                <li>• Initial core group formation</li>
                <li>• Building acquisition & setup</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Leadership Development</h3>
              <p className="text-gray-600 mb-4">
                Every new church needs strong, God-fearing leaders. We invest heavily 
                in training and mentoring local leaders for long-term sustainability.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Pastor training programs</li>
                <li>• Elder & deacon development</li>
                <li>• Ministry team building</li>
                <li>• Leadership succession planning</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Church Establishment Process</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Survey & Assess</h4>
                <p className="text-gray-600 text-sm">
                  Identifying communities in need of Gospel ministry
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Plant & Nurture</h4>
                <p className="text-gray-600 text-sm">
                  Starting worship services and building initial congregation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Train Leaders</h4>
                <p className="text-gray-600 text-sm">
                  Developing local leadership and ministry teams
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Establish Independence</h4>
                <p className="text-gray-600 text-sm">
                  Transitioning to self-sustaining, self-governing church
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Map className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-semibold">Our Church Network</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <p className="text-gray-600">Churches Established</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <p className="text-gray-600">Pastors Trained</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
                <p className="text-gray-600">Lives Impacted</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Support Church Planting</h3>
            <p className="text-gray-600 mb-6">
              Partner with us to establish new churches and expand God's kingdom
            </p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Partner With Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Establishing;