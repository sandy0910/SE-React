import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            <table>
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
                            <td>{payment.REG_NO}</td>
                            <td>{payment.TYPE}</td>
                            <td>{payment.fid}</td>
                            <td>{payment.TRANSACTION_ID}</td>
                            <td>{payment.DOP}</td>
                            <td>{payment.MOP}</td>
                            <td>{payment.AMOUNT}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPayment;
