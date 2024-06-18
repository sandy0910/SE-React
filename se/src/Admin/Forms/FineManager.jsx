import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/FineManager.css';

const FineManager = () => {
    const [fines, setFines] = useState([]);

    useEffect(() => {
        fetchFines();
    }, []);

    const fetchFines = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/fine-manager');
            setFines(response.data);
        } catch (error) {
            console.error('Error fetching fines:', error);
        }
    };

    const updateFineStatus = async (id, flag) => {
        try {
            await axios.put(`http://localhost:3001/api/fine-manager/${id}/${flag}`);
            fetchFines();
        } catch (error) {
            console.error('Error updating fine status:', error);
        }
    };

    return (
        <div className="fine-manager">
            <h2>Fine Manager</h2>
            <table>
                <thead>
                    <tr>
                        <th>FID</th>
                        <th>REG NO</th>
                        <th>S_ID</th>
                        <th>FCODE</th>
                        <th>DESCRIPTION</th>
                        <th>DATE TIME</th>
                        <th>STATUS</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fines.map(fine => (
                        <tr key={fine.fid}>
                            <td>{fine.fid}</td>
                            <td>{fine.REG_NO}</td>
                            <td>{fine.S_ID}</td>
                            <td>{fine.FCODE}</td>
                            <td>{fine.DESCRIPTION}</td>
                            <td>{new Date(fine.DATE_TIME).toLocaleString()}</td>
                            <td>{fine.STATUS}</td>
                            <td>
                                {fine.STATUS === 1 && (
                                    <button className="cancel-button" onClick={() => updateFineStatus(fine.fid, '0')}>Cancel</button>
                                )}
                                {fine.STATUS === 4 && (
                                    <button className="revoke-button" onClick={() => updateFineStatus(fine.fid, '1')}>Revoke</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FineManager;
