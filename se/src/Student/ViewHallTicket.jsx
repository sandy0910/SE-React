import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewHallTicket = ({ userId }) => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchStudentAndCourses = async () => {
            try {
                const studentResponse = await axios.get(`http://localhost:3001/api/student/${userId}`);
                setStudent(studentResponse.data);

                const courseResponse = await axios.get(`http://localhost:3001/api/course/${userId}`);
                setCourses(courseResponse.data);
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
        <div className="hall-ticket-container">
            <h1>Hall Ticket</h1>
            <div>
                <h2>Student Details</h2>
                <p>Welcome, {student ? student.NAME : 'Student'}</p>
                <p>Your Programme: {student ? student.PROGRAMME : 'Programme'}</p>
                <p>Your Semester: {student ? student.sem : 'Semester'}</p>

                <h2>Exam Fee Payment</h2>
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
        </div>
    );
};

export default ViewHallTicket;
