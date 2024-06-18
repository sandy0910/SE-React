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

    useEffect(() => {
        if (portalStatus === 2) {
            console.log("i am in ");
            navigate(`/student/hall-ticket-template`, { state: { student, courses, userId } });
        }
    }, [portalStatus, navigate, student, courses, userId]);

    return (
        <>
            {portalStatus !== 2 && (
                <div className="hall-ticket-container">
                    <div className="closed-portal">
                        <h2>Cannot Generate Hall Ticket</h2>
                        <p>Please check your pending dues. Contact Coe for any queries</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewHallTicket;
