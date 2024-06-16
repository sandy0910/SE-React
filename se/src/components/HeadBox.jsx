import React from 'react';
import './HeadBox.css';
import { useNavigate } from 'react-router-dom';

const HeadBox = ({ role }) => {
    let backgroundColor;
    const navigate=useNavigate();

    // Determine the background color based on the role
    switch (role) {
        case 1:
            backgroundColor = '#ff2222';
            break;
        case 2:
            backgroundColor = '#64E119';
            break;
        case 0:
            backgroundColor = '#575757';
            break;
        default:
            backgroundColor = '#23DED1';
            break;
    }

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logout');
        sessionStorage.removeItem('id');
        navigate('/login')
    };

    return (
        <div className={`HeadBox role${role}`}>
            <div className='HeadContainer'>
                <img src="/ptu-logo.png" alt="PTU Logo" />
                <div>
                    <h2 style={{color:'white'}}>PUDUCHERRY TECHNOLOGICAL UNIVERSITY</h2>
                </div>
            </div>
            <button className={`logoutButton role${role}`} onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HeadBox;
