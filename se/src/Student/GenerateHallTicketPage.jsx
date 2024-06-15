// GenerateHallTicketPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import HallTicketTemplate from './HallTicketTemplate';

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

    const generatePDF = () => {
        html2canvas(componentRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
            pdf.save('hall_ticket.pdf');
        });
    };

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
