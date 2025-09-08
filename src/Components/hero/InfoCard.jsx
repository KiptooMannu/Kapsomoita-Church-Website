const InfoCard = ({ icon: Icon, title, mainText, subText, iconColor, bgColor, borderColor }) => {
  return (
    <div 
      className="p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <Icon 
          className="w-8 h-8" 
          style={{ color: iconColor }}
        />
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="font-medium text-gray-900">{mainText}</p>
        <p className="text-sm text-gray-600">{subText}</p>
      </div>
    </div>
  );
};

export default InfoCard;  