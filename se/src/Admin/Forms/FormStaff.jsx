import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/FormStaff.css';

const FormStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editedStaff, setEditedStaff] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({
    S_ID:'',
    NAME: '',
    DEPARTMENT: '',
    DESIG: '',
    DOB: '',
    YOJ: '',
    GENDER: '',
    ADDRESS: '',
    PINCODE: '',
    PHONE_NO: '',
    EMAIL: '',
    PHOTO: ''
  });
  const [filters, setFilters] = useState({
    S_ID: '',
    NAME: '',
    DEPARTMENT: '',
    DESIG:'',
    GENDER:'',
    YOJ:''
  });
  const [filteredStaffs, setFilteredStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/staff-details');
        setStaffs(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffs();
  }, [editingStaffId, isAdding]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [editingStaffId, isAdding]);

  const handleEdit = (staff) => {
    setEditingStaffId(staff.S_ID);
    setEditedStaff(staff);
  };

  const handleSave = async (id) => {
    try {
      const updatedStaff = {
        ...editedStaff,
        DOB: editedStaff.DOB ? convertToYYYYMMDD(editedStaff.DOB) : ''
      };
      
      await axios.put(`http://localhost:3001/api/staff/${id}`, updatedStaff);
      setStaffs(staffs.map(staff => staff.id === id ? updatedStaff : staff));
      setEditingStaffId(null);
    } catch (error) {
      console.error('Error updating staff data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/staff/${id}`);
      setStaffs(staffs.filter(staff => staff.id !== id));
    } catch (error) {
      console.error('Error deleting staff data:', error);
    }
  };

  const convertToYYYYMMDD = (date) => {
    const parts=date.split('-');
    if(parts.length===3 && parts[2].length===4){
      const [day, month, year] =parts;
      return `${year}-${month}-${day}`;
    }else{
      return date;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedStaff({
      ...editedStaff,
      [name]: value
    });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];

      setEditedStaff({
        ...editedStaff,
        PHOTO: base64String
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleNewPhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setNewStaff({ ...newStaff, PHOTO: base64String });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = async () => {
    try {
      await axios.post(`http://localhost:3001/api/staff/${newStaff.S_ID}`, newStaff);
      setStaffs([...staffs, newStaff]);
      setIsAdding(false);
      setNewStaff({
        S_ID: '',
        NAME: '',
        DEPARTMENT: '',
        DESIG: '',
        DOB: '',
        YOJ: '',
        GENDER: '',
        ADDRESS: '',
        PINCODE: '',
        PHONE_NO: '',
        EMAIL: '',
        PHOTO: ''
      });
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const filtered = staffs.filter(staff =>
      (filters.S_ID ? staff.id.includes(filters.S_ID) : true) &&
      (filters.NAME ? staff.NAME.toLowerCase().includes(filters.NAME.toLowerCase()) : true) &&
      (filters.DEPARTMENT ? staff.name.toLowerCase().includes(filters.DEPARTMENT.toLowerCase()) : true) &&
      (filters.DESIG ? staff.DESIG.includes(filters.DESIG) : true) &&
      (filters.YOJ ? staff.YOJ.toString().includes(filters.YOJ) : true) &&
      (filters.GENDER ? staff.GENDER.toLowerCase().includes(filters.GENDER.toLowerCase()) : true)
    );

    setFilteredStaffs(filtered);
  }, [filters, staffs]);



  if (staffs.length === 0) {
    return <div>Loading...</div>;
  }

  const genderOptions = ['Male', 'Female', 'Other'];
  const designationOptions = ['Professor', 'Assistant Professor', 'Registrar', 'Dean', 'Head'];

  return (
    <div className="staff-table-container">
      {isAdding ? (
        <div className="form-container">
          <h2 className="form-title">Add New Staff</h2>
          <div className="form-group">
            <label>Staff ID</label>
            <input
              type="text"
              name="S_ID"
              value={newStaff.S_ID}
              onChange={handleNewChange}
            />
            <label>Name</label>
            <input
              type="text"
              name="NAME"
              value={newStaff.NAME}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              name="DEPARTMENT"
              value={newStaff.DEPARTMENT}
              onChange={handleNewChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <select
              name="DESIG"
              value={newStaff.DESIG}
              onChange={handleNewChange}
              required
            >
              <option value="">Select Designation</option>
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="DOB"
              value={newStaff.DOB}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Year of Joining</label>
            <input
              type="number"
              name="YOJ"
              value={newStaff.YOJ}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="GENDER"
              value={newStaff.GENDER}
              onChange={handleNewChange}
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="ADDRESS"
              value={newStaff.ADDRESS}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="number"
              name="PINCODE"
              value={newStaff.PINCODE}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="number"
              name="PHONE_NO"
              value={newStaff.PHONE_NO}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="EMAIL"
              value={newStaff.EMAIL}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNewPhotoChange}
            />
          </div>
          <button className="add-button" onClick={handleAddStaff}>Add Staff</button>
          <button className="cancel-button" onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      ) : (
        <>
        <h2 className="table-title">Staff Details</h2>
        <button className="add-button" onClick={() => setIsAdding(true)}>Add Staff</button>
          
          
          <div className='filter-container'>
                  <input
                    type="text"
                    name="S_ID"
                    placeholder="Filter by S_ID"
                    value={filters.S_ID}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="text"
                    name="NAME"
                    placeholder="Filter by Name"
                    value={filters.NAME}
                    onChange={handleFilterChange}
                  />
                  <select
                    name="DEPARTMENT"
                    value={filters.DEPARTMENT}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.dept_id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <select name="DESIG" value={filters.DESIG} onChange={handleFilterChange}>
                    <option value="">Select Designation</option>
                    {designationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="YOJ"
                    placeholder="Filter by YOJ"
                    value={filters.YOJ}
                    onChange={handleFilterChange}
                  />
                  
                  <select
                    name="GENDER"
                    value={filters.GENDER}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button className='clear-button' onClick={()=>{setFilters({
                            REGNO: '',
                            NAME: '',
                            DEPARTMENT: '',
                            sem:'',
                            PROGRAMME:'',
                            YOJ:'',
                            MODE_OF_ADDMISSION: '',
                            GENDER: '',
                            QUOTA: ''
                          })}}>Clear Filters</button>
          </div>
        <div className='staff-table-container'>
          
          
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Date of Birth</th>
                <th>Year of Joining</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Phone Number</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map(staff => (
                <tr key={staff.S_ID}>
                  <td>{staff.S_ID}</td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="text"
                        name="NAME"
                        value={editedStaff.NAME}
                        onChange={handleChange}
                      />
                    ) : (
                      staff.NAME
                    )}
                  </td>
                  <td>
                  {editingStaffId === staff.id ? (
                      <select
                        name="DEPT_ID"
                        value={editedStaff.DEPT_ID}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.dept_id} value={dept.dept_id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      staff.name
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <select
                        name="DESIG"
                        value={editedStaff.DESIG}
                        onChange={handleChange}
                      >
                        {designationOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      staff.DESIG
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="date"
                        name="DOB"
                        value={convertToYYYYMMDD(editedStaff.DOB)}
                        onChange={handleChange}
                      />
                    ) : (
                      new Date(staff.DOB).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="number"
                        name="YOJ"
                        value={editedStaff.YOJ}
                        onChange={handleChange}
                      />
                    ) : (
                      staff.YOJ
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <select
                        name="GENDER"
                        value={editedStaff.GENDER}
                        onChange={handleChange}
                      >
                        {genderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      staff.GENDER
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="text"
                        name="ADDRESS"
                        value={editedStaff.ADDRESS}
                        onChange={handleChange}
                      />
                    ) : (
                      staff.ADDRESS
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="number"
                        name="PINCODE"
                        value={editedStaff.PINCODE}
                        onChange={handleChange}
                      />
                    ) : (
                      staff.PINCODE
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="number"
                        name="PHONE_NO"
                        value={editedStaff.PHONE_NO}
                        onChange={handleChange}
                      />
                    ) : (
                      staff.PHONE_NO
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    ) : (
                      <img src={`data:image/jpeg;base64,${staff.PHOTO}`} alt="Staff" style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>
                    {editingStaffId === staff.S_ID ? (
                      <button className="save-button" onClick={() => handleSave(staff.S_ID)}>Save</button>
                    ) : (
                      <button className="edit-button" onClick={() => handleEdit(staff)}>Edit    </button>
                    )}
                    {editingStaffId !== staff.S_ID && (
                    <button className="delete-button" onClick={() => handleDelete(staff.S_ID)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
};

export default FormStaff;
