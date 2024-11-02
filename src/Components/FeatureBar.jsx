const FeatureBar = ({ value, label, icon: Icon }) => (
    <>

      <div className="mb-2">
        <div className="flex items-center mb-1">
          <Icon size={16} className="mr-2 text-green-600" />
          <span className="text-lg text-gray-600">{label}</span>
          <span className="ml-auto text-lg font-medium">{Math.round(value * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${value * 100}%` }}
          />
        </div>
      </div>
      
    </>
  );

  export default FeatureBar;