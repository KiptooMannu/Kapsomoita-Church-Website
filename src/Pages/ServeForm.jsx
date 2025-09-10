import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServeForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Form submitted successfully! We'll be in touch soon.");
    navigate("/"); // Redirect to home after submission
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20"> {/* Added top padding for navbar */}
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Join a <span className="text-orange-600">Ministry</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and let us know how you'd like to serve at
              Karen AGC. There's a place for you!
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+254 700 000 000"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Your age"
              />
            </div>

            {/* Preferred Ministry */}
            <div>
              <label
                htmlFor="ministry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Ministry
              </label>
              <select
                id="ministry"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">- Select -</option>
                <option value="worship">Worship Team</option>
                <option value="children">Children's Ministry</option>
                <option value="youth">Youth Ministry</option>
                <option value="women">Women's Ministry</option>
                <option value="men">Men's Ministry</option>
                <option value="ushering">Ushering</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills or Interests
              </label>
              <input
                type="text"
                id="skills"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Your skills or interests"
              />
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Availability
              </label>
              <input
                type="text"
                id="availability"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Weekdays, Weekends, Specific Days"
              />
            </div>

            {/* How did you hear */}
            <div>
              <label
                htmlFor="hearAboutUs"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                How did you hear about us?
              </label>
              <input
                type="text"
                id="hearAboutUs"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Friend, Social Media, Website..."
              />
            </div>

            {/* Why Join */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Why do you want to join?
              </label>
              <textarea
                id="reason"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Tell us why you'd like to join"
              ></textarea>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Method of Contact
              </label>
              <div className="space-y-2">
                {["Email", "Phone", "Text"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={option.toLowerCase()}
                      className="text-orange-600 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="consent"
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                required
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                I consent to have Karen AGC store my submitted information so they
                can respond to my inquiry.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-orange-600 hover:bg-orange-700 text-white shadow-lg py-3 text-lg rounded-lg"
              >
                Submit Form
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ServeForm;