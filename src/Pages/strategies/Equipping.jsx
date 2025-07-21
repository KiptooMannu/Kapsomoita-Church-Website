import { motion } from "framer-motion";
import { GraduationCap, Users, Target, ArrowLeft } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const Equipping = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              E4: Equipping Leaders
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Preparing and empowering servant leaders to advance God's kingdom effectively
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <GraduationCap className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Leadership Training</h3>
              <p className="text-gray-600 mb-4">
                We provide comprehensive leadership training programs that develop both 
                spiritual maturity and practical ministry skills for effective service.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Pastor training institutes</li>
                <li>• Elder development programs</li>
                <li>• Youth leadership camps</li>
                <li>• Women's ministry training</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Mentorship Programs</h3>
              <p className="text-gray-600 mb-4">
                Experienced leaders mentor emerging leaders, providing guidance, 
                accountability, and hands-on ministry experience.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• One-on-one mentoring relationships</li>
                <li>• Ministry apprenticeships</li>
                <li>• Leadership coaching sessions</li>
                <li>• Peer learning groups</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Leadership Development Track</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Identify</h4>
                <p className="text-gray-600 text-sm">
                  Recognizing leadership potential and spiritual gifts
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Train</h4>
                <p className="text-gray-600 text-sm">
                  Providing comprehensive biblical and practical training
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Deploy</h4>
                <p className="text-gray-600 text-sm">
                  Placing leaders in appropriate ministry positions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-gray-600 text-sm">
                  Ongoing mentorship and leadership development
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-semibold">Leadership Excellence</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Core Competencies</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Biblical knowledge & theology</li>
                  <li>• Pastoral care & counseling</li>
                  <li>• Public speaking & teaching</li>
                  <li>• Church administration</li>
                  <li>• Conflict resolution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Character Development</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Spiritual discipline & prayer</li>
                  <li>• Integrity & accountability</li>
                  <li>• Servant leadership</li>
                  <li>• Cultural sensitivity</li>
                  <li>• Vision & strategic thinking</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Leadership Impact</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                <p className="text-gray-600">Leaders Trained</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">75</div>
                <p className="text-gray-600">Active Pastors</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
                <p className="text-gray-600">Church Leaders</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Become a Leader</h3>
            <p className="text-gray-600 mb-6">
              Discover your leadership calling and join our training programs
            </p>
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Apply for Training
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Equipping;