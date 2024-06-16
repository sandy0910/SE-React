import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/ViewHallTicket.css';

const ViewHallTicket = ({ userId }) => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [portalStatus, setPortalStatus] = useState(null);

    useEffect(() => {
        const fetchStudentAndCourses = async () => {
            try {
                const studentResponse = await axios.get(`http://localhost:3001/api/student/${userId}`);
                setStudent(studentResponse.data);

                const courseResponse = await axios.get(`http://localhost:3001/api/course/${userId}`);
                setCourses(courseResponse.data);

                const portalResponse = await axios.get(`http://localhost:3001/api/check-hall-ticket/${userId}`);
                setPortalStatus(portalResponse.data[0].status);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userId) {
            fetchStudentAndCourses();
        }
    }, [userId]);

    const handleGenerateHallTicket = () => {
        navigate(`/student/generate-hall-ticket`);
    };

    return (
        <>
        <div className="hall-ticket-container">
            {portalStatus === 2 ? (
            <center><div className="background-layer"></div>
            <div className="content-layer">
                <h1>View Hall Ticket Details</h1><br/>
                <div>
                    <h2>Student Details</h2><br/>
                    <div  className='student-det'>
                    <p><strong>{student ? student.NAME : 'Student'}</strong></p>
                    <p><strong>{student? userId : 'Register No'} </strong></p>
                    <p><strong>{student ? student.PROGRAMME : 'Programme'}</strong></p>
                    <p><strong>{student ? student.sem : 'Semester'} Sem</strong></p>
                    <p><strong>{student ? student.name : 'Department'}</strong></p>
                    </div>

                    <h2>Course Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Type</th>
                                <th>Credit</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.COURSE_ID}>
                                    <td>{course.COURSE_ID}</td>
                                    <td>{course.CNAME}</td>
                                    <td>{course.TYPE}</td>
                                    <td>{course.CREDIT}</td>
                                    <td>{course.AMOUNT}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className='generate-hall-ticket' onClick={handleGenerateHallTicket}>Generate Hall Ticket</button>
            </div></center>
                ) : (
                <div className="closed-portal">
                    <h2>Cannot Generate Hall Ticket</h2>
                    <p>Please check your pending dues. Contact Coe for any queries</p>
                </div>)}
        </div>
        </>
    );
};

export default ViewHallTicket;
