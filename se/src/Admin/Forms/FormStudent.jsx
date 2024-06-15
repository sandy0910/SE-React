import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/FormStudent.css';

const FormStudent = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({
    REGNO:'',
    NAME: '',
    DOB: '',
    YOJ: '',
    MODE_OF_ADDMISSION: '',
    GENDER: '',
    QUOTA: '',
    PROGRAMME: '',
    DEPARTMENT: '',
    sem: '',
    ADDRESS: '',
    PINCODE: '',
    PHONE_NO: '',
    email: '',
    PHOTO: ''
  });
  const [filters, setFilters] = useState({
    REGNO: '',
    NAME: '',
    DEPARTMENT: '',
    sem:'',
    PROGRAMME:'',
    YOJ:'',
    MODE_OF_ADDMISSION: '',
    GENDER: '',
    QUOTA: ''
  });
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/student-details');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudents();
  }, [editingStudentId, isAdding]);

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
  }, [editingStudentId, isAdding]);

  const handleEdit = (student) => {
    setEditingStudentId(student.id);
    setEditedStudent(student);
  };

  const handleSave = async (id) => {
    try {
      const updatedStudent = {
        ...editedStudent,
        DOB: editedStudent.DOB ? convertToYYYYMMDD(editedStudent.DOB) : ''
      };
      await axios.put(`http://localhost:3001/api/student/${id}`, updatedStudent);
      setStudents(students.map(student => student.id === id ? updatedStudent : student));
      setEditingStudentId(null);
    } catch (error) {
      console.error('Error updating student data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/student/${id}`);
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student data:', error);
    }
  };

  const convertToYYYYMMDD = (date) => {
    const parts = date.split('-');
    if (parts.length === 3 && parts[2].length === 4) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      return date;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent({
      ...editedStudent,
      [name]: value
    });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handlePhotoChange = (e, id) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setEditedStudent({
        ...editedStudent,
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
      const base64String = reader.result;
      setNewStudent({ ...newStudent, PHOTO: base64String });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudent = async () => {
    try {
      console.log(newStudent);
      await axios.post(`http://localhost:3001/api/student/${newStudent.REGNO}`, newStudent);
      setStudents([...students, newStudent]);
      setIsAdding(false);
      setNewStudent({
        REGNO:'',
        NAME: '',
        DOB: '',
        YOJ: '',
        MODE_OF_ADDMISSION: '',
        GENDER: '',
        QUOTA: '',
        PROGRAMME: '',
        DEPARTMENT: '',
        sem: '',
        ADDRESS: '',
        PINCODE: '',
        PHONE_NO: '',
        email: '',
        PHOTO: ''
      });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const filtered = students.filter(student =>
      (filters.REGNO ? student.id.includes(filters.REGNO) : true) &&
      (filters.NAME ? student.NAME.toLowerCase().includes(filters.NAME.toLowerCase()) : true) &&
      (filters.DEPARTMENT ? student.name.toLowerCase().includes(filters.DEPARTMENT.toLowerCase()) : true) &&
      (filters.sem ? student.sem.includes(filters.sem) : true) &&
      (filters.PROGRAMME ? student.PROGRAMME.toLowerCase().includes(filters.PROGRAMME.toLowerCase()) : true) &&
      (filters.YOJ ? student.YOJ.includes(filters.YOJ) : true) &&
      (filters.MODE_OF_ADDMISSION ? student.MODE_OF_ADDMISSION.toLowerCase().includes(filters.MODE_OF_ADDMISSION.toLowerCase()) : true) &&
      (filters.GENDER ? student.GENDER.toLowerCase().includes(filters.GENDER.toLowerCase()) : true) &&
      (filters.QUOTA ? student.QUOTA.toLowerCase().includes(filters.QUOTA.toLowerCase()) : true)
    );
    setFilteredStudents(filtered);
  }, [filters, students]);

  if (students.length === 0) {
    return <div>Loading...</div>;
  }

  const modeOfAdmissionOptions = [ 'CENTAC', 'JOSAA'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const quotaOptions = ['General', 'OBC', 'SC/ST'];
  const programmeOptions = [ 'B.Tech', 'M.Tech', 'PhD'];
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="student-table-container">
      {isAdding ? (
        <div className="form-container">
          <h2 className="form-title">Add New Student</h2>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              name="REGNO"
              value={newStudent.REGNO}
              onChange={handleNewChange}
            />
            <label>Name</label>
            <input
              type="text"
              name="NAME"
              value={newStudent.NAME}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="DOB"
              value={newStudent.DOB}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Year of Joining</label>
            <input
              type="number"
              name="YOJ"
              value={newStudent.YOJ}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Mode of Admission</label>
            <select
              name="MODE_OF_ADDMISSION"
              value={newStudent.MODE_OF_ADDMISSION}
              onChange={handleNewChange}
            >
              <option value="">Select Mode of Addmission</option>
              {modeOfAdmissionOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="GENDER"
              value={newStudent.GENDER}
              onChange={handleNewChange}
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quota</label>
            <select
              name="QUOTA"
              value={newStudent.QUOTA}
              onChange={handleNewChange}
            >
              <option value="">Select Quota</option>
              {quotaOptions.map(option => (
                <option key={option}
                value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Programme</label>
            <select
              name="PROGRAMME"
              value={newStudent.PROGRAMME}
              onChange={handleNewChange}
            >
              <option value="">Select Programme</option>
              {programmeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              name="DEPARTMENT"
              value={newStudent.DEPARTMENT}
              onChange={handleNewChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.name} value={dept.dept_id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Semester</label>
            <select
              name="sem"
              value={newStudent.sem}
              onChange={handleNewChange}
            >
              <option value="">Select Semester</option>
              {semesterOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="ADDRESS"
              value={newStudent.ADDRESS}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="number"
              name="PINCODE"
              value={newStudent.PINCODE}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="number"
              name="PHONE_NO"
              value={newStudent.PHONE_NO}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newStudent.email}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input type="file" name="PHOTO" onChange={handleNewPhotoChange} />
          </div>
          <div className="form-group form-buttons">
            <button onClick={handleAddStudent} className='save-button'>Save</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
        <h2 className='table-title'>STUDENTS</h2>
        <button className="add-button" onClick={() => setIsAdding(true)}>Add New Student</button>
          <div className='filter-container'>
                  <input
                    type="text"
                    name="REGNO"
                    placeholder="Filter by Reg No"
                    value={filters.REGNO}
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
                  <select
                    name="sem"
                    value={filters.sem}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <select
                    name="PROGRAMME"
                    value={filters.PROGRAMME}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Programme</option>
                    {programmeOptions.map(option => (
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
                    name="MODE_OF_ADDMISSION"
                    value={filters.MODE_OF_ADDMISSION}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Mode of Addmission</option>
                    {modeOfAdmissionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
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
                  <select
                    name="QUOTA"
                    value={filters.QUOTA}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Quota</option>
                    {quotaOptions.map(option => (
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
        <div className='student-table-container'>
          
          <table className="student-table">
            <thead>
              <tr>
                <th>Register Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Programme</th>
                <th>Year of Joining</th>
                <th>Mode of Addmission</th>
                <th>Gender</th>
                <th>Quota</th>
                <th>Phone Number</th>
                <th>E-Mail</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input
                        type="text"
                        name="NAME"
                        value={editedStudent.NAME}
                        onChange={handleChange}
                      />
                    ) : (
                      student.NAME
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="DEPT_ID"
                        value={editedStudent.DEPARTMENT}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.dept_id} value={dept.dept_id}>{dept.name}</option>
                        ))}
                      </select>
                    ) : (
                      student.name
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="sem"
                        value={editedStudent.sem}
                        onChange={handleChange}
                      >
                        {semesterOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      student.sem
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="PROGRAMME"
                        value={editedStudent.PROGRAMME}
                        onChange={handleChange}
                      >
                        {programmeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      student.PROGRAMME
                    )}
                  </td>
                  <td>
                    {editingStudentId ===student.id ? (
                      <input
                        type="number"
                        name="YOJ"
                        value={editedStudent.YOJ}
                        onChange={handleChange}
                      />
                    ) : (
                      student.YOJ
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="MODE_OF_ADDMISSION"
                        value={editedStudent.MODE_OF_ADDMISSION}
                        onChange={handleChange}
                      >
                        {modeOfAdmissionOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      student.MODE_OF_ADDMISSION
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="GENDER"
                        value={editedStudent.GENDER}
                        onChange={handleChange}
                      >
                        {genderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      student.GENDER
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <select
                        name="QUOTA"
                        value={editedStudent.QUOTA}
                        onChange={handleChange}
                      >
                        {quotaOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      student.QUOTA
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input name='PHONE_NO' type='number' value={editedStudent.PHONE_NO} onChange={handleChange}/>
                    ) : (
                      student.PHONE_NO
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input name='email' type='email' value={editedStudent.email} onChange={handleChange}/>
                    ) : (
                      student.email
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input name='ADDRESS' type='text' value={editedStudent.ADDRESS} onChange={handleChange}/>
                    ) : (
                      student.ADDRESS
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input name='PINCODE' type='number' value={editedStudent.PINCODE} onChange={handleChange}/>
                    ) : (
                      student.PINCODE
                    )}
                  </td>
                  <td>
                    {editingStudentId === student.id ? (
                      <input type="file" name="PHOTO" onChange={handlePhotoChange} />
                    ) : (
                      student.PHOTO ? (
                        <img src={`data:image/jpeg;base64,${student.PHOTO}`} alt="Student Photo" className="student-photo" />
                      ) : (
                        'No Photo'
                      )
                    )}
                  </td>

                  <td>
                    {editingStudentId === student.id ? (
                      <button onClick={() => handleSave(student.id)} className='save-button'>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(student)} className='edit-button'>Edit</button>
                    )}
                    <button onClick={() => handleDelete(student.id)} className='delete-button'>Delete</button>
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

export default FormStudent;

