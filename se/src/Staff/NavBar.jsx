import React from 'react';
import '../NavBar.css';
import { useNavigate } from 'react-router-dom';
const NavBar = ({role}) => {
    const navigate=useNavigate();
    return (
        <div className={`navigation role${role}`} >
            <div className='inner' onClick={()=>navigate('profile')}>View Profile</div>
            <div className='inner' onClick={()=>navigate('search-student')}>Search Student</div>
            <div className='inner' onClick={()=>navigate('add-fine')}>Add Fine</div>
            <div className='inner' onClick={()=>navigate('fine-details')}>Fine Codes</div>
        </div>
    );
};

export default NavBar;