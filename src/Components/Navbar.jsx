import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Menu, X, ChevronDown, HandCoins } from "lucide-react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AGCLogo from "../assets/agc.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinistriesHovered, setIsMinistriesHovered] = useState(false);
  const [isStrategiesHovered, setIsStrategiesHovered] = useState(false);
  const [mobileMinistriesOpen, setMobileMinistriesOpen] = useState(false);
  const [mobileStrategiesOpen, setMobileStrategiesOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const navigationItems = [
    { name: "Home", id: "home" },
    {
      name: "Ministries",
      id: "ministries",
      dropdown: [
        { name: "Youth Ministry", path: "/ministries/youth" },
        { name: "Women's Ministry", path: "/ministries/women" },
        { name: "Men's Ministry", path: "/ministries/men" },
        { name: "Kids Ministry", path: "/ministries/kids" },
      ],
    },
    {
      name: "Strategies",
      id: "strategies",
      dropdown: [
        { name: "E1: Evangelizing the Lost", path: "/strategies/evangelizing" },
        { name: "E2: Establishing Churches", path: "/strategies/establishing" },
        { name: "E3: Edifying Believers", path: "/strategies/edifying" },
        { name: "E4: Equipping Leaders", path: "/strategies/equipping" },
        { name: "E5: Exercising Compassion", path: "/strategies/compassion" },
      ],
    },
    { name: "About Us", id: "about" },
    { name: "Sermons", id: "sermons" },
    { name: "Events", id: "events" },
    { name: "Gallery", id: "gallery" },
    { name: "Contact", id: "contact" },
  ];

  const handleNavigation = (id) => {
    // 👇 always close dropdowns
    setIsMinistriesHovered(false);
    setIsStrategiesHovered(false);

    if (["/ministries", "/strategies"].some((p) => location.pathname.startsWith(p))) {
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
      if (type === "ministries") {
        setIsMinistriesHovered(true);
        setIsStrategiesHovered(false);
      }
      if (type === "strategies") {
        setIsStrategiesHovered(true);
        setIsMinistriesHovered(false);
      }
    } else {
      setHoverTimeout(
        setTimeout(() => {
          if (type === "ministries" && !isStrategiesHovered) setIsMinistriesHovered(false);
          if (type === "strategies" && !isMinistriesHovered) setIsStrategiesHovered(false);
        }, 120)
      );
    }
  };

  // 👇 close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMinistriesHovered(false);
        setIsStrategiesHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDropdown = (item, isHovered, type) => (
    <div className="relative group" onMouseEnter={() => handleDropdownHover(type, true)}>
      <div
        className="flex items-center cursor-pointer text-white hover:text-yellow-300 text-sm font-semibold uppercase tracking-wide transition-colors duration-200"
      >
        {item.name}
        <ChevronDown
          className={`ml-1 w-4 h-4 transition-transform ${isHovered ? "rotate-180" : ""}`}
        />
      </div>
      {isHovered && (
        <div
          className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-200 transform transition-all duration-300 origin-top scale-100"
          onMouseLeave={() => handleDropdownHover(type, false)}
        >
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block px-4 py-2 text-sm text-gray-800 hover:bg-purple-100 hover:text-purple-800 rounded-md transition-colors duration-200"
              onClick={() => {
                setIsMinistriesHovered(false);
                setIsStrategiesHovered(false);
              }}
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
        className="flex justify-between items-center w-full py-2 px-3 rounded-md text-black hover:bg-gray-100 font-semibold uppercase tracking-wide transition-colors duration-200"
        onClick={() => setOpen(!isOpen)}
      >
        {item.name}{" "}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.dropdown.map((subItem) => (
            <RouterLink
              key={subItem.path}
              to={subItem.path}
              className="block py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
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
      ref={navRef}
      className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 shadow-lg backdrop-blur-lg border-b border-purple-600"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center">
            <img
              src={AGCLogo}
              alt="Africa Gospel Church Logo"
              className="h-10 sm:h-12 md:h-14 lg:h-14 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <div key={item.id} className="py-2">
                {item.dropdown ? (
                  item.id === "ministries"
                    ? renderDropdown(item, isMinistriesHovered, "ministries")
                    : renderDropdown(item, isStrategiesHovered, "strategies")
                ) : (
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className="text-sm font-semibold uppercase tracking-wide text-white hover:text-yellow-300 transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <Button
              size="sm"
              onClick={() => navigate("/give")}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-5 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-xl"
            >
              <HandCoins className="w-4 h-4" /> Give
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-purple-900 hover:text-purple-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-b-xl shadow-lg max-h-[65vh] overflow-y-auto animate-slideDown">
            <div className="flex flex-col px-3 py-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.id} className="px-1">
                  {item.dropdown ? (
                    item.id === "ministries"
                      ? renderMobileDropdown(item, mobileMinistriesOpen, setMobileMinistriesOpen)
                      : renderMobileDropdown(item, mobileStrategiesOpen, setMobileStrategiesOpen)
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className="w-full text-left py-2 px-3 rounded-md font-semibold uppercase text-gray-900 hover:bg-purple-50 hover:text-purple-900 transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-gray-200">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-xl"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/give");
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
