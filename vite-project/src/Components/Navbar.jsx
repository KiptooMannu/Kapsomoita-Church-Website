import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from "./common/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinistriesHovered, setIsMinistriesHovered] = useState(false);
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "home", offset: -100 },
    { 
      name: "Ministries", 
      href: "ministries", 
      offset: -80,
      dropdown: [
        { name: "Youth Ministry", path: "/ministries/youth" },
        { name: "Women's Ministry", path: "/ministries/women" },
        { name: "Men's Ministry", path: "/ministries/men" },
        { name: "Kids Ministry", path: "/ministries/kids" }
      ]
    },
    { name: "About Us", href: "about", offset: -80 },
    { name: "Sermons", href: "sermons", offset: -80 },
    { name: "Events", href: "events", offset: -80 },
    { name: "Gallery", href: "gallery", offset: -80 },
    { name: "Contact", href: "contact", offset: -80 },
  ];

  // Check if we're on a ministry page
  const isMinistryPage = location.pathname.startsWith('/ministries');

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
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {navigationItems.map((item) => (
              <div 
                key={item.href}
                className="relative"
                onMouseEnter={() => item.dropdown && setIsMinistriesHovered(true)}
                onMouseLeave={() => item.dropdown && setIsMinistriesHovered(false)}
              >
                {item.dropdown ? (
                  <>
                    <div className="flex items-center cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider">
                      {item.name}
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </div>
                    
                    {isMinistriesHovered && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                        {item.dropdown.map((subItem) => (
                          <RouterLink
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setIsMinistriesHovered(false)}
                          >
                            {subItem.name}
                          </RouterLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  isMinistryPage ? (
                    <RouterLink
                      to={`/#${item.href}`}
                      className="cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                    >
                      {item.name}
                    </RouterLink>
                  ) : (
                    <ScrollLink
                      activeClass="active-nav-item"
                      to={item.href}
                      spy={true}
                      smooth={true}
                      offset={item.offset}
                      duration={500}
                      className="cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                    >
                      {item.name}
                    </ScrollLink>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Giving Button */}
          <div className="hidden md:block">
            <Button 
              variant="gold" 
              size="sm"
              asChild
              style={{
                background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%)',
                color: 'hsl(25, 35%, 25%)',
                fontWeight: 600
              }}
            >
              {isMinistryPage ? (
                <RouterLink to="/#contact" className="cursor-pointer">
                  Give
                </RouterLink>
              ) : (
                <ScrollLink
                  to="contact"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="cursor-pointer"
                >
                  Give
                </ScrollLink>
              )}
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
                <div key={item.href}>
                  {item.dropdown ? (
                    <div className="flex flex-col">
                      <button 
                        className="flex items-center justify-between w-full py-2 font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                        onClick={() => setMobileMinistriesOpen(!mobileMinistriesOpen)}
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileMinistriesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {mobileMinistriesOpen && (
                        <div className="ml-4 mt-1 space-y-2">
                          {item.dropdown.map((subItem) => (
                            <RouterLink
                              key={subItem.path}
                              to={subItem.path}
                              className="block py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                              onClick={() => {
                                setIsOpen(false);
                                setMobileMinistriesOpen(false);
                              }}
                            >
                              {subItem.name}
                            </RouterLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    isMinistryPage ? (
                      <RouterLink
                        to={`/#${item.href}`}
                        className="block py-2 cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </RouterLink>
                    ) : (
                      <ScrollLink
                        activeClass="active-nav-item"
                        to={item.href}
                        spy={true}
                        smooth={true}
                        offset={item.offset}
                        duration={500}
                        className="block py-2 cursor-pointer font-medium text-gray-800 hover:text-orange-600 transition-colors text-sm uppercase tracking-wider"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </ScrollLink>
                    )
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
                variant="gold"
                className="w-full"
                asChild
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%)',
                  color: 'hsl(25, 35%, 25%)',
                  fontWeight: 600
                }}
              >
                {isMinistryPage ? (
                  <RouterLink to="/#contact" className="cursor-pointer" onClick={() => setIsOpen(false)}>
                    Give
                  </RouterLink>
                ) : (
                  <ScrollLink
                    to="contact"
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Give
                  </ScrollLink>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;