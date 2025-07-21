import { motion } from "framer-motion";
import { Button } from "../Components/ui/button";
import { Phone, HandCoins, Cross, Gift, Home, Globe } from "lucide-react";

const Give = () => {
  const donationOptions = [
    {
      id: 1,
      title: "Tithes",
      description: "Faithfully returning 10% of your income to support the church's ministry",
      paybill: "123456",
      account: "TITHES",
      icon: <Cross className="w-8 h-8 text-green-600" />
    },
    {
      id: 2,
      title: "Offerings",
      description: "Freewill offerings to support the ongoing work of the church",
      paybill: "123456",
      account: "OFFERINGS",
      icon: <HandCoins className="w-8 h-8 text-green-600" />
    },
    {
      id: 3,
      title: "Missions Support",
      description: "Support our local and international mission efforts",
      paybill: "123456",
      account: "MISSIONS",
      icon: <Globe className="w-8 h-8 text-green-600" />
    },
    {
      id: 4,
      title: "Children's Home",
      description: "Help provide for orphans and vulnerable children in our care",
      paybill: "123456",
      account: "CHILDREN",
      icon: <Home className="w-8 h-8 text-green-600" />
    },
    {
      id: 5,
      title: "Building Fund",
      description: "Contribute to our church expansion projects",
      paybill: "123456",
      account: "BUILDING",
      icon: <Gift className="w-8 h-8 text-green-600" />
    },
    {
      id: 6,
      title: "Pastoral Support",
      description: "Support our pastoral staff and their families",
      paybill: "123456",
      account: "PASTORAL",
      icon: <Phone className="w-8 h-8 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Give Generously
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
        </motion.section>

        {/* M-Pesa Giving Options */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="border-b-4 border-green-500 pb-2">M-Pesa Giving</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationOptions.map((option) => (
              <motion.div
                key={option.id}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{option.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{option.description}</p>
                
                <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Paybill:</span>
                    <span className="font-bold text-green-600">{option.paybill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Account:</span>
                    <span className="font-bold text-green-600">{option.account}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  Give Now via M-Pesa
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Alternative Giving Methods */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="border-b-4 border-green-500 pb-2">Other Giving Methods</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bank Transfer */}
            <motion.div
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Bank Transfer</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p><span className="font-medium">Bank:</span> KCB Kenya</p>
                <p><span className="font-medium">Account Name:</span> Kapsomoita AGC</p>
                <p><span className="font-medium">Account Number:</span> 0123456789</p>
                <p><span className="font-medium">Branch:</span> Nairobi West</p>
                <p><span className="font-medium">Swift Code:</span> KCBLKENX</p>
              </div>
            </motion.div>

            {/* Cheque */}
            <motion.div
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Cheque</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>Make cheques payable to:</p>
                <p className="font-medium">Kapsomoita Africa Gospel Church</p>
                <p>and deliver to:</p>
                <p>Church Office, Kapsomoita AGC, P.O Box 12345-00100, Nairobi</p>
              </div>
            </motion.div>

            {/* In-Person */}
            <motion.div
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">In-Person Giving</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>You can give during our services:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sunday Morning Service</li>
                  <li>Tuesday Prayer Meeting</li>
                  <li>Friday Night Service</li>
                </ul>
                <p className="mt-2">Look for our ushers with offering baskets</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Giving FAQ */}
        <section className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="border-b-4 border-green-500 pb-2">Giving FAQ</span>
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                question: "Is online giving secure?",
                answer: "Yes, all online transactions are encrypted and processed through secure payment gateways."
              },
              {
                question: "Will I get a receipt for my donation?",
                answer: "Yes, you'll receive an automatic receipt via email for all electronic giving. For cash/cheque donations, receipts are available upon request at the church office."
              },
              {
                question: "Can I set up recurring donations?",
                answer: "Yes, through our bank standing order system. Contact the church office for assistance setting this up."
              },
              // {
              //   question: "Are donations tax-deductible?",
              //   answer: "Yes, Kapsomoita AGC is a registered religious organization, and all donations are tax-deductible. We issue annual giving statements for tax purposes."
              // }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Give;