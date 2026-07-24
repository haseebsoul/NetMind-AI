import React from 'react';

const Profile = () => {
  return (
    <div className="profile-container">
      <img 
        src="/haseeb.jpeg" 
        alt="Haseeb's profile" 
        className="profile-avatar"
        style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
      />
      <h2>Haseeb</h2>
      {/* Add your other profile info here */}
    </div>
  );
};

export default Profile;
