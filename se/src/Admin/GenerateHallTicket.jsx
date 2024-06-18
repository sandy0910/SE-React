import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/GenerateHallTicket.css';

const GenerateHallTicket = () => {
    const [eligible, setEligible] = useState([]);
    const [rejectedRows, setRejectedRows] = useState({});
    const [ticketStatus, setTicketStatus] = useState({});

    useEffect(() => {
        fetchEligible();
    }, []);

    useEffect(() => {
        if (eligible.length > 0) {
            fetchStatus(eligible.map(elg => elg.REG_NO));
        }
    }, [eligible]);

    const fetchEligible = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/generate-hall-ticket');
            setEligible(response.data);
        } catch (err) {
            console.error("Error fetching eligible", err);
        }
    };

    const fetchStatus = async (regNos) => {
        try {
            const response = await axios.post('http://localhost:3001/api/get-ticket-status', { regNos });
            console.log("fetch status: ", response.data.status);
            setTicketStatus(response.data.status);
        } catch (err) {
            console.error("Error fetching ticket status", err);
        }
    };

    useEffect(() => {
        handleGenerateForAll();
    })
    const handleGenerateForAll = async () => {
        try {
            const regNos = eligible.map(elg => elg.REG_NO);
            const response = await axios.put('http://localhost:3001/api/update-hall-ticket?status=2', { regNos });
            console.log(response.data); // Log success message
            setTicketStatus({}); // Clear ticket status after generating for all

            // Optionally, you can fetch eligible students again to update the UI
            fetchEligible();
            fetchStatus(regNos);
        } catch (err) {
            console.error("Error updating hall ticket for all:", err);
        }
    };

    console.log("Ticket status: ", ticketStatus);
    return (
        <div className="h-t-container">
            <table className="h-t-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Semester</th>
                        <th>Programme</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {eligible.map((elg, index) => (
                        <tr key={index}>
                            <td>{elg.REG_NO}</td>
                            <td>{elg.sem}</td>
                            <td>{elg.PROGRAMME}</td>
                            <td>
                                {ticketStatus[elg.REG_NO] === 2 ? (
                                    <button className='reject-button'>Generated</button>
                                ) : (
                                    <button className='approve-button'>Approved</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenerateHallTicket;
