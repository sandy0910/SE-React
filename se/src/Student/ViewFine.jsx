import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ViewFine.css';

const ViewFine = ({ userId }) => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userContact, setUserContact] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  const openModal = (fine) => {
    setSelectedFine(fine);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserName('');
    setUserEmail('');
    setUserContact('');
  };

  const handlePayment = (e) => {
    e.preventDefault();

    var options = {
      key: "rzp_test_McwSUcwNGFPUuj",
      key_secret: "tMiEVgXMLywBs8e2EzN5cv0F",
      amount: selectedFine.AMOUNT * 100,
      currency: "INR",
      name: "STARTUP PROJECTS",
      description: "For testing purpose",
      handler: async (paymentResponse) => {
        setPaymentDetails(paymentResponse);

        // Send paymentDetails to the database with userId and fid
        try {
          const paymentData = await axios.get(`http://localhost:3001/payments/${paymentResponse.razorpay_payment_id}`);
          
          const res = await axios.post(`http://localhost:3001/api/specific-payment-details?userId=${userId}&fid=${selectedFine.fid}&ftype="fine"`, paymentData);
          if(res.data === "success"){
              //Update the status of fine manager by matching fid
              await axios.put(`http://localhost:3001/payments/update-fineManager`);
              window.location.reload();
          }
        } catch (error) {
          console.error('Error sending payment details:', error);
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userContact
      },
      notes: {
        address: "RazorPay Corporate Office"
      },
      theme: {
        color: "#3399cc"
      },
    };
    var razorpay = new window.Razorpay(options); // Corrected window.Razorpay
    razorpay.open();
    closeModal();
  };

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/fines/${userId}`);
        setFines(response.data);
      } catch (error) {
        setError('Error fetching fines data');
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [userId]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffResponse = await axios.get('http://localhost:3001/api/staff-details');
        setStaff(staffResponse.data);
      } catch (err) {
        setError('Error fetching staff data');
      }
    };

    fetchStaff();
  }, []);

  const getStatusText = (status) => {
    const statusMap = {
      1: { Status: 'Active', Color: 'red' },
      2: { Status: 'Paid', Color: '#74D246' },
      3: { Status: 'Withdrawn', Color: 'orange' },
      4: { Status: 'Cancelled', Color: 'grey' },
    };
    return statusMap[status] || { Status: 'Unknown', Color: 'black' };
  };

  const getStaffName = (staffId) => {
    const staffMember = staff.find((s) => s.S_ID === staffId);
    return staffMember ? staffMember.NAME : 'Unknown';
  };

  const getDepartmentName = (staffId) => {
    const staffMember = staff.find((s) => s.S_ID === staffId);
    return staffMember ? staffMember.name : 'Unknown';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="view-fine-container">
      <table className="fine-table">
        <thead>
          <tr>
            <th>Fine Code</th>
            <th>Type</th>
            <th>Description</th>
            <th>Staff Id</th>
            <th>Staff Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Summary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine, key) => {
            const { Status, Color } = getStatusText(fine.STATUS);
            return (
              <tr key={key} className={`row${Status}`}>
                <td>{fine.FCODE}</td>
                <td>{fine.TYPE}</td>
                <td>{fine.DESCRIPTION}</td>
                <td>{fine.S_ID}</td>
                <td>{getStaffName(fine.S_ID)}</td>
                <td>{getDepartmentName(fine.S_ID)}</td>
                <td>{new Date(fine.DATE_TIME).toLocaleString()}</td>
                <td>{Status}</td>
                <td>{fine.AMOUNT}</td>
                <td>{fine.SUMMARY}</td>
                <td>
                  {fine.STATUS === 1 ? (
                    <button onClick={() => openModal(fine)}>Pay Fine</button>
                  ) : (
                    <p style={{ textAlign: 'center' }}>-</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {paymentDetails && (
        <div className='payment-details'>
          <h3>Payment Details</h3>
          <p>Payment ID: {paymentDetails.razorpay_payment_id}</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Payment Details</h2>
            <form onSubmit={handlePayment}>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Enter your contact number"
                value={userContact}
                onChange={(e) => setUserContact(e.target.value)}
                required
              />
              <p>Amount to be paid: <strong>INR {selectedFine.AMOUNT}</strong></p>
              <button type="submit">Pay</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFine;
