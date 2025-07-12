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
  const faqs = [
    {
      question: "When do the women meet for Bible study?",
      answer: "We meet every Tuesday morning at 10:00 AM in the fellowship hall."
    },
    {
      question: "Is childcare provided during meetings?",
      answer: "Yes, we provide childcare for all our weekly gatherings."
    },
    {
      question: "How can I join the prayer chain?",
      answer: "Contact our Prayer Coordinator or attend our monthly prayer breakfast."
    },
    {
      question: "Are there any costs for the annual retreat?",
      answer: "We offer subsidized rates ($50) and scholarships are available."
    }
  ];

  const memories = [
    {
      title: "2023 Women's Conference",
      date: "March 2023",
      description: "Three days of worship and teaching with 120 women attending.",
      image: event1
    },
    {
      title: "Community Outreach",
      date: "May 2023",
      description: "Provided meals and supplies to single mothers in our community.",
      image: event3
    },
    {
      title: "Mother-Daughter Tea",
      date: "July 2023",
      description: "Special bonding time for mothers and daughters of all ages.",
      image: event4
    },
    {
      title: "Bible Study Launch",
      date: "January 2024",
      description: "Began our year-long study of the Book of Ruth.",
      image: event2
    }
  ];

  const upcomingEvents = [
    {
      title: "Women's Breakfast",
      date: "June 10, 2024",
      time: "9:00 AM",
      location: "Church Fellowship Hall"
    },
    {
      title: "Service Project: Orphanage Visit",
      date: "June 20, 2024",
      time: "8:30 AM",
      location: "Hope Children's Home"
    },
    {
      title: "Weekly Bible Study",
      date: "Every Tuesday",
      time: "10:00 AM",
      location: "Room 105"
    },
    {
      title: "Annual Women's Retreat",
      date: "September 13-15, 2024",
      time: "Friday 4:00 PM",
      location: "Lakeside Retreat Center"
    }
  ];

  const activities = [
    {
      title: "Weekly Bible Study",
      description: "In-depth study of God's Word with practical applications",
      icon: "✝️"
    },
    {
      title: "Prayer Ministry",
      description: "Intercessory prayer for families and our community",
      icon: "🙏"
    },
    {
      title: "Mentorship Program",
      description: "Older women mentoring younger women in faith and life",
      icon: "👩‍👧‍👦"
    }
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
                  className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-all"
                >
                  <a href="mailto:women@church.org">
                    Join Our Sisterhood
                  </a>
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
                  className="text-gray-600 hover:bg-pink-50"
                >
                  <ScrollLink to="memories" smooth={true} duration={500} offset={-80}>
                    Our Memories
                  </ScrollLink>
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

        {/* Contact Section */}
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
                Get <span className="text-pink-600">Connected</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ready to join our sisterhood? Have questions about our ministry? Reach out to us today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-pink-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href="mailto:women@church.org" className="text-pink-600 hover:underline">
                          women@church.org
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-pink-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href="tel:+254712345678" className="text-pink-600 hover:underline">
                          +254 712 345 678
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-pink-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Meeting Location</p>
                        <p className="text-pink-600">Fellowship Hall, Main Church Campus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Regular Gatherings</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Weekly Bible Study: Tuesdays 10AM</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Monthly Prayer Breakfast: 2nd Saturday 9AM</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Quarterly Retreats</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Women;