import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HeadBox from '../components/HeadBox';
import NavBar from './NavBar';
import Profile from './Profile';
import ViewFine from './ViewFine';
import ViewHallTicket from './ViewHallTicket';
import PayFee from './PayFee';
import GenerateHallTicketPage from './GenerateHallTicketPage';

const DashboardStudent = () => {
  const [userId, setUserId] = useState('');
  const templateUrl = 'hall_ticket.pdf'

  useEffect(() => {
    const storedId = sessionStorage.getItem('id');
    if (storedId) {
      setUserId(storedId);
    }
  }, []);
  return (
    
    <div>
      <HeadBox role={1} />
      <NavBar role={1} />
      <Routes>
        <Route path="profile" element={<Profile userId={userId} role={1} />} />
        <Route path="view-fine" element={<ViewFine userId={userId} />} />
        <Route path="view-hallticket" element={<ViewHallTicket templateUrl={templateUrl} userId={userId} />} />
        <Route path="pay-fee" element={<PayFee userId={userId} />} />
        <Route path="generate-hall-ticket" element={<GenerateHallTicketPage userId={userId}/>} />
      </Routes>
    </div>
  );
};

export default DashboardStudent;
