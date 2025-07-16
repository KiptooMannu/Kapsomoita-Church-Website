import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, HandCoins } from "lucide-react";
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from "./common/Logo";

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
    if (['/ministries', '/strategies'].some(p => location.pathname.startsWith(p))) {
      navigate(`/#${id}`);
      setIsOpen(false);
    } else {
      navigate(`/#${id}`, { replace: true });
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleDropdownHover = (type, entering) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (entering) {
      type === 'ministries' && setIsMinistriesHovered(true);
      type === 'strategies' && setIsStrategiesHovered(true);
    } else {
      setHoverTimeout(setTimeout(() => {
        type === 'ministries' && setIsMinistriesHovered(false);
        type === 'strategies' && setIsStrategiesHovered(false);
      }, 300));
    }
  };

  const renderDropdown = (item, isHovered, type) => (
    <>
      <div className="flex items-center cursor-pointer text-gray-800 hover:text-orange-600 text-sm font-medium uppercase">
        {item.name} <ChevronDown className="ml-1 w-4 h-4" />
      </div>
      {isHovered && (
        <div 
          className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          onMouseEnter={() => handleDropdownHover(type, true)}
          onMouseLeave={() => handleDropdownHover(type, false)}
        >
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            >
              {subItem.name}
            </RouterLink>
          ))}
        </div>
      )}
    </>
  );

  const renderMobileDropdown = (item, isOpen, setOpen) => (
    <div className="flex flex-col">
      <button 
        className="flex justify-between items-center w-full py-2 text-gray-800 hover:text-orange-600 text-sm font-medium uppercase"
        onClick={() => setOpen(!isOpen)}
      >
        {item.name} <ChevronDown className={`w-4 h-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-2">
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block py-2 text-sm text-gray-700 hover:text-orange-600"
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
    <nav className="sticky top-0 z-50 bg-[hsla(45,20%,98%,0.95)] backdrop-blur border-b border-[hsla(35,20%,88%,1)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative py-2"
                onMouseEnter={() => item.id === 'ministries' || item.id === 'strategies' ? handleDropdownHover(item.id, true) : null}
                onMouseLeave={() => item.id === 'ministries' || item.id === 'strategies' ? handleDropdownHover(item.id, false) : null}
              >
                {item.dropdown ? (
                  item.id === 'ministries' ? renderDropdown(item, isMinistriesHovered, 'ministries') :
                  renderDropdown(item, isStrategiesHovered, 'strategies')
                ) : (
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className="text-sm font-medium uppercase text-gray-800 hover:text-orange-600"
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              <HandCoins className="w-4 h-4" /> Give
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden animate-slide-down border-t border-[hsla(35,20%,88%,1)] bg-[hsla(45,20%,98%,0.95)] backdrop-blur">
            <div className="flex flex-col px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  {item.dropdown ? (
                    item.id === 'ministries' ? renderMobileDropdown(item, mobileMinistriesOpen, setMobileMinistriesOpen) :
                    renderMobileDropdown(item, mobileStrategiesOpen, setMobileStrategiesOpen)
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="block w-full py-2 text-left text-sm font-medium uppercase text-gray-800 hover:text-orange-600"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 pt-2 mt-3 border-t border-[hsla(35,20%,88%,1)]">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
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
