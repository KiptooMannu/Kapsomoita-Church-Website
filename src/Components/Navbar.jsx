import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, HandCoins } from "lucide-react";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AGCLogo from '../assets/agc.png'; // Adjust the path to your logo image

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinistriesHovered, setIsMinistriesHovered] = useState(false);
  const [isStrategiesHovered, setIsStrategiesHovered] = useState(false);
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false);
  const [mobileStrategiesOpen, setMobileStrategiesOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Home", id: "home" },
    { 
      name: "Ministries", 
      id: "ministries",
      dropdown: [
        { name: "Youth Ministry", path: "/ministries/youth" },
        { name: "Women's Ministry", path: "/ministries/women" },
        { name: "Men's Ministry", path: "/ministries/men" },
        { name: "Kids Ministry", path: "/ministries/kids" }
      ]
    },
    { 
      name: "Strategies", 
      id: "strategies",
      dropdown: [
        { name: "E1: Evangelizing the Lost", path: "/strategies/evangelizing" },
        { name: "E2: Establishing Churches", path: "/strategies/establishing" },
        { name: "E3: Edifying Believers", path: "/strategies/edifying" },
        { name: "E4: Equipping Leaders", path: "/strategies/equipping" },
        { name: "E5: Exercising Compassion", path: "/strategies/compassion" }
      ]
    },
    { name: "About Us", id: "about" },
    { name: "Sermons", id: "sermons" },
    { name: "Events", id: "events" },
    { name: "Gallery", id: "gallery" },
    { name: "Contact", id: "contact" },
  ];

  const handleNavigation = (id) => {
    if (["/ministries", "/strategies"].some(p => location.pathname.startsWith(p))) {
      navigate(`/#${id}`);
      setIsOpen(false);
    } else {
      navigate(`/#${id}`, { replace: true });
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleDropdownHover = (type, entering) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    if (entering) {
      if (type === 'ministries') {
        setIsMinistriesHovered(true);
        setIsStrategiesHovered(false);
      }
      if (type === 'strategies') {
        setIsStrategiesHovered(true);
        setIsMinistriesHovered(false);
      }
    } else {
      setHoverTimeout(setTimeout(() => {
        if (type === 'ministries' && !isStrategiesHovered) setIsMinistriesHovered(false);
        if (type === 'strategies' && !isMinistriesHovered) setIsStrategiesHovered(false);
      }, 100));
    }
  };

  const renderDropdown = (item, isHovered, type) => (
    <div className="relative" onMouseEnter={() => handleDropdownHover(type, true)}>
      <div 
        className="flex items-center cursor-pointer text-white hover:text-gray-700 text-sm font-medium uppercase transition-colors duration-200"
      >
        {item.name} 
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
      </div>
      {isHovered && (
        <div 
          className="absolute left-0 mt-2 w-56 bg-[#fefaf6] rounded-md shadow-lg py-1 z-50 border border-gray-200"
          onMouseLeave={() => handleDropdownHover(type, false)}
        >
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {subItem.name}
            </RouterLink>
          ))}
        </div>
      )}
    </div>
  );

  const renderMobileDropdown = (item, isOpen, setOpen) => (
    <div className="flex flex-col">
      <button 
        className="flex justify-between items-center w-full py-2 px-3 rounded-md text-black hover:bg-gray-200 text-sm font-medium uppercase transition-colors duration-200"
        onClick={() => setOpen(!isOpen)}
      >
        {item.name} <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block py-2 px-3 rounded-md text-sm text-black hover:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                setIsOpen(false);
                setOpen(false);
              }}
            >
              {subItem.name}
            </RouterLink>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white md:bg-[#43265c] shadow border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => navigate('/')} className="cursor-pointer flex items-center">
            {/* Updated logo section with larger size on mobile */}
            <div className="flex items-center">
              <img 
                src={AGCLogo} 
                alt="Africa Gospel Church Logo" 
                className="h-12 md:h-12 object-contain" // Increased h-10 to h-12 for mobile
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.id} className="py-2">
                {item.dropdown ? (
                  item.id === 'ministries' ? renderDropdown(item, isMinistriesHovered, 'ministries') :
                  renderDropdown(item, isStrategiesHovered, 'strategies')
                ) : (
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className="text-sm font-medium uppercase text-white hover:text-purple-100 transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="hidden md:block">
            <Button 
              size="sm"
              onClick={() => navigate('/give')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition-colors duration-200 shadow hover:shadow-md cursor-pointer"
            >
              <HandCoins className="w-4 h-4" /> Give
            </Button>
          </div>
          
          {/* Mobile menu button - with black color for visibility on white bg */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-black md:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 rounded-b-lg shadow-xl max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col px-2 py-3 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.id} className="px-1">
                  {item.dropdown ? (
                    item.id === 'ministries' ? renderMobileDropdown(item, mobileMinistriesOpen, setMobileMinistriesOpen) :
                    renderMobileDropdown(item, mobileStrategiesOpen, setMobileStrategiesOpen)
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="w-full text-left py-2 px-3 rounded-md text-sm font-medium uppercase text-black hover:bg-gray-200 transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-gray-100">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors duration-200 shadow cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/give');
                }}
              >
                <HandCoins className="w-4 h-4" /> Give
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;