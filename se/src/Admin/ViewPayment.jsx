import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Switch from 'react-switch';
import './css/ViewPayment.css'; // Import your CSS file here

const ViewPayment = () => {
    const [payments, setPayments] = useState([]);
    const [view, setView] = useState('fee');

    useEffect(() => {
        fetchPayment(view);
    }, [view]);

    const fetchPayment = async (type) => {
        try {
            const apiUrl = type === 'fee' ? `http://localhost:3001/api/view-payment?type=fee` : `http://localhost:3001/api/view-payment?type=fine`;
            const response = await axios.get(apiUrl);
            setPayments(response.data);
        } catch (err) {
            console.error(`Error fetching ${type} payments`, err);
        }
    };

    const handleToggle = () => {
        setView(view === 'fee' ? 'fine' : 'fee');
    };

    return (
        <div className="payments-container">
            <div className="toggle-container">
                <span>Fee Payments</span>
                <Switch 
                    onChange={handleToggle} 
                    checked={view === 'fine'} 
                    offColor="#333"
                    onColor="#b60000"
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <span>Fine Payments</span>
            </div>
            <table className="payments-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        {view === 'fee' ? (
                            <>
                                <th>Type</th>
                                <th>Semester</th>
                                <th>Transaction ID</th>
                                <th>Date of Payment</th>
                                <th>Mode of Payment</th>
                                <th>Amount</th>
                            </>
                        ) : (
                            <>
                                <th>Fine type</th>
                                <th>Transaction ID</th>
                                <th>Date of Payment</th>
                                <th>Amount</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={index}>
                            <td data-label="Register Number">{payment.REG_NO}</td>
                            {view === 'fee' ? (
                                <>
                                    <td data-label="Type">{payment.TYPE}</td>
                                    <td data-label="Semester">{payment.fid}</td>
                                    <td data-label="Transaction ID">{payment.TRANSACTION_ID}</td>
                                    <td data-label="Date of Payment">{payment.DOP}</td>
                                    <td data-label="Mode of Payment">{payment.MOP}</td>
                                    <td data-label="Amount">{payment.AMOUNT}</td>
                                </>
                            ) : (
                                <>
                                    <td data-label="Fine type">{payment.FTYPE}</td>
                                    <td data-label="Transaction ID">{payment.TRANSACTION_ID}</td>
                                    <td data-label="Date of Payment">{payment.DOP}</td>
                                    <td data-label="Amount">{payment.AMOUNT}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewPayment;
