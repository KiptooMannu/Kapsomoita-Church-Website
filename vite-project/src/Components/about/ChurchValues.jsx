import { Heart, Users, Book, Globe, Target, Star } from "lucide-react";

const ChurchValues = () => {
  const values = [
    {
      icon: Heart,
      title: "Love",
      description: "We love God with all our hearts and love our neighbors as ourselves, showing Christ's love in all we do."
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of fellowship and building strong relationships that support and encourage one another."
    },
    {
      icon: Book,
      title: "Truth",
      description: "We are committed to biblical truth and teaching God's Word with integrity and faithfulness."
    },
    {
      icon: Globe,
      title: "Service",
      description: "We actively serve our community and reach out to those in need, following Christ's example of service."
    },
    {
      icon: Target,
      title: "Purpose",
      description: "We live with intentionality, knowing that God has called us to make a difference in this world."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in worship, ministry, and service, giving our best for God's glory."
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-warm border border-border text-center">
              <value.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChurchValues;