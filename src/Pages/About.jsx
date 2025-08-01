import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import { Button } from "../Components/ui/button";
import { Link } from "react-router-dom";
import MissionVision from "../Components/about/MissionVision";
import ChurchStory from "../Components/about/ChurchStory";
import ChurchValues from "../Components/about/ChurchValues";
import { Church, Cross, HeartHandshake, BookOpen, Users } from "lucide-react";

const About = () => {
  const stats = [
    { value: "200+", label: "Members", icon: Users },
    { value: "15", label: "Ministries", icon: HeartHandshake },
    { value: "52", label: "Sermons/Yr", icon: BookOpen },
    { value: "1995", label: "Founded", icon: Church }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(45, 20%, 98%)' }}>

      {/* Hero Section */}
      <section 
        className="relative py-28"
        style={{
          background: 'linear-gradient(180deg, hsl(45, 25%, 97%), hsl(45, 20%, 98%))'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: 'hsl(25, 25%, 15%)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About{" "}
   <span
  style={{
    background: 'linear-gradient(135deg, hsl(270, 50%, 40%), hsl(280, 60%, 50%))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  }}
>
  Our Church
</span>

          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'hsl(25, 15%, 45%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Learn about our history, mission, and the heart behind Kapsomoita Africa Gospel Church
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <stat.icon 
                  className="w-10 h-10 mx-auto mb-3" 
                  style={{ color: 'hsl(270, 50%, 40%)' }} // <-- Church purple
                />
                <p className="text-3xl font-bold" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MissionVision />
      <ChurchStory />
      <ChurchValues />

     {/* Leadership Section */}
<section className="py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.h2
      className="text-3xl md:text-4xl font-bold mb-12"
      style={{ color: 'hsl(25, 35%, 25%)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      Meet Our Leadership
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Rev. Dr. Robert Lang'at */}
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img 
            src="https://agckenya.org/wp-content/uploads/2021/08/New-Project-10-1-1200x883.jpg" 
            alt="Rev. Dr. Robert Lang'at"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>
            Rev. Dr. Robert Lang'at
          </h3>
          <p className="text-sm mt-1" style={{ color: 'hsl(25, 85%, 45%)' }}>
            Bishop – AGC Kenya
          </p>
          <p className="text-sm mt-3 text-left" style={{ color: 'hsl(25, 15%, 45%)' }}>
            Bishop Lang'at is a life-long member of the Africa Gospel Church-Kenya. He attended Tenwek High School and graduated from Kenya Highlands Evangelical University. Dr. Lang'at earned an MA in theology at Wesley Biblical Seminary and a PhD from Drew University. He has served as a pastor, University Provost, and college professor in the US, Kenya, and Nigeria.
          </p>
        </div>
      </motion.div>

      {/* Rev. John ole Kisotu */}
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img 
            src="https://agckenya.org/wp-content/uploads/2021/08/New-Project-12-1200x883.jpg" 
            alt="Rev. John ole Kisotu"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>
            Rev. John ole Kisotu
          </h3>
          <p className="text-sm mt-1" style={{ color: 'hsl(25, 85%, 45%)' }}>
            Assistant Bishop – AGC Kenya
          </p>
          <p className="text-sm mt-3 text-left" style={{ color: 'hsl(25, 15%, 45%)' }}>
            He is married to Elisabeth and they have four children. He served as a pastor in Leshuta Local church and as district leader in the Leshuta region before moving to Sekenani. John is a graduate of Narok Bible College with his Bachelor of Theology degree. Elizabeth is a teacher at a local school and helps in Sekenani AGC.
          </p>
        </div>
      </motion.div>

      {/* Raymond Tonui */}
      <motion.div
        className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img 
            src="https://agckenya.org/wp-content/uploads/2021/08/New-Project-11-1-1200x883.jpg" 
            alt="Raymond Tonui"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold" style={{ color: 'hsl(25, 25%, 15%)' }}>
            Raymond Tonui
          </h3>
          <p className="text-sm mt-1" style={{ color: 'hsl(25, 85%, 45%)' }}>
            Administrative Secretary
          </p>
          <p className="text-sm mt-3 text-left" style={{ color: 'hsl(25, 15%, 45%)' }}>
            An alumni of Kenya Highlands Bible College with a Bachelor's Degree in Theology and a Master's Degree in Christian studies from Wesley Biblical Seminary. He got saved in 1991 and felt the call to ministry in 1999. He has served as youth pastor, assistant pastor, and senior pastor before his current role. Married to Stella with two children.
          </p>
        </div>
      </motion.div>
    </div>
  </div>
</section>
    </div>
  );
};

export default About;
