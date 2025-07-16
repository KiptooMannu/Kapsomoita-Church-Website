import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Home,
  Info,
  PlayCircle,
  Image,
  Phone,
  Users,
  Landmark,
  ShieldCheck,
  Baby,
  Cross,
  Library,
  BookOpenCheck,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Vision, Mission, Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-gray-500 pb-2 inline-block">Our Vision</h3>
            <p className="text-gray-300">
              To raise godly men who lead with integrity in their homes, churches, and communities.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-gray-500 pb-2 inline-block">Our Mission</h3>
            <p className="text-gray-300">
              Equipping men through biblical teaching, accountability, and service opportunities.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-gray-500 pb-2 inline-block">M-Pesa Support</h3>
            <div className="space-y-2">
              <p className="text-gray-300">Paybill: 123456</p>
              <p className="text-gray-300">Account: Men's Ministry</p>
              <button className="text-blue-400 hover:text-white underline text-sm">
                View Giving Instructions
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-gray-500 pb-2 inline-block">Bank Support</h3>
            <div className="space-y-2">
              <p className="text-gray-300">Bank: KCB</p>
              <p className="text-gray-300">Account: 0123456789</p>
              <p className="text-gray-300">Branch: Nairobi West</p>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Church Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kapsomoita AGC</h3>
            <p className="text-gray-300 mb-4">
              Bringing hope and transformation through the Gospel of Jesus Christ.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube className="h-6 w-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-6">
              {/* Main Pages */}
              <div>
                <h4 className="text-md font-semibold mb-2">🏠 Main Pages</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="flex items-center text-gray-300 hover:text-white"><Home size={16} className="mr-2" />Home</Link></li>
                  <li><Link to="/about" className="flex items-center text-gray-300 hover:text-white"><Info size={16} className="mr-2" />About Us</Link></li>
                  <li><Link to="/sermons" className="flex items-center text-gray-300 hover:text-white"><PlayCircle size={16} className="mr-2" />Sermons</Link></li>
                  <li><Link to="/gallery" className="flex items-center text-gray-300 hover:text-white"><Image size={16} className="mr-2" />Gallery</Link></li>
                  <li><Link to="/contact" className="flex items-center text-gray-300 hover:text-white"><Phone size={16} className="mr-2" />Contact</Link></li>
                </ul>
              </div>

              {/* Ministries */}
              <div>
                <h4 className="text-md font-semibold mb-2">⛪ Ministries</h4>
                <ul className="space-y-2">
                  <li><Link to="/ministries/youth" className="flex items-center text-gray-300 hover:text-white"><Users size={16} className="mr-2" />Youth Ministry</Link></li>
                  <li><Link to="/ministries/women" className="flex items-center text-gray-300 hover:text-white"><Landmark size={16} className="mr-2" />Women's Ministry</Link></li>
                  <li><Link to="/ministries/men" className="flex items-center text-gray-300 hover:text-white"><ShieldCheck size={16} className="mr-2" />Men's Ministry</Link></li>
                  <li><Link to="/ministries/kids" className="flex items-center text-gray-300 hover:text-white"><Baby size={16} className="mr-2" />Kids Ministry</Link></li>
                </ul>
              </div>

              {/* Strategies */}
              <div>
                <h4 className="text-md font-semibold mb-2">🧭 Strategies</h4>
                <ul className="space-y-2">
                  <li><Link to="/strategies/evangelizing" className="flex items-center text-gray-300 hover:text-white"><Cross size={16} className="mr-2" />Evangelizing</Link></li>
                  <li><Link to="/strategies/establishing" className="flex items-center text-gray-300 hover:text-white"><Library size={16} className="mr-2" />Establishing</Link></li>
                  <li><Link to="/strategies/edifying" className="flex items-center text-gray-300 hover:text-white"><BookOpenCheck size={16} className="mr-2" />Edifying</Link></li>
                  <li><Link to="/strategies/equipping" className="flex items-center text-gray-300 hover:text-white"><ShieldCheck size={16} className="mr-2" />Equipping</Link></li>
                  <li><Link to="/strategies/compassion" className="flex items-center text-gray-300 hover:text-white"><HeartHandshake size={16} className="mr-2" />Compassion</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Kapsomoita, Nairobi</p>
              <p>P.O Box 12345-00100</p>
              <p>Phone: +254 712 345 678</p>
              <p>Email: info@kapsomoitaagc.org</p>
            </address>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-xl font-bold mb-4">Service Times</h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex justify-between"><span>Sunday</span><span>8:00 AM - 12:00 PM</span></li>
              <li className="flex justify-between"><span>Tuesday</span><span>5:30 PM - 7:00 PM</span></li>
              <li className="flex justify-between"><span>Friday</span><span>5:30 PM - 8:00 PM</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kapsomoita Africa Gospel Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
