import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
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

  const isMinistryPage = location.pathname.startsWith('/ministries');
  const isStrategyPage = location.pathname.startsWith('/strategies');

  const handleNavigation = (id) => {
    if (id === 'gallery') {
      // Navigate to the gallery page
      navigate('/gallery');
      setIsOpen(false); // Close mobile menu if open
    } else if (isMinistryPage || isStrategyPage) {
      navigate(`/#${id}`);
      setIsOpen(false);
    } else {
      navigate(`/#${id}`, { replace: true });
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  const handleDropdownHover = (dropdownType, isEntering) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    if (isEntering) {
      if (dropdownType === 'ministries') setIsMinistriesHovered(true);
      if (dropdownType === 'strategies') setIsStrategiesHovered(true);
    } else {
      const timeout = setTimeout(() => {
        if (dropdownType === 'ministries') setIsMinistriesHovered(false);
        if (dropdownType === 'strategies') setIsStrategiesHovered(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  const renderDropdown = (item, isHovered, dropdownType) => (
    <>
      <div className="flex items-center cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider">
        {item.name}
        <ChevronDown className="ml-1 w-4 h-4" />
      </div>
      
      {isHovered && (
        <div 
          className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          onMouseEnter={() => handleDropdownHover(dropdownType, true)}
          onMouseLeave={() => handleDropdownHover(dropdownType, false)}
        >
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={() => {
                if (dropdownType === 'ministries') setIsMinistriesHovered(false);
                if (dropdownType === 'strategies') setIsStrategiesHovered(false);
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
              }}
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
        className="flex items-center justify-between w-full py-2 font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
        onClick={() => setOpen(!isOpen)}
      >
        {item.name}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="ml-4 mt-1 space-y-2">
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
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
    <nav 
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'hsla(45, 20%, 98%, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid hsla(35, 20%, 88%, 1)',
        boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.15)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {navigationItems.map((item) => (
              <div 
                key={item.id}
                className="relative py-2"
              >
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (item.id === 'ministries') handleDropdownHover('ministries', true);
                    if (item.id === 'strategies') handleDropdownHover('strategies', true);
                  }}
                  onMouseLeave={() => {
                    if (item.id === 'ministries') handleDropdownHover('ministries', false);
                    if (item.id === 'strategies') handleDropdownHover('strategies', false);
                  }}
                >
                  {item.dropdown ? (
                    item.id === 'ministries' ? 
                      renderDropdown(item, isMinistriesHovered, 'ministries') :
                      renderDropdown(item, isStrategiesHovered, 'strategies')
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Giving Button */}
          <div className="hidden md:block">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleNavigation('contact')}
              style={{
                background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%)',
                color: 'hsl(25, 35%, 25%)',
                fontWeight: 600
              }}
            >
              Give
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              style={{
                color: 'hsl(25, 25%, 15%)',
                backgroundColor: 'transparent',
              }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden animate-slide-down"
            style={{
              borderTop: '1px solid hsla(35, 20%, 88%, 1)',
              backgroundColor: 'hsla(45, 20%, 98%, 0.95)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex flex-col space-y-2 px-4 py-4">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  {item.dropdown ? (
                    item.id === 'ministries' ? 
                      renderMobileDropdown(item, mobileMinistriesOpen, setMobileMinistriesOpen) :
                      renderMobileDropdown(item, mobileStrategiesOpen, setMobileStrategiesOpen)
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="block py-2 w-full text-left font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div 
              className="px-2 pt-2 mt-3"
              style={{
                borderTop: '1px solid hsla(35, 20%, 88%, 1)'
              }}
            >
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleNavigation('contact')}
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%)',
                  color: 'hsl(25, 35%, 25%)',
                  fontWeight: 600
                }}
              >
                Give
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;