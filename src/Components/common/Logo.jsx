import { Church } from "lucide-react";
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
      <div className="flex items-center justify-center w-10 h-10 bg-purple-800 rounded-full shadow-md">
        <Church className="w-6 h-6 text-white" />
      </div>
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-white leading-tight">Kapsomoita</h1>
        <p className="text-sm text-purple-200 -mt-1 tracking-wide">Africa Gospel Church</p>
      </div>
    </Link>
  );
};

export default Logo;
