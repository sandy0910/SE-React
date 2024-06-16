// HallTicketTemplate.jsx
import React, { useEffect } from 'react';
import './css/HallTicketTemplate.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const HallTicketTemplate = React.forwardRef(({ student, courses, userId }, ref) => {
    const calculateTotalAmount = () => {
        const examFees = courses.reduce((total, course) => total + parseFloat(course.AMOUNT || 0), 0);
        return examFees;
    };

    const getCurrentDate = () => {
        const currentTimestamp = Date.now();
        const currentDate = new Date(currentTimestamp);
        return currentDate.toLocaleDateString();
    };

    useEffect(() => {
        const generatePDF = () => {
            const input = document.getElementById('hall-ticket-template');

            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const width = pdf.internal.pageSize.getWidth();
                    const height = pdf.internal.pageSize.getHeight();
                    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                    pdf.save('hall_ticket.pdf');
                });
        };

        generatePDF(); // Automatically generate PDF when component mounts

        // Optionally, you can clean up or perform other actions here
        return () => {
            // Cleanup code if needed
        };
    }, [student, courses, userId]);

    return (
        <div className="hall-ticket-template" ref={ref} id="hall-ticket-template">
            <div className="header">
                <div className="university-logo">
                    <img src="/PTU.png" alt="University Logo" />
                </div>
                <div className="university-info">
                    <h1>PUDUCHERRY TECHNOLOGICAL UNIVERSITY</h1>
                    <h4>EXAMINATIONS WING</h4>
                    <h4>SEMESTER EXAMINATIONS</h4>
                </div>
                <div className="photo-placeholder">
                    <p>Paste your passport size photo here</p>
                </div>
            </div>
            <div className='ht-title'>
                <h1>HALL TICKET</h1>
            </div>
            <div className="htt-container">
                <div className="student-details-container">
                    <div className="student-details-column">
                        <p><strong>Register Number:</strong> {userId}</p>
                        <p><strong>Student Name:</strong> {student.NAME}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Programme:</strong> {student.PROGRAMME}</p>
                        <p><strong>Semester:</strong> {student.sem}</p>
                    </div>
                    <div className="student-details-column">
                        <p><strong>Department:</strong> {student.name}</p>
                        <p><strong>Application Fee (₹):</strong> 50</p>
                        <p><strong>Grade Sheet (₹):</strong> 100</p>
                        <p><strong>Total Amount Paid (₹):</strong> {calculateTotalAmount()}</p>
                        <p><strong>Generated on:</strong> {getCurrentDate()}</p>
                    </div>
                </div>
                <div className="exam-fee-payment">
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
                <div className="footer">
                    <p className="signature">Signature: ____________________</p>
                </div>
            </div>
        </div>
    );
});

export default HallTicketTemplate;
