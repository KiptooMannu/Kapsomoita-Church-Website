const InfoCard = ({ icon: Icon, title, mainText, subText }) => {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-warm border border-border">
        <div className="flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-primary mr-2" />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-muted-foreground">{mainText}</p>
        <p className="text-sm text-muted-foreground mt-1">{subText}</p>
      </div>
    );
  };
  
  export default InfoCard;