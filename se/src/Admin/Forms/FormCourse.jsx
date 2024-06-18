import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/FormCourse.css'; // Import the CSS file

const FormCourse = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    COURSE_ID: '',
    TYPE: '',
    NAME: '',
    CREDIT: '',
    SEM: '',
    DEPT_ID: '',
    SPECIAL:'',
    PROG:''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    COURSE_ID: '',
    TYPE: '',
    NAME: '',
    CREDIT: '',
    SEM: '',
    DEPT_ID: '',
    SPECIAL: '',
    PROG:''
  });
  const [filters, setFilters] = useState({
    COURSE_ID: '',
    TYPE: '',
    CREDIT: '',
    DEPT_ID:'',
    SEM:'',
    SPECIAL: '',
    PROG:''
  });
  const [filteredCourses, setFilteredCourses] = useState([]);

  const specialoption=[{num:0,spec:"NONE"},{num:1,spec:"HONOR"},{num:2,spec:"MINOR"}];
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
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/course-details');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [editCourseId,newCourseData]);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3001/api/course/${courseId}`);
      setCourses(courses.filter((course) => course.COURSE_ID !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course) => {
    setEditCourseId(course.COURSE_ID);
    setEditFormData(course);
  };

  const handleSave = async () => {
    try {
      console.log(editFormData);
      await axios.put(`http://localhost:3001/api/course/${editCourseId}`, editFormData);
      setCourses(courses.map((course) =>
        course.COURSE_ID === editCourseId ? editFormData : course
      ));
      setEditCourseId(null);
    } catch (error) {
      console.error('Error updating course:', error);
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
    setNewCourseData({
      ...newCourseData,
      [name]: value
    });
  };

  const handleAddCourse = async () => {
    try {
      await axios.post('http://localhost:3001/api/course', newCourseData);
      setCourses([...courses, newCourseData]);
      setIsAdding(false);
      setNewCourseData({
        COURSE_ID: '',
        TYPE: '',
        NAME: '',
        CREDIT: '',
        SEM: '',
        DEPT_ID: '',
        SPECIAL:'',
        PROG:''
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    console.log(filters)
    console.log(courses)
  };

  useEffect(() => {
    
    const filtered = courses.filter(course =>
      (filters.COURSE_ID ? course.COURSE_ID.includes(filters.COURSE_ID) : true) &&
      (filters.TYPE ? course.TYPE.toLowerCase().includes(filters.TYPE.toLowerCase()) : true) &&
      (filters.DEPT_ID ? course.DNAME.includes(filters.DEPT_ID) : true) &&
      (filters.SEM ? course.SEM.includes(filters.SEM) : true) &&
      (filters.CREDIT ? course.CREDIT.includes(filters.CREDIT) : true) &&
      (filters.SPECIAL ? course.SPECIAL.toString() === filters.SPECIAL : true)&&
      (filters.PROG ? course.PROG.includes(filters.PROG) : true)
    );

    setFilteredCourses(filtered);
  }, [filters, courses]);

  const programmeOptions = [ 'B.Tech', 'M.Tech', 'PhD'];
  const typeOptions=['Theory','Laboratory','Mandatory','open elective','professional elective'];
  return (
    <div className="table-container">
      {isAdding ? (
        <div className="course-form-container">
          <h2 className="form-title">Add New Course</h2>
          <div className="form-group">
            <label>Course ID</label>
            <input
              type="text"
              name="COURSE_ID"
              value={newCourseData.COURSE_ID}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              name="TYPE"
              value={newCourseData.TYPE}
              onChange={handleNewChange}
              required
            >
              <option value="">Select Type</option>
              <option value="theory">Theory</option>
              <option value="laboratory">Laboratory</option>
              <option value="mandatory">Mandatory</option>
              <option value="open elective">Optional Elective</option>
              <option value="professional elective">Professional Elective</option>
            </select>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="NAME"
              value={newCourseData.NAME}
              onChange={handleNewChange}
            />
          </div>
          <div className="form-group">
            <label>Credit</label>
            <input
              type="number"
              name="CREDIT"
              value={newCourseData.CREDIT}
              onChange={handleNewChange}
            />
          </div>
          <div className='form-group'>
            <label >Programme</label>
            <select name="PROG" value={newCourseData.PROG} onChange={handleNewChange}>
              <option value="">Select Programme</option>
              {programmeOptions.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Semester</label>
            <input
              type="number"
              name="SEM"
              value={newCourseData.SEM}
              onChange={handleNewChange}
            />
          </div>
          <div className='form-group'>
            <label>Specialization</label>
            <select name="SPECIAL" value={newCourseData.SPECIAL} onChange={handleNewChange} required>
            <option value="">Select Specialization</option>
              {specialoption.map((opt)=>(
                <option key={opt.num} value={opt.num}>{opt.spec}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              name="DEPT_ID"
              value={newCourseData.DEPT_ID}
              onChange={handleNewChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleAddCourse} className="save-button">Submit</button>
          <button onClick={() => setIsAdding(false)} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <>
        <h2 className="table-title">Courses</h2>
        <button onClick={() => setIsAdding(true)} className="add-button">Add</button>

        <div className='filter-container'>
                  <input
                    type="text"
                    name="COURSE_ID"
                    placeholder="Filter by Course ID"
                    value={filters.COURSE_ID}
                    onChange={handleFilterChange}
                  />
                  <select
                    name="TYPE"
                    value={filters.TYPE}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select TYPE</option>
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select
                    name="DEPT_ID"
                    value={filters.DEPT_ID}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.dept_id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <input
                    name="SEM"
                    type='number'
                    placeholder='filter by Semester'
                    value={filters.SEM}
                    onChange={handleFilterChange}
                  />
                  <select name="SPECIAL" value={filters.SPECIAL} onChange={handleFilterChange} required>
                  <option value="">Select Specialization</option>
                    {specialoption.map((opt)=>(
                      <option key={opt.num} value={opt.num}>{opt.spec}</option>
                    ))}
                  </select>
                  <select
                    name="PROG"
                    value={filters.PROG}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Programme</option>
                    {programmeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  
                  <button className='clear-button' onClick={()=>{setFilters({
                          COURSE_ID: '',
                          TYPE: '',
                          CREDIT: '',
                          DEPARTMENT:'',
                          SEM:'',
                          PROG:''
                        })}}>Clear Filters</button>
          </div>

        <div className='course-table-container'>
          
          
          
          <table className="course-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Type</th>
                <th>Name</th>
                
                
                <th>Programme</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Special</th>
                <th>Credit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.COURSE_ID}>
                  {editCourseId === course.COURSE_ID ? (
                    <>
                      <td><input type="text" name="COURSE_ID" value={editFormData.COURSE_ID} onChange={handleChange} disabled /></td>
                      <td>
                        <select name="TYPE" value={editFormData.TYPE} onChange={handleChange} required>
                          <option value="">Select Type</option>
                          <option value="theory">Theory</option>
                          <option value="laboratory">Laboratory</option>
                          <option value="mandatory">Mandatory</option>
                          <option value="open elective">Optional Elective</option>
                          <option value="professional elective">Professional Elective</option>
                        </select>
                      </td>
                      <td><input type="text" name="NAME" value={editFormData.NAME} onChange={handleChange} /></td>
                      <td>
                        <select name="PROG" value={editFormData.PROG} onChange={handleChange} required>
                          <option value="">Select Programme</option>
                          {programmeOptions.map((prog) => (
                            <option key={prog} value={prog}>
                              {prog}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select name="DEPT_ID" value={editFormData.DEPT_ID} onChange={handleChange} required>
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.dept_id} value={dept.dept_id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" name="SEM" value={editFormData.SEM} onChange={handleChange} /></td>
                      <td>
                        <select name="SPECIAL" value={editFormData.SPECIAL} onChange={handleChange} required>
                          {specialoption.map((opt)=>(
                            <option key={opt.num} value={opt.num}>{opt.spec}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" name="CREDIT" value={editFormData.CREDIT} onChange={handleChange} /></td>
                      
                      <td className='actions'>
                        <button onClick={handleSave} className="save-button">Save</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{course.COURSE_ID}</td>
                      <td>{course.TYPE}</td>
                      <td>{course.NAME}</td>
                      <td>{course.PROG}</td>
                      <td>{course.DNAME}</td>
                      <td>{course.SEM}</td>
                      <td>{specialoption.find(option=>option.num===course.SPECIAL)?.spec||''}</td>
                      <td>{course.CREDIT}</td>
                      <td className='actions'>
                        <button onClick={() => handleEdit(course)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(course.COURSE_ID)} className="delete-button">Delete</button>
                      </td>
                    </>
                  )}
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

export default FormCourse;
