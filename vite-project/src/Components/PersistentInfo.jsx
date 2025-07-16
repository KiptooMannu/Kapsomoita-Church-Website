import { motion } from "framer-motion";

const PersistentInfo = () => {
  return (
    <motion.div 
      className="w-full bg-purple-900 text-white py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Vision */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-purple-500 pb-2 inline-block">
            Our Vision
          </h3>
          <p className="text-purple-100">
            To raise a generation of Spirit-filled believers who transform their communities through Christ's love.
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-purple-500 pb-2 inline-block">
            Our Mission
          </h3>
          <p className="text-purple-100">
            Equipping youth with biblical truth, fostering authentic worship, and empowering for service.
          </p>
        </div>

        {/* M-Pesa Support */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-purple-500 pb-2 inline-block">
            M-Pesa Support
          </h3>
          <div className="space-y-2">
            <p className="text-purple-100">Paybill: 123456</p>
            <p className="text-purple-100">Account: Youth Ministry</p>
            <button className="text-purple-300 hover:text-white underline text-sm">
              View Giving Instructions
            </button>
          </div>
        </div>

        {/* Bank Support */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold border-b-2 border-purple-500 pb-2 inline-block">
            Bank Support
          </h3>
          <div className="space-y-2">
            <p className="text-purple-100">Bank: KCB</p>
            <p className="text-purple-100">Account: 0123456789</p>
            <p className="text-purple-100">Branch: Nairobi West</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersistentInfo;