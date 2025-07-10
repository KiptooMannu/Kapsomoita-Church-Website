import { Target, Star } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-card rounded-lg p-8 shadow-warm border border-border">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To spread the Gospel of Jesus Christ throughout Africa and beyond, building a 
              community of believers who live out their faith through love, service, and worship. 
              We are committed to nurturing spiritual growth and making disciples who transform 
              their communities.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-card rounded-lg p-8 shadow-warm border border-border">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To be a beacon of hope and transformation in Africa, where every person 
              encounters the love of Christ and experiences spiritual growth. We envision 
              thriving communities rooted in faith, united in purpose, and empowered to 
              make a lasting impact for God's kingdom.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;