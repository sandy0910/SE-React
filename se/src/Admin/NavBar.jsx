import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../NavBar.css';

const NavBar = ({ role }) => {
    const navigate = useNavigate();
    const [showFormsPanel, setShowFormsPanel] = useState(false);

    const formItems = [
        {name: 'Student Details', route: 'form/student' },
        { name: 'Staff Details', route: 'form/staff' },
        { name: 'Course Compendium', route: 'form/course' },
        { name: 'Fine Compendium', route: 'form/fine' },
        { name: 'Fine Manager', route: 'form/fine-manager' }
    ];

    const handleFormsClick = () => {
        setShowFormsPanel(!showFormsPanel);
    };

    const handleFormItemClick = (route) => {
        setShowFormsPanel(!showFormsPanel);
        navigate(route);
    };

    // Create columns with 5 items each
    const formColumns = [];
    for (let i = 0; i < formItems.length; i += 3) {
        formColumns.push(formItems.slice(i, i + 3));
    }

    return (
        <div>
            <div className={`navigation role${role}`}>
                <div className='inner' onClick={handleFormsClick}>Forms</div>
                <div className='inner' onClick={() => navigate('view-defaulters')}>View Defaulters</div>
                <div className='inner' onClick={() => navigate('generate-hallticket')}>Generate HallTicket</div>
                <div className='inner' onClick={() => navigate('view-payment')}>View Payments</div>
                <div className='inner' onClick={() => navigate('send-mail')}>Send Mail</div>
                <div className='inner' onClick={() => navigate('enable-payment')}>Enable Payment</div>
            </div>
            {showFormsPanel && (
                <div className='forms-panel'>
                    {formColumns.map((column, columnIndex) => (
                        <div className='forms-column' key={columnIndex}>
                            {column.map((item, itemIndex) => (
                                <div
                                    className='form-item'
                                    key={itemIndex}
                                    onClick={() => handleFormItemClick(item.route)}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavBar;