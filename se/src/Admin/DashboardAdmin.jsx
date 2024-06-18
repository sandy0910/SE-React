import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeadBox from '../components/HeadBox';
import NavBar from './NavBar';
import ViewDefaulters from './ViewDefaulters';
import GenerateHallTicket from './GenerateHallTicket';
import ViewPayment from './ViewPayment';
import EnablePayment from './EnablePayment';
import SendMail from './SendMail';
import FormCourse from './Forms/FormCourse';
import FormDept from './Forms/FormDept';
import FormFine from './Forms/FormFine';
import FormStaff from './Forms/FormStaff';
import FormStudent from './Forms/FormStudent';
import FineManager from './Forms/FineManager';

const DashboardAdmin = () => {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const id = sessionStorage.getItem('id') ? sessionStorage.getItem('id') : '';
        if (id) {
            setUserId(id);
        } else {
            alert("NO PERMISSION");
            navigate('/');
        }
    }, []);

    if (!userId) {
        return (
            <div>
                <p>Redirecting to login page...</p>
            </div>
        );
    }

    return (
        <div>
            <HeadBox role={0} />
            <NavBar role={0} />
            <div>
                <Routes>
                    <Route path='form/course' element={<FormCourse />} />
                    <Route path='form/dept' element={<FormDept />} />
                    <Route path='form/fine' element={<FormFine />} />
                    <Route path='form/staff' element={<FormStaff />} />
                    <Route path='form/student' element={<FormStudent />} />
                    <Route path='form/fine-manager' element={<FineManager/>} />
                    <Route path='view-defaulters' element={<ViewDefaulters />} />
                    <Route path='view-payment' element={<ViewPayment />} />
                    <Route path='enable-payment' element={<EnablePayment />} />
                    <Route path='send-mail' element={<SendMail />} />
                </Routes>
            </div>
        </div>
    );
};

export default DashboardAdmin;
