import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import { Link as ScrollLink } from 'react-scroll';
import kidsImage from '../../assets/kids-ministry.jpg';
import PersistentInfo from '../../Components/Footer';

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
    <div className="min-h-screen py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Kids Ministry
                </span>
              </h1>
              <p className="text-lg mb-8 text-gray-600">
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
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
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
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          </div>
        </section>

        {/* Ministry Highlights */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
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
                <h4 className="text-xl font-semibold mb-2 text-gray-800">{highlight.title}</h4>
                <p className="text-sm text-gray-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
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
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Parent Resources Section with PDFs */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
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
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
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
                <p className="text-sm text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Programs Section */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {program.title}
                </h3>
                <p className="text-sm mb-1 text-gray-600">
                  {program.description}
                </p>
                <p className="text-xs font-medium text-orange-600">
                  {program.age}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Contact Form - Updated to match Men.jsx */}
        <section id="contact-form" className="mb-20">
          <motion.div
            className="bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                Join Our <span className="text-orange-600">Kids Ministry</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ready to get your child involved in our ministry? Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href="mailto:kidsministry@church.org" className="text-orange-600 hover:underline">
                          kidsministry@church.org
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href="tel:+254712345678" className="text-orange-600 hover:underline">
                          +254 712 345 678
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Meeting Location</p>
                        <p className="text-orange-600">Kids Wing, Main Church Campus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Regular Gatherings</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Sunday School: Sundays 10AM</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Kids Worship: Monthly, 1st Sunday</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Vacation Bible School: Annual summer program</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="parent-name" className="block text-sm font-medium text-gray-700 mb-1">Parent's Name *</label>
                      <input 
                        type="text" 
                        id="parent-name" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <label htmlFor="child-age" className="block text-sm font-medium text-gray-700 mb-1">Child's Age *</label>
                      <input 
                        type="number" 
                        id="child-age" 
                        min="0"
                        max="12"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Child's age"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="child-name" className="block text-sm font-medium text-gray-700 mb-1">Child's Name (if applicable)</label>
                    <input 
                      type="text" 
                      id="child-name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Child's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Child's Interests or Special Talents</label>
                    <textarea 
                      id="skills" 
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Arts, sports, music, etc."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
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
                    <label htmlFor="hear-about" className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us? *</label>
                    <select 
                      id="hear-about"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join? *</label>
                    <textarea 
                      id="reason" 
                      rows={3}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Tell us what interests you about our Kids Ministry"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method of Contact *</label>
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
                    <label htmlFor="special-needs" className="block text-sm font-medium text-gray-700 mb-1">Any special needs or allergies we should know about?</label>
                    <textarea 
                      id="special-needs" 
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Please share any important information about your child"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg py-3 text-lg"
                    >
                      Submit Registration
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      We'll contact you within 2-3 business days to welcome you to our Kids Ministry!
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
      {/* <PersistentInfo /> */}
    </div>
  );
};

export default Kids;