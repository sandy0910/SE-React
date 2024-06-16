import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ViewPayment.css'; // Import your CSS file here

const ViewPayment = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayment();
    }, []);

    const fetchPayment = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/view-payment');
            setPayments(response.data);
        } catch (err) {
            console.error("Error fetching payment", err);
        }
    };

    return (
        <div className="payments-container">
            <table className="payments-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Type</th>
                        <th>Semester</th>
                        <th>Transaction ID</th>
                        <th>Date of Payment</th>
                        <th>Mode of Payment</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td data-label="Register Number">{payment.REG_NO}</td>
                            <td data-label="Type">{payment.TYPE}</td>
                            <td data-label="Semester">{payment.fid}</td>
                            <td data-label="Transaction ID">{payment.TRANSACTION_ID}</td>
                            <td data-label="Date of Payment">{payment.DOP}</td>
                            <td data-label="Mode of Payment">{payment.MOP}</td>
                            <td data-label="Amount">{payment.AMOUNT}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPayment;
