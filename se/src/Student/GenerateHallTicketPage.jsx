// GenerateHallTicketPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import HallTicketTemplate from './HallTicketTemplate';
import './css/GenerateHallTicketPage.css'

const GenerateHallTicketPage = ({ userId }) => {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    useEffect(() => {
        const fetchStudentAndCourses = async () => {
            try {
                const studentResponse = await axios.get(`http://localhost:3001/api/student/${userId}`);
                setStudent(studentResponse.data);

                const courseResponse = await axios.get(`http://localhost:3001/api/course/${userId}`);
                setCourses(courseResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentAndCourses();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="generate-hall-ticket-page">
            <center><h1>Hall Ticket Details</h1></center>
            <div ref={componentRef}>
                <HallTicketTemplate student={student} courses={courses} userId={userId}/>
            </div>
        </div>
    );
};

export default GenerateHallTicketPage;
