import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

const Alert = ({ message, title, onClose, autoClose = true, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] md:w-auto">
      <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-3 md:p-4 animate-in fade-in slide-in-from-top duration-300 max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500 mr-2" />
            <h3 className="text-xs md:text-sm font-semibold text-gray-800">
              {title}
            </h3>
          </div>
        </div>
        <p className="mt-1 text-xs md:text-sm text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Alert;