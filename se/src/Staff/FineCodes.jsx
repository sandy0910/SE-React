import React , { useState , useEffect } from 'react';
import axios from 'axios';
import './css/ViewFine.css';

const FineCodes = () => {
    const [fines, setFines] = useState([]);
    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/fine-details');
                setFines(response.data);
            } catch (error) {
                console.error('Error fetching fines:', error);
            }
        };

        fetchFines();
    }, []);
    return (
        <div className="table-container">
                <>
                    <h2 className="table-title">Fines</h2>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>Fine Code</th>
                                <th>Type</th>
                                
                                <th>Amount</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fines.map((fine) => (
                                <tr key={fine.FCODE}>
                                    <td>{fine.FCODE}</td>
                                    <td style={{whiteSpace:'pre-wrap'}}>{fine.TYPE}</td>
                                    <td>{fine.AMOUNT}</td>
                                    <td style={{whiteSpace:'pre-wrap'}}>{fine.SUMMARY}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
        </div>
    );
};

export default FineCodes;