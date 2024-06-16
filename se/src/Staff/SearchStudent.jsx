import React, { useState } from 'react';
import axios from 'axios';
import './css/SearchStudent.css';

const SearchStudent = ({ userId }) => {
    const [regNo, setRegNo] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const [fineRecords, setFineRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const studentResponse = await axios.get(`http://localhost:3001/api/student/${regNo}`);
            setStudentDetails(studentResponse.data);

            const finesResponse = await axios.get(`http://localhost:3001/api/fines/${regNo}/${userId}`);
            setFineRecords(finesResponse.data);
        } catch (error) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (fid) => {
        try {
            await axios.put(`http://localhost:3001/api/fine/withdraw/${fid}`);
            alert('Fine withdrawn successfully');
            handleSearch(); // Refresh the fine records after withdrawal
        } catch (error) {
            console.error('Error withdrawing fine:', error);
            alert('Failed to withdraw fine');
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            1: { Status: 'Active', Color: 'red' },
            2: { Status: 'Paid', Color: '#74D246' },
            3: { Status: 'Withdrawn', Color: 'orange' },
            4: { Status: 'Cancelled', Color: 'grey' },
        };
        return statusMap[status] || { Status: 'Unknown', Color: 'black' };
    };

    return (
        <div className="search-student-container">
            <h2>Search Student</h2>
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

                    <div className="fine-records">
                        <h3>Fine Records</h3>
                        {fineRecords.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fine Code</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Staff ID</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fineRecords.map((fine) => {
                                        const { Status, Color } = getStatusText(fine.STATUS);
                                        return (
                                            <tr key={fine.fid} className={`row${Status}`}>
                                                <td>{fine.FCODE}</td>
                                                <td>{fine.DESCRIPTION}</td>
                                                <td>{new Date(fine.DATE_TIME).toLocaleString()}</td>
                                                <td >{Status}</td>
                                                <td>{fine.S_ID}</td>
                                                <td>
                                                    {fine.STATUS === 1 && fine.S_ID === userId ? (
                                                        <button className='withdraw-button' onClick={() => handleWithdraw(fine.fid)}>Withdraw</button>
                                                    ) : (
                                                        <p style={{ textAlign: 'center' }}>-</p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No fines found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchStudent;
