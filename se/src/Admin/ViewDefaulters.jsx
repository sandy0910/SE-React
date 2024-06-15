import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            <table>
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
                            <td>{payment.REG_NO}</td>
                            <td>{payment.NAME}</td>
                            <td>{payment.PROGRAMME}</td>
                            <td>{payment.DEPARTMENT}</td>
                            <td>{payment.sem}</td>
                            <td>{payment.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewDefaulters;
