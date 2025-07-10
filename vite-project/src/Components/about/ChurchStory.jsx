import { Button } from "../../Components/ui/button";
import { Heart, Book, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const ChurchStory = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A journey of faith that began with a vision to serve God and community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">Founded in Faith</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Kapsopmoita Africa Gospel Church was born out of a deep desire to serve God 
              and bring His love to the people of Kapsopmoita and the surrounding regions. 
              What started as a small gathering of believers has grown into a vibrant 
              community of faith.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our church has been a cornerstone of the community, providing not just 
              spiritual guidance but also practical support through various outreach 
              programs, education initiatives, and community development projects.
            </p>
            <Button variant="default" asChild>
              <Link to="/contact">
                Visit Our Church <Heart className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-warm border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">What We Believe</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Book className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">The Bible as God's inspired and authoritative Word</span>
              </li>
              <li className="flex items-start">
                <Heart className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Salvation through faith in Jesus Christ</span>
              </li>
              <li className="flex items-start">
                <Users className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">The importance of Christian community and fellowship</span>
              </li>
              <li className="flex items-start">
                <Globe className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">The call to serve others and spread the Gospel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChurchStory;