import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../NavBar.css';

const NavBar = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className={`navigation role${role}`}>
      <div className='inner' onClick={() => navigate('profile')}>Student Profile</div>
      <div className='inner' onClick={() => navigate('view-fine')}>View Fine</div>
      <div className='inner' onClick={() => navigate('view-hallticket')}>View HallTicket</div>
      <div className='inner' onClick={() => navigate('pay-fee')}>Pay Fee</div>
    </div>
  );
};

export default NavBar;
