import React from 'react';
import { useNavigate } from 'react-router';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem('token'); // or however you manage your tokens
    navigate('/'); // Redirect to the login page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to your Dashboard!</h1>
      <p>Navigate through the options below:</p>
      <ul>
        <li onClick={() => navigate('/profile')}>Profile</li>
        <li onClick={() => navigate('/settings')}>Settings</li>
        <li onClick={handleLogout} style={{ color: 'red', cursor: 'pointer' }}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
