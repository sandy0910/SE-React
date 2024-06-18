import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/HallTicketTemplate.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const HallTicketTemplate = () => {
    const location = useLocation();
    const { student, courses, userId } = location.state;

    const calculateTotalAmount = () => {
        const examFees = courses.reduce((total, course) => total + parseFloat(course.AMOUNT || 0), 0);
        return examFees; // Adding fixed fees (Application Fee: 50 + Grade Sheet: 100)
    };

    const getCurrentDate = () => {
        const currentTimestamp = Date.now();
        const currentDate = new Date(currentTimestamp);
        return currentDate.toLocaleDateString();
    };

    const generatePDF = () => {
        const input = document.getElementById('hall-ticket-template');

        html2canvas(input, { scale: 2 }).then((canvas) => { // Increased scale for better quality
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Add footer with signatures on every page
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                const imgHeightMM = 10; // Height of the image in mm
                const imgWidthMM = 30; // Width of the image in mm
                const imgX = 10; // X position of the image (left side)
                const imgY = pageHeight - 30; // Y position of the image (bottom)
                pdf.addImage('/director.png', 'PNG', imgX, imgY, imgWidthMM, imgHeightMM);
                pdf.setFontSize(12);
                pdf.text(15, pageHeight - 15, 'Director(Examinations)');
                pdf.text(imgWidth - 50, pageHeight - 15, 'Student\'s Signature');
            }

            pdf.save('hall_ticket.pdf');
        });
    };

    return (
        <>
            <div className="hall-ticket-template" id="hall-ticket-template">
                <div className='red-box'></div>
                <div className="header">
                    <div className="university-logo">
                        <img src="/PTU.png" alt="University Logo" />
                    </div>
                    <div className="university-info">
                        <h1>PUDUCHERRY TECHNOLOGICAL UNIVERSITY</h1>
                        <h4>EXAMINATIONS WING</h4>
                        <h4>SEMESTER EXAMINATIONS</h4>
                    </div>
                    <div className="photo">
                        <img src={`data:image/jpeg;base64,${student.PHOTO}`} alt="Student Photo" />
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
                        <h2>COURSES REGISTERED</h2>
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
                </div>
            </div>
            <button className='download-button' onClick={generatePDF}>Download Hall Ticket</button>
        </>
    );
};

export default HallTicketTemplate;
