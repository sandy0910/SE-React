import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Profile.css'; // Import the CSS file

const Profile = ({ userId ,role}) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfile(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/student/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`profile-container role${role}`}>
      <h2 className="profile-title">Student Profile</h2>
      <div className="profile-details">
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.NAME}</p>
          <p><strong>Date of Birth:</strong> {profile.DOB}</p>
          <p><strong>Year of Joining:</strong> {profile.YOJ}</p>
          <p><strong>Mode of Admission:</strong> {profile.MODE_OF_ADDMISSION}</p>
          <p><strong>Gender:</strong> {profile.GENDER}</p>
          <p><strong>Quota:</strong> {profile.QUOTA}</p>
          <p><strong>Programme:</strong> {profile.PROGRAMME}</p>
          <p><strong>Department:</strong> {profile.name}</p>
          <p><strong>Semester:</strong> {profile.sem}</p>
          <p><strong>Address:</strong> {profile.ADDRESS}</p>
          <p><strong>Pincode:</strong> {profile.PINCODE}</p>
          <p><strong>Phone Number:</strong> {profile.PHONE_NO}</p>
        </div>
        <div className="profile-image">
          {profile.PHOTO && (
            <img src={`data:image/jpeg;base64,${profile.PHOTO}`} alt="Profile" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;