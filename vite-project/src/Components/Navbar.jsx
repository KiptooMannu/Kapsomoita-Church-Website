import { useState } from "react";
import { Button } from "../Components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Components/common/Logo";
import NavigationMenu from "../Components/navigation/NavigationMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Ministries", href: "/ministries" },
    { name: "Sermons", href: "/sermons" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'hsla(45, 20%, 98%, 0.95)', // background with opacity
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid hsla(35, 20%, 88%, 1)',
        boxShadow: '0 4px 20px hsla(25, 85%, 45%, 0.15)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Church Name */}
          <Logo />

          {/* Desktop Navigation */}
          <NavigationMenu items={navigationItems} />

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
              <Link to="/giving">Give</Link>
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
                hoverBackgroundColor: 'hsla(35, 85%, 85%, 0.7)'
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
            <NavigationMenu 
              items={navigationItems} 
              isMobile={true} 
              onItemClick={() => setIsOpen(false)} 
            />
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
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 95%, 55%), hsl(35, 90%, 65%)',
                  color: 'hsl(25, 35%, 25%)',
                  fontWeight: 600
                }}
              >
                <Link to="/giving">Give</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;