import { motion } from "framer-motion";
import { Heart, HandHeart, Users, ArrowLeft } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const Compassion = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
              <Heart className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              E5: Exercising Compassion
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Demonstrating Christ's love through practical care and service to those in need
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <HandHeart className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Community Care</h3>
              <p className="text-gray-600 mb-4">
                We actively serve our community through various programs that address 
                physical, emotional, and spiritual needs of individuals and families.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Food distribution programs</li>
                <li>• Medical outreach clinics</li>
                <li>• Orphan care initiatives</li>
                <li>• Elderly support services</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Social Justice</h3>
              <p className="text-gray-600 mb-4">
                Standing up for the marginalized and advocating for justice, 
                equality, and human dignity in our communities and beyond.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Advocacy for the poor</li>
                <li>• Prison ministry programs</li>
                <li>• Anti-trafficking efforts</li>
                <li>• Community development projects</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Compassion in Action</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">See</h4>
                <p className="text-gray-600 text-sm">
                  Identifying needs and suffering in our communities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Feel</h4>
                <p className="text-gray-600 text-sm">
                  Developing Christ-like compassion for those who suffer
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Act</h4>
                <p className="text-gray-600 text-sm">
                  Taking concrete steps to address needs and provide help
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Transform</h4>
                <p className="text-gray-600 text-sm">
                  Creating lasting change and empowering communities
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Our Compassion Ministries</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Direct Care Services</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Emergency food assistance</li>
                  <li>• Medical care & health education</li>
                  <li>• Housing support programs</li>
                  <li>• Educational scholarships</li>
                  <li>• Crisis counseling services</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Empowerment Programs</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Skills training workshops</li>
                  <li>• Micro-finance initiatives</li>
                  <li>• Agricultural development</li>
                  <li>• Women's empowerment programs</li>
                  <li>• Youth mentorship & sports</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Lives Transformed</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">2,000+</div>
                <p className="text-gray-600">Families Helped</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">500+</div>
                <p className="text-gray-600">Children Supported</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">15</div>
                <p className="text-gray-600">Communities Served</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center">Join Our Mission of Compassion</h3>
            <p className="text-gray-600 text-center mb-6">
              Be part of demonstrating God's love through practical care and service
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white">
                Volunteer Today
              </Button>
              <Button size="lg" variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                Donate Now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Compassion;