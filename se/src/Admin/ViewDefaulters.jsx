import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ViewDefaulters.css'; // Import your CSS file here

const ViewDefaulters = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayment();
    }, []);

    const fetchPayment = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/view-payment-defaulter');
            setPayments(response.data);
        } catch (err) {
            console.error("Error fetching payment", err);
        }
    };

    return (
        <div className="defaulters-container">
            <table className="defaulters-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Name</th>
                        <th>Programme</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td data-label="Register Number">{payment.REG_NO}</td>
                            <td data-label="Name">{payment.NAME}</td>
                            <td data-label="Programme">{payment.PROGRAMME}</td>
                            <td data-label="Department">{payment.DEPARTMENT}</td>
                            <td data-label="Semester">{payment.sem}</td>
                            <td data-label="Email">{payment.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewDefaulters;
