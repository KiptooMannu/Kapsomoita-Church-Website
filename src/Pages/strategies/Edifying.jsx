import { motion } from "framer-motion";
import { BookOpen, Users, Heart, ArrowLeft } from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const Edifying = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              E3: Edifying Believers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building up the body of Christ through discipleship, teaching, and spiritual growth
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <BookOpen className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Bible Study & Teaching</h3>
              <p className="text-gray-600 mb-4">
                We provide comprehensive Bible study programs and systematic teaching 
                to help believers grow deeper in their understanding of God's Word.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Weekly Bible study groups</li>
                <li>• Expository preaching</li>
                <li>• Theological training courses</li>
                <li>• Scripture memorization programs</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Users className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Discipleship Programs</h3>
              <p className="text-gray-600 mb-4">
                Our structured discipleship programs help believers mature in their faith 
                through mentorship, accountability, and practical spiritual disciplines.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• One-on-one mentoring</li>
                <li>• Small group discipleship</li>
                <li>• Spiritual gifts discovery</li>
                <li>• Christian lifestyle training</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Spiritual Growth Journey</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Foundation</h4>
                <p className="text-gray-600 text-sm">
                  Building strong biblical foundations for new believers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Growth</h4>
                <p className="text-gray-600 text-sm">
                  Developing spiritual disciplines and deeper understanding
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Maturity</h4>
                <p className="text-gray-600 text-sm">
                  Reaching spiritual maturity and developing ministry skills
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Multiplication</h4>
                <p className="text-gray-600 text-sm">
                  Discipling others and multiplying kingdom impact
                </p>
              </div>
            </div>
          </motion.div>

          {/* New Ministries Section */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">Targeted Ministries for Spiritual Growth</h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Youth Ministry */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Youth Ministry</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Engaging the next generation with relevant biblical teaching and vibrant fellowship.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Weekly youth gatherings with worship and Bible study</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Annual youth camps and retreats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Leadership development for young believers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Contemporary issues addressed from biblical perspective</span>
                  </li>
                </ul>
              </div>

              {/* Men's Ministry */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Men's Ministry</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Equipping men to live with biblical integrity and lead their families well.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Monthly men's breakfast and Bible study</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Accountability groups for spiritual growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Practical workshops on fatherhood and marriage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Service projects and mission opportunities</span>
                  </li>
                </ul>
              </div>

              {/* Women's Ministry */}
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Women's Ministry</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Nurturing women in faith through fellowship, study, and mutual encouragement.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Weekly women's Bible study groups</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Annual women's retreat and conferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Mentorship programs across generations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Practical discipleship for everyday life</span>
                  </li>
                </ul>
              </div>

              {/* Children's Ministry */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Children's Ministry</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Laying biblical foundations through engaging, age-appropriate teaching.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Sunday School with interactive Bible lessons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Vacation Bible School and special events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Scripture memorization programs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>Parent resources for spiritual training at home</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Discipleship Pathway */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl">
              <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">Discipleship Pathway</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h5 className="font-bold text-lg mb-3 text-green-700">New Believers</h5>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Foundations of Faith class</li>
                    <li>• One-on-one follow-up</li>
                    <li>• Baptism preparation</li>
                    <li>• Spiritual growth starter pack</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h5 className="font-bold text-lg mb-3 text-green-700">Growing Believers</h5>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Small group discipleship</li>
                    <li>• Bible study methods training</li>
                    <li>• Spiritual gifts discovery</li>
                    <li>• Prayer life development</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h5 className="font-bold text-lg mb-3 text-green-700">Mature Believers</h5>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Leadership training</li>
                    <li>• Mentorship opportunities</li>
                    <li>• Teaching and serving roles</li>
                    <li>• Mission team participation</li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-8">
                {/* <Button className="bg-green-600 hover:bg-green-700">
                  Explore Discipleship Opportunities
                </Button> */}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-semibold">Building Strong Believers</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Weekly Programs</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Sunday School Classes</li>
                  <li>• Mid-week Bible Study</li>
                  <li>• Prayer Meetings</li>
                  <li>• Youth & Adult Fellowships</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Special Events</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Annual Bible Conference</li>
                  <li>• Discipleship Retreats</li>
                  <li>• Leadership Seminars</li>
                  <li>• Spiritual Growth Workshops</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Grow in Faith</h3>
            <p className="text-gray-600 mb-6">
              Join our discipleship programs and take the next step in your spiritual journey
            </p>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Growing
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Edifying;