import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../Components/ui/button";
import womenImage from '../../assets/women-ministry.jpg';
import leader1 from '../../assets/leaders/women-leader1.jpg';
import leader2 from '../../assets/leaders/women-leader2.jpg';
import event1 from '../../assets/events/women-retreat.jpg';
import event2 from '../../assets/events/bible-study.jpg';
import event3 from '../../assets/events/service-project.jpg';
import event4 from '../../assets/events/conference.jpg';
import { Link as ScrollLink } from 'react-scroll';

const Women = () => {
  // ✅ Add form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    skills: "",
    availability: [],
    hearAboutUs: "",
    reason: "",
    contactMethod: "",
  });

  // ✅ Handle change for inputs, checkboxes, radios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        availability: checked
          ? [...prev.availability, value]
          : prev.availability.filter((opt) => opt !== value),
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("✅ Thank you for joining! We'll get back to you soon.");

    // reset
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      skills: "",
      availability: [],
      hearAboutUs: "",
      reason: "",
      contactMethod: "",
    });
  };

  // --- Your faqs, leaders, events, etc. arrays remain the same ---
  const faqs = [
    { question: "When do the women meet for Bible study?", answer: "We meet every Tuesday morning at 10:00 AM in the fellowship hall." },
    { question: "Is childcare provided during meetings?", answer: "Yes, we provide childcare for all our weekly gatherings." },
    { question: "How can I join the prayer chain?", answer: "Contact our Prayer Coordinator or attend our monthly prayer breakfast." },
    { question: "Are there any costs for the annual retreat?", answer: "We offer subsidized rates ($50) and scholarships are available." }
  ];

  const memories = [
    { title: "2023 Women's Conference", date: "March 2023", description: "Three days of worship and teaching with 120 women attending.", image: event1 },
    { title: "Community Outreach", date: "May 2023", description: "Provided meals and supplies to single mothers in our community.", image: event3 },
    { title: "Mother-Daughter Tea", date: "July 2023", description: "Special bonding time for mothers and daughters of all ages.", image: event4 },
    { title: "Bible Study Launch", date: "January 2024", description: "Began our year-long study of the Book of Ruth.", image: event2 }
  ];

  const upcomingEvents = [
    { title: "Women's Breakfast", date: "June 10, 2024", time: "9:00 AM", location: "Church Fellowship Hall" },
    { title: "Service Project: Orphanage Visit", date: "June 20, 2024", time: "8:30 AM", location: "Hope Children's Home" },
    { title: "Weekly Bible Study", date: "Every Tuesday", time: "10:00 AM", location: "Room 105" },
    { title: "Annual Women's Retreat", date: "September 13-15, 2024", time: "Friday 4:00 PM", location: "Lakeside Retreat Center" }
  ];

  const activities = [
    { title: "Weekly Bible Study", description: "In-depth study of God's Word with practical applications", icon: "✝️" },
    { title: "Prayer Ministry", description: "Intercessory prayer for families and our community", icon: "🙏" },
    { title: "Mentorship Program", description: "Older women mentoring younger women in faith and life", icon: "👩‍👧‍👦" }
  ];

  const leaders = [
    {
      name: "Mama Grace Wanjiku",
      role: "Ministry Chair",
      message: "We welcome every woman to join us as we grow in faith, love, and service to God and others.",
      contact: "grace@church.org",
      phone: "+254 712 345 678",
      image: leader1
    },
    {
      name: "Eunice Kiprotich",
      role: "Prayer Coordinator",
      message: "Prayer changes everything — come be part of our intercessory fellowship that moves mountains.",
      contact: "eunice@church.org",
      phone: "+254 723 456 789",
      image: leader2
    },
  ];



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
    <div className="min-h-screen py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Women's Ministry
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 leading-relaxed">
                Building godly women through fellowship, Bible study, and prayer to impact families and communities.
              </p>
              <div className="flex flex-wrap gap-4">
             <Button 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg transition-all"
                  onClick={scrollToContact}
                >
                  Join Our Women Ministry
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-pink-600 text-pink-600 hover:bg-pink-50 shadow-sm"
                >
                  <ScrollLink to="events" smooth={true} duration={500} offset={-80}>
                    Upcoming Events
                  </ScrollLink>
                </Button>
                <Button 
                  size="lg"
                  variant="ghost"
                  className="text-gray-600 hover:bg-orange-50"
                  onClick={() => {
                    document.getElementById('memories')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  Our Memories
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-2xl order-1 md:order-2"
            >
              <img 
                src={womenImage} 
                alt="Women praying together at ministry event" 
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          </div>
        </section>

        {/* Key Verse Section */}
        <section className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-pink-100 max-w-4xl mx-auto"
          >
            <blockquote className="text-xl md:text-2xl italic text-gray-700 mb-4">
              "She is clothed with strength and dignity; she can laugh at the days to come. She speaks with wisdom, and faithful instruction is on her tongue."
            </blockquote>
            <p className="text-pink-600 font-medium">— Proverbs 31:25-26</p>
          </motion.div>
        </section>

        {/* Programs Section */}
        <section className="mb-28">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our <span className="text-pink-600">Programs</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((program, index) => (
              <motion.div
                key={program.title}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-6 text-center">{program.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaders Section */}
        <section id="leaders" className="mb-28">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our <span className="text-pink-600">Leaders</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <img 
                    src={leader.image}
                    alt={leader.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-pink-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{leader.name}</h3>
                    <p className="text-sm mb-3 text-pink-600 font-medium">{leader.role}</p>
                    <p className="text-sm mb-4 text-gray-600 italic">"{leader.message}"</p>
                    <div className="text-sm space-y-1">
                      <a 
                        href={`mailto:${leader.contact}`}
                        className="block text-pink-600 hover:underline" 
                      >
                        {leader.contact}
                      </a>
                      <a 
                        href={`tel:${leader.phone}`}
                        className="block text-pink-600 hover:underline"
                      >
                        {leader.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="mb-28">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Upcoming <span className="text-pink-600">Events</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-pink-50 text-pink-600 rounded-lg p-3 mb-4 text-center">
                  <p className="font-bold">{event.date}</p>
                  {event.time && <p className="text-sm">{event.time}</p>}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4 border-pink-500 text-pink-500 hover:bg-pink-50"
                >
                  Add to Calendar
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Memories Gallery */}
        <section id="memories" className="mb-28">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our <span className="text-pink-600">Memories</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memories.map((memory, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src={memory.image} 
                  alt={memory.title} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm text-pink-300 mb-1">{memory.date}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{memory.title}</h3>
                    <p className="text-sm text-gray-200">{memory.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-28">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked <span className="text-pink-600">Questions</span>
          </motion.h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🔹 Contact Form */}
        <section id="contact-form" className="mb-20">
          <motion.div
            className="bg-white p-8 md:p-12 rounded-xl shadow-md border max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Join Our <span className="text-pink-600">Sisterhood</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Phone + Age */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Skills */}
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows={2}
                placeholder="Your skills or interests"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />

              {/* Availability */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Availability *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Weekdays", "Weekends", "Mornings", "Evenings"].map(
                    (opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={formData.availability.includes(opt)}
                          onChange={handleChange}
                          className="mr-2 text-pink-600"
                        />
                        {opt}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* How did you hear */}
              <select
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">How did you hear about us?</option>
                <option value="church-service">Church Service</option>
                <option value="friend">Friend/Family</option>
                <option value="social-media">Social Media</option>
                <option value="website">Church Website</option>
                <option value="other">Other</option>
              </select>

              {/* Reason */}
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Why do you want to join?"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />

              {/* Contact Method */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Preferred Contact *
                </label>
                <div className="space-y-2">
                  {["Email", "Phone Call", "Text Message", "WhatsApp"].map(
                    (opt) => (
                      <label key={opt} className="flex items-center">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={opt}
                          checked={formData.contactMethod === opt}
                          onChange={handleChange}
                          required
                          className="mr-2 text-pink-600"
                        />
                        {opt}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg"
              >
                Submit Application
              </Button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Women;


































