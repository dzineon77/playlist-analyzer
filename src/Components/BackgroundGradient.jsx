const AnimatedCircle = ({ className }) => (
    <div 
      className={`absolute rounded-full mix-blend-multiply filter blur-xl ${className}`} 
      style={{ animation: 'float 20s infinite ease-in-out' }}
    />
  );
  
  const BackgroundGradient = () => (
    <>
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-light to-blue-light" />
        
        {/* Animated circles */}
        <div className="absolute inset-0">
            <AnimatedCircle 
            className="w-[500px] h-[500px] bg-green-light/40 -left-24 top-1/4 animate-float" 
            />
            <AnimatedCircle 
            className="w-[600px] h-[600px] bg-blue-light/40 right-1/3 -top-24 animate-float-delayed"
            />
            <AnimatedCircle 
            className="w-[400px] h-[400px] bg-green-light/40 left-1/3 bottom-1/4 animate-float-slow"
            />
            <AnimatedCircle 
            className="w-[300px] h-[300px] bg-blue-light/40 right-1/4 bottom-1/3 animate-float"
            />
        </div>
        
        {/* Overlay to soften the background */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[100px]" />
        </div>
    </>
  );

  export default BackgroundGradient;