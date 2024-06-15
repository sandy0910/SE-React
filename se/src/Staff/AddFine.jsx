import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AddFine.css';

const AddFine = ({ userId }) => {
    const [regNo, setRegNo] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const [fineDetails, setFineDetails] = useState({ S_ID: userId, FCODE: '', DESCRIPTION: '' });
    const [fineOptions, setFineOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFineOptions = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/fine-details');
                setFineOptions(response.data);
            } catch (error) {
                console.error('Error fetching fine details:', error);
                setError('Error fetching fine details');
            }
        };

        fetchFineOptions();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3001/api/student/${regNo}`);
            setStudentDetails(response.data);
        } catch (error) {
            setError('Error fetching student details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFineDetails({ ...fineDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/addfine', { ...fineDetails, REG_NO: regNo });
            alert('Fine added successfully');
            setStudentDetails(null);
            setFineDetails({ S_ID: {userId}, FCODE: '', DESCRIPTION: '' });
            setRegNo('');
        } catch (error) {
            console.error('Error adding fine:', error);
            alert('Failed to add fine');
        }
    };

    return (
        <div className="add-fine-container">
            <h2>Add Fine</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter Register Number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {loading && <div>Loading...</div>}

            {error && <div>{error}</div>}

            {studentDetails && (
                <>
                    <div className="student-card">
                        <div className="student-details">
                            <h3>Student Details</h3>
                            <p><strong>Name:</strong> {studentDetails.NAME}</p>
                            <p><strong>Date of Birth:</strong> {studentDetails.DOB}</p>
                            <p><strong>Year of Joining:</strong> {studentDetails.YOJ}</p>
                            <p><strong>Mode of Admission:</strong> {studentDetails.MODE_OF_ADDMISSION}</p>
                            <p><strong>Gender:</strong> {studentDetails.GENDER}</p>
                            <p><strong>Quota:</strong> {studentDetails.QUOTA}</p>
                            <p><strong>Programme:</strong> {studentDetails.PROGRAMME}</p>
                            <p><strong>Department:</strong> {studentDetails.name}</p>
                            <p><strong>Semester:</strong> {studentDetails.sem}</p>
                            <p><strong>Address:</strong> {studentDetails.ADDRESS}</p>
                            <p><strong>Pincode:</strong> {studentDetails.PINCODE}</p>
                            <p><strong>Phone Number:</strong> {studentDetails.PHONE_NO}</p>
                        </div>
                        <div className="student-photo">
                            {studentDetails.PHOTO && (
                                <img src={`data:image/jpeg;base64,${studentDetails.PHOTO}`} alt="Profile" />
                            )}
                        </div>
                    </div>
                    <form className="fine-form" onSubmit={handleSubmit}>
                        <h3>Add Fine</h3>
                        <label htmlFor="S_ID">Staff ID</label>
                        <input
                            type="text"
                            name="S_ID"
                            id="S_ID"
                            value={fineDetails.S_ID}
                            readOnly
                        />
                        <label htmlFor="REG_NO">Register Number</label>
                        <input
                            type="text"
                            name="REG_NO"
                            id="REG_NO"
                            value={regNo}
                            readOnly
                        />
                        <label htmlFor="FCODE">Fine Code</label>
                        <select
                            name="FCODE"
                            id="FCODE"
                            value={fineDetails.FCODE}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Fine Code</option>
                            {fineOptions.map((option) => (
                                <option key={option.FCODE} value={option.FCODE}>
                                    {option.TYPE}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="DESCRIPTION">Description</label>
                        <input
                            type="text"
                            name="DESCRIPTION"
                            id="DESCRIPTION"
                            value={fineDetails.DESCRIPTION}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit">Submit Fine</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default AddFine;
