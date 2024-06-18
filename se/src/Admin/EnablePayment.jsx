import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/EnablePayment.css';

// Modal component to display opened portals
const Modal = ({ isOpen, onClose, portals, onClosePortal }) => {
    if (!isOpen) return null;

    return (
        <div className="epp-modal-overlay">
            <div className="epp-modal-content">
                <h2>Opened Portals</h2>
                <button onClick={onClose} className="modal-close-button">&times;</button>
                <div className="portal-grid">
                    {portals.length === 0 ? (
                        <p>No portals are currently opened.</p>
                    ) : (
                        portals.map((portal, index) => (
                            <div className="portal-card" key={index}>
                                <h4><b>PROGRAMME : </b>{portal.PROG}</h4>
                                <p><b>SEMESTER : </b>{portal.SEM}</p>
                                <p><b>DUE : </b>📅{portal.DUED} ⌛{portal.DUET}</p>
                                <button className="close-button" onClick={() => onClosePortal(portal.PROG, portal.SEM)}>Close Portal</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const EnablePayment = () => {
    const [programme, setProgramme] = useState('');
    const [semester, setSemester] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [openedPortals, setOpenedPortals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOpenedPortals();
    }, []);

    const fetchOpenedPortals = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/getOpenedPortals');
            if (response.status === 200) {
                setOpenedPortals(response.data);
            } else {
                alert('Error fetching opened portals');
            }
        } catch (error) {
            console.error('There was an error fetching the opened portals!', error);
            alert('Error fetching opened portals');
        }
    };

    const handleOpenPortal = async () => {
        if (!dueDate) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/updatePortalStatus', {
                prog: programme,
                sem: semester,
                dued: dueDate,
                duet: dueTime,
                status: 1
            });

            if (response.status === 200) {
                alert('Portal opened successfully');
                fetchOpenedPortals(); // Refresh the list of opened portals
            } else {
                alert('Error opening portal');
            }
        } catch (error) {
            console.error('There was an error opening the portal!', error);
            alert('Error opening portal');
        }
    };

    const handleClosePortal = async (prog, sem) => {
        try {
            const response = await axios.post('http://localhost:3001/api/updatePortalStatus', {
                prog: prog,
                sem: sem,
                dued: null,
                duet: null,
                status: 0
            });

            if (response.status === 200) {
                alert('Portal closed successfully');
                fetchOpenedPortals(); // Refresh the list of opened portals
            } else {
                alert('Error closing portal');
            }
        } catch (error) {
            console.error('There was an error closing the portal!', error);
            alert('Error closing portal');
        }
    };

    const handleCloseAllPortal = async (prog, sem) => {
        try {
            const response = await axios.post('http://localhost:3001/api/updatePortalStatus', {
                prog: '',
                sem: '',
                dued: null,
                duet: null,
                status: 0
            });

            if (response.status === 200) {
                alert('Portal closed successfully');
                fetchOpenedPortals(); // Refresh the list of opened portals
            } else {
                alert('Error closing portal');
            }
        } catch (error) {
            console.error('There was an error closing the portal!', error);
            alert('Error closing portal');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Enable Payment Portal</h2>
            </div>
            <form>
                <div>
                    <label>
                        Programme:
                        <select 
                            value={programme} 
                            onChange={(e) => setProgramme(e.target.value)} 
                            className="input-field"
                        >
                            <option value="">Select Programme</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="MBA">MBA</option>
                            <option value="MCA">MCA</option>
                            <option value="MSc">MSc</option>
                            {/* Add more options as needed */}
                        </select>
                    </label>
                    <label>
                        Semester:
                        <input 
                            type="number" 
                            placeholder='Enter semester'
                            value={semester} 
                            onChange={(e) => setSemester(e.target.value)} 
                            className="input-field"
                        />
                    </label>
                    <label>
                        Due Date:
                        <input 
                            type="date" 
                            value={dueDate} 
                            onChange={(e) => setDueDate(e.target.value)} 
                            className="input-field"
                            required
                        />
                    </label>
                    <label>
                        Due Time:
                        <input 
                            type="time" 
                            value={dueTime} 
                            onChange={(e) => setDueTime(e.target.value)} 
                            className="input-field"
                        />
                    </label>
                    <div className='button-container'> 
                        <button 
                            type="button" 
                            onClick={handleOpenPortal} 
                            className="button open-portal"
                        >
                            Open Portal
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleCloseAllPortal(programme, semester)} 
                            className="button close-portal"
                        >
                            Close All Portal
                        </button>
                    </div>
                </div>
                <button type="button" onClick={handleOpenModal} className='button open-portals'>Opened Portals</button>
            </form>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                portals={openedPortals}
                onClosePortal={handleClosePortal}
            />
        </div>
    );
};

export default EnablePayment;
