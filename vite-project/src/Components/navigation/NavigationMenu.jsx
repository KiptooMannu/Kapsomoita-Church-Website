import { Button } from "../../Components/ui/button";
import { Link } from "react-router-dom";

const NavigationMenu = ({ items, isMobile = false, onItemClick }) => {
  if (isMobile) {
    return (
      <div className="px-2 pt-2 pb-3 space-y-1">
        {items.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-accent/70"
            asChild
            onClick={onItemClick}
          >
            <Link to={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-1">
      {items.map((item) => (
        <Button
          key={item.name}
          variant="nav-link"
          size="sm"
          asChild
        >
          <Link to={item.href}>{item.name}</Link>
        </Button>
      ))}
    </div>
  );
};

export default NavigationMenu;