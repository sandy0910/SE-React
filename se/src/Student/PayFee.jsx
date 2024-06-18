import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PayFee.css';

const PayFee = ({ userId }) => {
    const [student, setStudent] = useState(null);
    const [portalStatus, setPortalStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userContact, setUserContact] = useState('');
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
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

        const totalAmount = calculateTotalAmount();

        var options = {
            key: "rzp_test_McwSUcwNGFPUuj",
            key_secret: "tMiEVgXMLywBs8e2EzN5cv0F",
            amount: totalAmount * 100,
            currency: "INR",
            name: "STARTUP PROJECTS",
            description: "For testing purpose",
            handler: async (paymentResponse) => {
                setPaymentDetails(paymentResponse);

                try {
                    const paymentData = await axios.get(`http://localhost:3001/payments/${paymentResponse.razorpay_payment_id}`);
                    await axios.post(`http://localhost:3001/api/fee-payment-details?userId=${userId}&sem=${student.sem}`, paymentData);
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
        var razorpay = new window.Razorpay(options);
        razorpay.open();
        closeModal();
    };

    useEffect(() => {
        const fetchStudentAndPortalStatus = async () => {
            try {
                const studentResponse = await axios.get(`http://localhost:3001/api/student/${userId}`);
                const studentData = studentResponse.data;
                const prog = studentData.PROGRAMME;
                const sem = studentData.sem;
                
                const [portalResponse, courseResponse, paymentResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/api/portal/${prog}/${sem}`),
                    axios.get(`http://localhost:3001/api/course/${userId}`),
                    axios.get(`http://localhost:3001/api/payments/${userId}/${sem}`)
                ]);
                
    
                setStudent(studentData);
                setCourses(courseResponse.data);

                const currentTimestamp = Date.now(); // Get current timestamp in milliseconds
                let currentDate = new Date(currentTimestamp); // Convert timestamp to Date object
                let dueDateTime = null;
                if(portalResponse.data.out.DUED !== null){
                    // Parse portal due date and time
                    const dueDateParts = portalResponse.data.out.DUED.split('-').map(part => parseInt(part));
                    const dueTimeParts = portalResponse.data.out.DUET.split(':').map(part => parseInt(part));
                    dueDateTime = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0], dueTimeParts[0], dueTimeParts[1], dueTimeParts[2]); 
                }

                if(currentDate <= dueDateTime){
                    console.log(true);
                }else{
                    console.log(false);
                }

                if(currentDate <= dueDateTime || 
                    (portalResponse.data.out.DUED === null && portalResponse.data.out.DUET === null)
                ){
                    // Check if payment record exists for the user and current semester
                    if (paymentResponse.data.out == 2) {
                        setPortalStatus(2); // If payment exists, set portalStatus to 2
                    } else {
                        setPortalStatus(portalResponse.data.out.STATUS); // Otherwise, use the status from portal response
                    }
                }else{
                    window.location.reload;
                    setPortalStatus(3);
                }
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudentAndPortalStatus();
    }, [userId]);
    

    const calculateTotalAmount = () => {
        return courses.reduce((total, course) => total + parseFloat(course.AMOUNT || 0), 0);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    console.log(portalStatus);

    return (
        <div className="payfee-container">
            {portalStatus === 1 ? (
                <div>
                    <h2>Exam Fee Payment</h2>
                    <p>Welcome, {student.NAME}</p>
                    <p>Your Programme: {student.PROGRAMME}</p>
                    <p>Your Semester: {student.sem}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Type</th>
                                <th>Credit</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.COURSE_ID}>
                                    <td>{course.COURSE_ID}</td>
                                    <td>{course.CNAME}</td>
                                    <td>{course.TYPE}</td>
                                    <td>{course.CREDIT}</td>
                                    <td>{course.AMOUNT}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='total-display'>
                        <strong>TOTAL: {calculateTotalAmount()}</strong>
                        <br />
                        <button onClick={openModal}>Pay Fee</button>
                    </div>
                </div>
            ) : portalStatus === 0 ? (
                <div className="closed-portal">
                    <h2>Portal is Closed</h2>
                    <p>The payment portal is currently closed. Please check back later.</p>
                </div>
            ) : portalStatus === 2 ?(
                <div className="closed-portal">
                    <h2>Fee Already Paid</h2>
                    <p>You have already paid the exam fee. Thank you!</p>
                </div>
            ) : (
                <div className="closed-portal">
                    <h2>Due Date Expired</h2>
                    <p>The Due date for exam fee is over. Contact Admin for any queries</p>
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
                            <p>Amount to be paid:<strong> INR {calculateTotalAmount()} </strong></p>
                            <button type="submit">Pay</button>
                            <button type="button" onClick={closeModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayFee;
