import React, { useState, useEffect } from 'react';
import { Routes , Route} from 'react-router-dom';
import HeadBox from '../components/HeadBox';
import NavBar from './NavBar';
import Profile from './Profile'
import SearchStudent from './SearchStudent'
import AddFine from './AddFine'
import FineCodes from './FineCodes'
const DashboardStaff = () => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const storedId = sessionStorage.getItem('id');
        if (storedId) {
        setUserId(storedId);
        }
    }, []);
    return (
        <div>
             <HeadBox role={2}/>
             <NavBar role={2}/>
             <Routes>
                <Route path='profile' element={<Profile userId={userId} role={2}/>}/>
                <Route path='search-student' element={<SearchStudent userId={userId}/>}/>
                <Route path='add-fine' element={<AddFine userId={userId}/>}/>
                <Route path='fine-details' element={<FineCodes />}/>
             </Routes>  
        </div>
    );
};

export default DashboardStaff;