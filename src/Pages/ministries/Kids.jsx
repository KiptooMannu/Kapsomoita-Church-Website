import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import { Link as ScrollLink } from 'react-scroll';
import kidsImage from '../../assets/kids-ministry.jpg';

const Kids = () => {
  // Online PDF Resources
  const resources = [
    {
      title: "Weekly Devotionals",
      url: "https://www.focusonthefamily.com/wp-content/uploads/2020/11/Family-Devotions-Guide.pdf",
      description: "Fun Bible activities for kids"
    },
    {
      title: "Parenting Guide",
      url: "https://www.focusonthefamily.com/wp-content/uploads/2020/11/Parenting-Young-Kids-Guide.pdf",
      description: "Christian parenting tips"
    },
    {
      title: "Discipleship Guide",
      url: "https://www.awana.org/wp-content/uploads/2020/08/Discipling-Kids-Guide.pdf",
      description: "Teaching kids about Jesus"
    }
  ];

  // Function to scroll to contact form
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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
                  Kids Ministry
                </span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'hsl(25, 15%, 45%)' }}>
                Nurturing children in faith through fun, engaging, and age-appropriate biblical teaching.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg transition-all"
                  onClick={scrollToContact}
                >
                  Join Our Kids Ministry
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  style={{
                    borderColor: 'hsl(25, 85%, 45%)',
                    color: 'hsl(25, 85%, 45%)'
                  }}
                  onClick={() => {
                    document.getElementById('events')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  Upcoming Events
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src={kidsImage} 
                alt="Kids Ministry" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

        {/* Ministry Highlights */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Highlights from Our Ministry
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Fun & Faith", description: "Games, crafts, and memory verses every week!" },
              { title: "Child Safety First", description: "All volunteers are background-checked and trained." },
              { title: "Parental Involvement", description: "We keep you updated with take-home devotionals." },
            ].map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold mb-2" style={{ color: 'hsl(25, 25%, 15%)' }}>{highlight.title}</h4>
                <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Moments from Our Kids Ministry
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, img: kidsImage },
              { id: 2, img: kidsImage },
              { id: 3, img: kidsImage},
              { id: 4, img: kidsImage }
            ].map((image) => (
              <motion.div
                key={image.id}
                className="overflow-hidden rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image.img}
                  alt={`Kids event ${image.id}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Parent Resources Section with PDFs */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Resources for Parents
          </motion.h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {resources.map((res, index) => (
              <motion.div
                key={index}
                className="p-4 border rounded-lg bg-white hover:bg-orange-50 transition"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <a 
                      href={res.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-orange-600 hover:underline"
                    >
                      {res.title}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">{res.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: 'hsl(25, 35%, 25%)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              { q: "Is registration required every week?", a: "No, once registered, your child can attend weekly. Please notify us for special events." },
              { q: "What safety measures are in place?", a: "All volunteers are trained and background-checked. Children are checked in/out securely." },
              { q: "Can I volunteer?", a: "Yes! We welcome parent volunteers. Contact any of our leaders for the onboarding process." }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
              >
                <h4 className="font-semibold text-lg mb-2 text-orange-700">{faq.q}</h4>
                <p className="text-sm" style={{ color: 'hsl(25, 15%, 45%)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Programs Section */}
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
            {[
              {
                title: "Sunday School",
                description: "Age-appropriate Bible teaching every Sunday at 10 AM",
                age: "Ages 3-12"
              },
              {
                title: "Vacation Bible School",
                description: "Annual summer program with music, crafts, and Bible stories",
                age: "Ages 5-12"
              },
              {
                title: "Kids Worship",
                description: "Monthly worship service designed just for children",
                age: "All ages"
              }
            ].map((program, index) => (
              <motion.div
                key={program.title}
                className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">👶</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(25, 25%, 15%)' }}>
                  {program.title}
                </h3>
                <p className="text-sm mb-1" style={{ color: 'hsl(25, 15%, 45%)' }}>
                  {program.description}
                </p>
                <p className="text-xs font-medium" style={{ color: 'hsl(25, 85%, 45%)' }}>
                  {program.age}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Contact Form */}
        <section id="contact-form" className="mb-20">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'hsl(25, 35%, 25%)' }}>
              Join Our Kids Ministry
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Ready to get your child involved in our ministry? Fill out the form below and we'll get back to you soon.
            </p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="parent-name" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                    Parent's Name *
                  </label>
                  <input
                    type="text"
                    id="parent-name"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <label htmlFor="child-age" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                    Child's Age *
                  </label>
                  <input
                    type="number"
                    id="child-age"
                    min="0"
                    max="12"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="child-name" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Child's Name (if applicable)
                </label>
                <input
                  type="text"
                  id="child-name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Child's Interests or Special Talents
                </label>
                <textarea
                  id="skills"
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  placeholder="Arts, sports, music, etc."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Availability *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Weekdays', 'Weekends', 'Mornings', 'Evenings'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2" 
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="hear-about" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  How did you hear about us? *
                </label>
                <select 
                  id="hear-about"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                >
                  <option value="">Select an option</option>
                  <option value="church-service">Church Service</option>
                  <option value="friend">Friend/Family</option>
                  <option value="social-media">Social Media</option>
                  <option value="website">Church Website</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Why do you want to join? *
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  placeholder="Tell us what interests you about our Kids Ministry"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Preferred Method of Contact *
                </label>
                <div className="space-y-2">
                  {['Email', 'Phone Call', 'Text Message', 'WhatsApp'].map(option => (
                    <label key={option} className="flex items-center">
                      <input 
                        type="radio" 
                        name="contactMethod"
                        value={option.toLowerCase()} 
                        required
                        className="text-orange-600 focus:ring-orange-500 mr-2" 
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="special-needs" className="block text-sm font-medium mb-1" style={{ color: 'hsl(25, 35%, 25%)' }}>
                  Any special needs or allergies we should know about?
                </label>
                <textarea
                  id="special-needs"
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: 'hsl(35, 20%, 88%)' }}
                  placeholder="Please share any important information about your child"
                ></textarea>
              </div>
              
              <Button 
                type="submit"
                className="w-full py-3 text-lg"
                style={{
                  backgroundColor: 'hsl(25, 85%, 45%)',
                  color: 'hsl(45, 20%, 98%)'
                }}
              >
                Submit Registration
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                We'll contact you within 2-3 business days to welcome you to our Kids Ministry!
              </p>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Kids;