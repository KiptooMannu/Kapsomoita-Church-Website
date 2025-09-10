import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Serve = () => {
  return (
    <section className="flex justify-center items-center py-16 px-6 bg-gradient-to-b from-white to-[#fdfaf6]">
      <div className="max-w-4xl w-full text-center bg-white rounded-2xl shadow-xl p-10">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get involved <span className="text-red-600">|</span> Serve with{" "}
          <span className="text-red-600">Us</span>
        </motion.h2>

        {/* Text */}
        <motion.p
          className="text-gray-700 leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          At Karen Africa Gospel Church, everyone has a vital role. Whether it's
          the{" "}
          <span className="font-semibold">
            Worship Team, Children’s Ministry, Ushering, Youth, Men’s,
          </span>{" "}
          or <span className="font-semibold">Women’s Ministry</span>, there’s a
          place for you. Together, let’s impact lives and spread Christ’s love.
        </motion.p>

        {/* ✅ Link to ServeForm */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/serve"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all inline-block"
          >
            SERVE IN A MINISTRY
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Serve;
