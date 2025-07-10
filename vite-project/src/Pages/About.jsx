import Navbar from "../Components/Navbar";
import { Button } from "../Components/ui/button";
import { Link } from "react-router-dom";
import MissionVision from "../Components/about/MissionVision";
import ChurchStory from "../Components/about/ChurchStory";
import ChurchValues from "../Components/about/ChurchValues";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
   
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Our Church
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about our history, mission, and the heart behind Kapsopmoita Africa Gospel Church
          </p>
        </div>
      </section>

      <MissionVision />
      <ChurchStory />
      <ChurchValues />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Join Our Family
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Experience the love of Christ and become part of our growing community. 
            Everyone is welcome at Kapsopmoita Africa Gospel Church.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/contact">Visit Us This Sunday</Link>
            </Button>
            <Button variant="gold" size="lg" asChild>
              <Link to="/events">See Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;