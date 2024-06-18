import React, { useState, useEffect } from 'react';
import axios from 'axios';
const FormFine = () => {
    const [fines, setFines] = useState([]);
    const [editFineId, setEditFineId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        TYPE: '',
        FCODE: '',
        AMOUNT: '',
        SUMMARY: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [newFineData, setNewFineData] = useState({
        TYPE: '',
        FCODE: '',
        AMOUNT: '',
        SUMMARY: ''
    });

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/fine-details');
                setFines(response.data);
            } catch (error) {
                console.error('Error fetching fines:', error);
            }
        };

        fetchFines();
    }, [editFineId, newFineData]);

    const handleDelete = async (fineId) => {
        try {
            await axios.delete(`http://localhost:3001/api/fine/${fineId}`);
            setFines(fines.filter((fine) => fine.FCODE !== fineId));
        } catch (error) {
            console.error('Error deleting fine:', error);
        }
    };

    const handleEdit = (fine) => {
        setEditFineId(fine.FCODE);
        setEditFormData(fine);
    };

    const handleSave = async () => {
        try {
            console.log(editFormData);
            await axios.put(`http://localhost:3001/api/fine/${editFineId}`, editFormData);
            setFines(fines.map((fine) =>
                fine.FCODE === editFineId ? editFormData : fine
            ));
            setEditFineId(null);
        } catch (error) {
            console.error('Error updating fine:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewFineData({
            ...newFineData,
            [name]: value
        });
    };

    const handleAddFine = async () => {
        try {
            await axios.post('http://localhost:3001/api/fine', newFineData);
            setFines([...fines, newFineData]);
            setIsAdding(false);
            setNewFineData({
                TYPE: '',
                FCODE: '',
                AMOUNT: '',
                SUMMARY: ''
            });
        } catch (error) {
            console.error('Error adding fine:', error);
        }
    };

    return (
        <div className="table-container">
            {isAdding ? (
                <div className="form-container">
                    <h2 className="form-title">Add New Fine</h2>
                    <div className="form-group">
                        <label>Type</label>
                        <input
                            type='text'
                            name="TYPE"
                            value={newFineData.TYPE}
                            onChange={handleNewChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Fine Code</label>
                        <input
                            type="text"
                            name="FCODE"
                            value={newFineData.FCODE}
                            onChange={handleNewChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            name="AMOUNT"
                            value={newFineData.AMOUNT}
                            onChange={handleNewChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            name="SUMMARY"
                            value={newFineData.SUMMARY}
                            onChange={handleNewChange}
                        />
                    </div>
                    <button onClick={handleAddFine} className="save-button">Submit</button>
                    <button onClick={() => setIsAdding(false)} className="cancel-button">Cancel</button>
                </div>
            ) : (
                <>
                    <button onClick={() => setIsAdding(true)} className="add-button">Add</button>
                    <h2 className="table-title">Fines</h2>
                    <table className="courses-table">
                        <thead>
                            <tr>
                                <th>Fine Code</th>
                                <th>Type</th>
                                
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fines.map((fine) => (
                                <tr key={fine.FCODE}>
                                    <td>{fine.FCODE}</td>
                                    <td>{editFineId === fine.FCODE ? (
                                        <input
                                            type='text'
                                            name="TYPE"
                                            value={editFormData.TYPE}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fine.TYPE
                                    )}</td>
                                    
                                    <td>{editFineId === fine.FCODE ? (
                                        <input
                                            type='number'
                                            name="AMOUNT"
                                            value={editFormData.AMOUNT}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fine.AMOUNT
                                    )}</td>
                                    <td>{editFineId === fine.FCODE ? (
                                        <input
                                            type='text'
                                            name="SUMMARY"
                                            value={editFormData.SUMMARY}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        fine.SUMMARY
                                    )}</td>
                                    <td className='actions'>
                                        {editFineId === fine.FCODE ? (
                                            <button onClick={handleSave} className="save-button">Save</button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(fine)} className="edit-button">Edit</button>
                                                <button onClick={() => handleDelete(fine.FCODE)} className="delete-button">Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default FormFine;
