import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

function UserPanel({ userData }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border-2 border-gray-300 overflow-hidden"
      >
        {userData && userData.images && userData.images.length > 0 ? (
          <img src={userData.images[0].url} alt="User Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
        )}
      </button>
      
      {isPanelOpen && (
        <div className="absolute top-14 right-0 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
          {userData && (
            <div className="px-4 py-2 border-b">
              <p className="font-semibold">{userData.display_name}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserPanel;