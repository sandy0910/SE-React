const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto=require('crypto');
const app = express();
const axios = require('axios');
const nodemailer = require('nodemailer');


const port = 3001;

const admin = require('firebase-admin');
const serviceAccount = require('./service/software-engineering-bb17b-firebase-adminsdk-34hd3-5c6c458c86.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'se' // Change this to your actual database name
});

// API endpoint to check user's role
app.get('/checkRole', (req, res) => {
  const userEmail = req.query.email;
  const query = 'SELECT role, id FROM users WHERE email = ?';
  connection.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error('Error executing query', err);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
    if (results.length === 1) {
      const { role, id } = results[0];
      return res.status(201).json({ role, id });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  });
});

app.get('/api/student-details', (req, res) => {
  const query = `
      SELECT u.email, u.role,u.id, n.NAME, DATE_FORMAT(n.DOB, '%d-%m-%Y') as DOB, n.YOJ, n.MODE_OF_ADDMISSION, n.GENDER, n.QUOTA, 
             TO_BASE64(n.PHOTO) as PHOTO, 
             a.PROGRAMME, a.DEPT_ID, a.sem, 
             c.ADDRESS, c.PINCODE, c.PHONE_NO, d.name
      FROM users u
      JOIN nominal_roll n ON u.id = n.REG_NO
      JOIN academic a ON n.REG_NO = a.REG_NO
      JOIN contact c ON a.REG_NO = c.REG_NO
      JOIN department d ON a.DEPT_ID = d.DEPT_ID
  `;
  connection.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(result); // Return all records
  });
});
app.get('/api/student/',(req,res)=>{

});
app.get('/api/student/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
      SELECT u.email, u.role, n.NAME,DATE_FORMAT(n.DOB, '%d-%m-%Y') as DOB, n.YOJ, n.MODE_OF_ADDMISSION, n.GENDER, n.QUOTA, 
             TO_BASE64(n.PHOTO) as PHOTO, 
             a.PROGRAMME, a.DEPT_ID, a.sem, 
             c.ADDRESS, c.PINCODE, c.PHONE_NO, d.name
      FROM users u
      JOIN nominal_roll n ON u.id = n.REG_NO
      JOIN academic a ON n.REG_NO = a.REG_NO
      JOIN contact c ON a.REG_NO = c.REG_NO
      JOIN department d ON a.DEPT_ID=d.DEPT_ID
      WHERE u.id = ?
  `;
  connection.query(query, [userId], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(result[0]);
  });
});

app.post('/api/student/:id', (req, res) => {
  const studentId = req.params.id;
  const { ADDRESS, DEPARTMENT, DOB, GENDER, MODE_OF_ADDMISSION, NAME, PHONE_NO, PHOTO, PINCODE, PROGRAMME, QUOTA, REGNO, YOJ, email, sem } = req.body;

  const encryptedRegno = crypto.createHash('sha1').update(REGNO).digest('hex');
  const base64Photo = PHOTO.split(',')[1];
  const photoBuffer = Buffer.from(base64Photo, 'base64');

  const insertNominalRollQuery = `INSERT INTO nominal_roll (REG_NO, NAME, DOB, YOJ, MODE_OF_ADDMISSION, GENDER, QUOTA, PHOTO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const insertAcademicQuery = `INSERT INTO academic (REG_NO, PROGRAMME, DEPT_ID, sem) VALUES (?, ?, ?, ?)`;
  const insertContactQuery = `INSERT INTO contact (REG_NO, ADDRESS, PINCODE, PHONE_NO) VALUES (?, ?, ?, ?)`;
  const insertUserQuery = `INSERT INTO users (email, id, password, role) VALUES (?, ?, ?, ?)`;

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    connection.query(insertNominalRollQuery, [REGNO, NAME, DOB, YOJ, MODE_OF_ADDMISSION, GENDER, QUOTA, photoBuffer], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      connection.query(insertAcademicQuery, [REGNO, PROGRAMME, DEPARTMENT, sem], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.query(insertContactQuery, [REGNO, ADDRESS, PINCODE, PHONE_NO], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }

          connection.query(insertUserQuery, [email, studentId, encryptedRegno, 1], (err, results) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send(err);
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).send(err);
                });
              }

              // Add user to Firebase Authentication
              admin.auth().createUser({
                email: email,
                password: REGNO // Assuming REGNO is used as the password, adjust as needed
              })
              .then(userRecord => {
                res.json({ message: 'Student added successfully and user created in Firebase', userRecord });
              })
              .catch(error => {
                console.error('Error creating user in Firebase:', error);
                res.status(500).send(error);
              });
            });
          });
        });
      });
    });
  });
});

app.put('/api/student/:id', (req, res) => {
  const studentId = req.params.id;
  const { ADDRESS, DEPT_ID, DOB, GENDER, MODE_OF_ADDMISSION, NAME, PHONE_NO, PHOTO, PINCODE, PROGRAMME, QUOTA, REGNO, YOJ, sem } = req.body;
  const base64Photo = PHOTO.split(',');
  
  let photoBuffer='';
  if(base64Photo.length==2){
    photoBuffer = Buffer.from(base64Photo[1], 'base64');
  }else{
    photoBuffer= Buffer.from(PHOTO, 'base64');
  }

  const updateNominalRollQuery = `UPDATE nominal_roll SET NAME = ?, DOB = ?, YOJ = ?, MODE_OF_ADDMISSION = ?, GENDER = ?, QUOTA = ?, PHOTO = ? WHERE REG_NO = ?`;
  const updateAcademicQuery = `UPDATE academic SET PROGRAMME = ?, DEPT_ID = ?, sem = ? WHERE REG_NO = ?`;
  const updateContactQuery = `UPDATE contact SET ADDRESS = ?, PINCODE = ?, PHONE_NO = ? WHERE REG_NO = ?`;
  // Ensure DOB is a valid date before converting

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    connection.query(updateNominalRollQuery, [NAME, DOB, YOJ, MODE_OF_ADDMISSION, GENDER, QUOTA, photoBuffer, studentId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      connection.query(updateAcademicQuery, [PROGRAMME, DEPT_ID, sem, studentId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.query(updateContactQuery, [ADDRESS, PINCODE, PHONE_NO, studentId], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }

          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send(err);
              });
            }
            res.json({ message: 'Student updated successfully' });
          });
        });
      });
    });
  });
});

app.delete('/api/student/:id', (req, res) => {
  const studentId = req.params.id;

  const deleteNominalRollQuery = 'DELETE FROM nominal_roll WHERE REG_NO = ?';
  const deleteAcademicQuery = 'DELETE FROM academic WHERE REG_NO = ?';
  const deleteContactQuery = 'DELETE FROM contact WHERE REG_NO = ?';
  const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
  const getUserEmailQuery = 'SELECT email FROM users WHERE id = ?';

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    connection.query(getUserEmailQuery, [studentId], (err, result) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      if (result.length === 0) {
        return res.status(404).send('User not found');
      }

      const userEmail = result[0].email;

      connection.query(deleteNominalRollQuery, [studentId], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.query(deleteAcademicQuery, [studentId], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }

          connection.query(deleteContactQuery, [studentId], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send(err);
              });
            }

            connection.query(deleteUserQuery, [studentId], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).send(err);
                });
              }

              admin.auth().getUserByEmail(userEmail)
                .then(userRecord => {
                  return admin.auth().deleteUser(userRecord.uid);
                })
                .then(() => {
                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        res.status(500).send(err);
                      });
                    }
                    res.status(200).send('Student record deleted successfully');
                  });
                })
                .catch(error => {
                  return connection.rollback(() => {
                    res.status(500).send('Error deleting Firebase user: ' + error);
                  });
                });
            });
          });
        });
      });
    });
  });
});
app.get('/api/staff-details',(req,res)=>{
  const query = `
      SELECT u.email, u.role, u.id, s.S_ID, s.NAME, DATE_FORMAT(s.DOB, '%d-%m-%Y') as DOB, s.YOJ, s.DESIG, s.GENDER, 
             TO_BASE64(s.PHOTO) as PHOTO, d.name, 
             c.ADDRESS, c.PINCODE, c.PHONE_NO, d.DEPT_ID
      FROM users u
      JOIN staff s ON u.id = s.S_ID
      JOIN department d ON s.DEPT_ID = d.DEPT_ID
      JOIN contact c ON s.S_ID = c.REG_NO
      ORDER BY u.id;
  `;
  connection.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(result);
  });
})
app.get('/api/staff/', (req, res)=>{
})
app.get('/api/staff/:id', (req, res) => {
  const userId = req.params.id;
    const query = `
        SELECT u.email, u.role, s.NAME, s.DEPT_ID,s.desig,DATE_FORMAT(s.DOB, '%d-%m-%Y') as DOB,s.YOJ,s.gender,
               TO_BASE64(s.PHOTO) as PHOTO, 
               c.ADDRESS, c.PINCODE, c.PHONE_NO, d.name
        FROM users u
        JOIN staff s ON u.id = s.S_ID
        JOIN contact c ON s.S_ID= c.REG_NO
        JOIN department d ON s.DEPT_ID=d.DEPT_ID
        WHERE u.id = ?
    `;
    connection.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result[0]);
    });
});

// POST add new staff
app.post('/api/staff/:id', (req, res) => {
  const staffId = req.params.id;
  const { ADDRESS, DEPARTMENT, DOB, GENDER, NAME, PHONE_NO, PHOTO, PINCODE, DESIG, YOJ, EMAIL } = req.body;

  const encryptedRegno = crypto.createHash('sha1').update(staffId).digest('hex');
  const base64Photo = PHOTO;
  const photoBuffer = Buffer.from(base64Photo, 'base64');

  const insertStaffQuery = `INSERT INTO staff (S_ID, NAME, DEPT_ID, DESIG, PHOTO, DOB, YOJ, GENDER) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const insertContactQuery = `INSERT INTO contact (REG_NO, ADDRESS, PINCODE, PHONE_NO) VALUES (?, ?, ?, ?)`;
  const insertUserQuery = `INSERT INTO users (email, id, password, role) VALUES (?, ?, ?, ?)`;

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    connection.query(insertStaffQuery, [staffId, NAME, DEPARTMENT, DESIG, photoBuffer, DOB, YOJ, GENDER], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      connection.query(insertContactQuery, [staffId, ADDRESS, PINCODE, PHONE_NO], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.query(insertUserQuery, [EMAIL, staffId, encryptedRegno, 2], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }

          // Create user in Firebase Authentication
          admin.auth().createUser({
            email: EMAIL,
            password: staffId // You may want to use a more secure method for the initial password
          })
          .then(userRecord => {
            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).send(err);
                });
              }
              res.json({ message: 'Staff added successfully', firebaseUid: userRecord.uid });
            });
          })
          .catch(error => {
            connection.rollback(() => {
              res.status(500).send('Error creating Firebase user: ' + error);
            });
          });
        });
      });
    });
  });
});

// PUT update staff by ID
app.put('/api/staff/:id', (req, res) => {
  const staffId = req.params.id;
  const { ADDRESS, DEPT_ID, DOB, GENDER, NAME, PHONE_NO, PHOTO, PINCODE, DESIG, YOJ } = req.body;
  const base64Photo = PHOTO.split(',');
  
  let photoBuffer = '';
  if (base64Photo.length == 2) {
    photoBuffer = Buffer.from(base64Photo[1], 'base64');
  } else {
    photoBuffer = Buffer.from(PHOTO, 'base64');
  }

  const updateStaffQuery = `UPDATE staff SET NAME = ?, DEPT_ID = ?, DESIG = ?, PHOTO = ?, DOB = ?, YOJ = ?, GENDER = ? WHERE S_ID = ?`;
  const updateContactQuery = `UPDATE contact SET ADDRESS = ?, PINCODE = ?, PHONE_NO = ? WHERE REG_NO = ?`;

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }
  connection.query(updateStaffQuery, [NAME, DEPT_ID, DESIG, photoBuffer, DOB, YOJ, GENDER, staffId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      connection.query(updateContactQuery, [ADDRESS, PINCODE, PHONE_NO, staffId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }
          res.json({ message: 'Staff updated successfully' });
        });
      });
    });
  });
});

// DELETE staff by ID
app.delete('/api/staff/:id', (req, res) => {
  const staffId = req.params.id;

  const getUserEmailQuery = 'SELECT email FROM users WHERE id = ?';
  const deleteStaffQuery = 'DELETE FROM staff WHERE S_ID = ?';
  const deleteContactQuery = 'DELETE FROM contact WHERE REG_NO = ?';
  const deleteUserQuery = 'DELETE FROM users WHERE id = ?';

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send(err);
    }

    connection.query(getUserEmailQuery, [staffId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      const userEmail = results[0].email;

      connection.query(deleteStaffQuery, [staffId], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        connection.query(deleteContactQuery, [staffId], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }

          connection.query(deleteUserQuery, [staffId], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send(err);
              });
            }

            admin.auth().getUserByEmail(userEmail)
              .then(userRecord => {
                return admin.auth().deleteUser(userRecord.uid);
              })
              .then(() => {
                connection.commit(err => {
                  if (err) {
                    return connection.rollback(() => {
                      res.status(500).send(err);
                    });
                  }

                  res.status(200).send('Staff record and Firebase user deleted successfully');
                });
              })
              .catch(err => {
                connection.rollback(() => {
                  res.status(500).send('Error deleting Firebase user: ' + err);
                });
              });
          });
        });
      });
    });
  });
});




app.get('/api/departments', (req, res) => {
  const query = 'SELECT dept_id, name FROM department';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});




// Fetch all courses
app.get('/api/course-details', (req, res) => {
  const query = 'SELECT c.COURSE_ID,c.TYPE,c.NAME,c.CREDIT,c.Prog as PROG,c.SEM,d.DEPT_ID,d.NAME as DNAME,c.SPECIAL FROM COURSE c join DEPARTMENT d on c.DEPT_ID=d.DEPT_ID';
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});

//TO map course with student(simulating course registration)
app.get('/api/course',(req,res)=>{

});
app.get('/api/course/:studentId',(req,res)=>{
  const { studentId }=req.params;
  const query=`SELECT c.COURSE_ID,c.NAME as CNAME,c.TYPE,c.CREDIT,f.AMOUNT 
  FROM COURSE c JOIN COURSE_FEE f ON c.TYPE=f.TYPE JOIN 
  ACADEMIC a ON a.sem=c.SEM AND a.DEPT_ID=c.DEPT_ID AND
   a.PROGRAMME=c.Prog WHERE a.REG_NO=?`;
  connection.query(query,[studentId],(err,results)=>{
    if(err){
      return res.status(500).send(err);
    }else{
      res.status(200).send(results);
    }
  })
})
app.post('/api/course', (req, res) => {
  const { COURSE_ID, TYPE, NAME, CREDIT, SEM, DEPT_ID,PROG,SPECIAL } = req.body;
  const query = 'INSERT INTO course (COURSE_ID, TYPE, NAME, CREDIT, SEM, DEPT_ID,Prog,SPECIAL) VALUES (?, ?, ?, ?, ?, ?,?,?)';
  connection.query(query, [COURSE_ID, TYPE, NAME, CREDIT, SEM, DEPT_ID,PROG,SPECIAL], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ success: true });
  });
});
app.delete('/api/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  const query = 'DELETE FROM COURSE WHERE COURSE_ID = ?';
  
  connection.query(query, [courseId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ success: true });
  });
});
app.put('/api/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  const { TYPE, NAME, CREDIT, SEM, DEPT_ID,PROG,SPECIAL} = req.body;
  const query = `
    UPDATE COURSE 
    SET TYPE = ?, NAME = ?, CREDIT = ?, SEM = ?, DEPT_ID = ?,Prog=?,SPECIAL=?
    WHERE COURSE_ID = ?
  `;
  
  connection.query(query, [TYPE, NAME, CREDIT, SEM, DEPT_ID,PROG,SPECIAL, courseId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ success: true });
  });
});


app.get('/api/fine-details', (req, res) => {
  const query = 'SELECT * FROM fine_det';
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});
app.post('/api/fine', (req, res) => {
  const { TYPE, FCODE, AMOUNT, SUMMARY} = req.body;
  const query = 'INSERT INTO fine_det (TYPE,FCODE, AMOUNT,SUMMARY) VALUES (?, ?, ?, ?)';
  connection.query(query, [TYPE,FCODE,AMOUNT,SUMMARY], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ success: true });
  });
});

app.put('/api/fine/:fcode', (req, res) => {
  const { fcode } = req.params;
  const { TYPE, AMOUNT, SUMMARY } = req.body; // Updated property name to DESC
  const query = `
    UPDATE fine_det 
    SET TYPE = ?, AMOUNT = ?, SUMMARY = ? 
    WHERE FCODE = ?
  `;
  
  connection.query(query, [TYPE, AMOUNT, SUMMARY, fcode], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ success: true });
  });
});



app.delete('/api/fine/:fcode', (req, res) => {
  const { fcode } = req.params;
  const query = 'DELETE FROM fine_det WHERE FCODE = ?';
  
  connection.query(query, [fcode], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ success: true });
  });
});

//mail

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  host: 'smtp.gmail.com',
  port : 587,
  secure: false,

  auth: {
    user: 'finemanager308@gmail.com',
    pass: 'zmmb fkno hntf muax'
  }
});

app.post('/api/addfine', (req, res) => {
  const { REG_NO, S_ID, FCODE, DESCRIPTION } = req.body;
  console.log(S_ID, REG_NO);
  const DATE_TIME = new Date(); // Current date and time
  const STATUS = 1; // Active status by default

  const insertFineQuery = `
      INSERT INTO fine_manager (REG_NO, S_ID, FCODE, DESCRIPTION, DATE_TIME, STATUS)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(insertFineQuery, [REG_NO, S_ID, FCODE, DESCRIPTION, DATE_TIME, STATUS], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }

      // Fetch the user's email based on REG_NO
      const getUserEmailQuery = `
          SELECT email FROM users WHERE id = ?
      `;

      connection.query(getUserEmailQuery, [REG_NO], (err, userResult) => {
          if (err) {
              return res.status(500).send(err);
          }

          if (userResult.length === 0) {
              return res.status(404).send({ message: 'User not found' });
          }

          const userEmail = userResult[0].email;

          const HTML=`<!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Fine Notification</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              margin: 0;
                              padding: 0;
                          }
                          .email-container {
                              max-width: 600px;
                              margin: 20px auto;
                              background-color: #ffffff;
                              padding: 20px;
                              border-radius: 8px;
                              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          }
                          .email-header {
                              background-color: #007bff;
                              color: #ffffff;
                              padding: 10px;
                              border-radius: 8px 8px 0 0;
                          }
                          .email-header h1 {
                              margin: 0;
                          }
                          .email-body {
                              padding: 20px;
                          }
                          .email-body p {
                              margin: 0 0 10px;
                          }
                          .email-footer {
                              text-align: center;
                              margin-top: 20px;
                              color: #888888;
                              font-size: 12px;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="email-container">
                          <div class="email-header">
                              <h1>Fine Notification</h1>
                          </div>
                          <div class="email-body">
                              <p>Dear Student ${REG_NO},</p>
                              <p>A new fine has been added to your account by your teacher <strong>SID:${S_ID}</strong></p>
                              <p><strong>Fine Details:</strong> ${FCODE}</p>
                              <p><strong>Description:</strong> ${DESCRIPTION}</p>
                              <p><strong>Date & Time:</strong> ${DATE_TIME}</p>
                              <p>View Portal for more details</p>
                              <p>Please contact your teacher or the administration office if you have any questions regarding this fine.</p>
                          </div>
                          <div class="email-footer">
                              <p>&copy; 2024 Puducherry Technological University. All rights reserved.</p>
                          </div>
                      </div>
                  </body>
                  </html>
                  `
          // Send email notification
          const mailOptions = {
            from: {
              name: 'admin'
            },
            to: [userEmail],
            subject: 'New Fine Added',
            text: `A new fine has been added to your account.\n\nFine Details:\n- Description: ${DESCRIPTION}\n- Date & Time: ${DATE_TIME}`,
            html: HTML
          };

          transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                  return res.status(500).send(err);
              }
              res.json({ message: 'Fine added successfully and email sent', fineId: result.insertId });
          });
      });
  });
});


app.get('/api/fines',(req,res)=>{

})
app.get('/api/fines/:regNo', (req, res) => {
  const { regNo } = req.params;
  const query = `
      SELECT * FROM fine_manager 
      join fine_det ON fine_manager.FCODE=fine_det.FCODE
      WHERE REG_NO = ? ORDER BY DATE_TIME DESC;
  `;
  connection.query(query, [regNo], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(results);
  });
});

// Endpoint to fetch fines by REG_NO and S_ID
app.get('/api/fines/:regNo/:sId', (req, res) => {
  const { regNo, sId } = req.params;
  const query = `
      SELECT * FROM fine_manager
      WHERE REG_NO = ? ORDER BY DATE_TIME DESC;
  `;
  connection.query(query, [regNo, sId], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(results);
  });
});

// Endpoint to withdraw a fine by setting STATUS to 3
app.put('/api/fine/withdraw/:fid', (req, res) => {
  const { fid } = req.params;
  const query = `
      UPDATE fine_manager
      SET STATUS = 3
      WHERE fid = ?
  `;
  connection.query(query, [fid], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json({ message: 'Fine withdrawn successfully' });
  });
});

app.post('/api/updatePortalStatus', (req, res) => {
  const { prog, sem, dued, duet, status } = req.body;
  let query=''
  if(prog && sem){
    query = `UPDATE portal SET STATUS = ?, DUED = ?, DUET = ? WHERE PROG = ? AND SEM = ?`;
    connection.query(query, [status,  dued, duet, prog, sem], (err, result) => {
      if (err) {
          res.status(500).send('Error updating status');
      } else {
          res.send('Status updated successfully');
      }
  });
  }else{
    query= `UPDATE portal SET STATUS=? ,DUED=? ,DUET=?`;
    connection.query(query, [status,null,null], (err, result) => {
      if (err) {
          res.status(500).send('Error updating status');
      } else {
          res.send('Status updated successfully');
      }
  });
  }
  
});

app.get('/api/portal/:prog/:sem', (req,res) => {
  const { prog , sem }=req.params;
  const query = `SELECT * FROM PORTAL WHERE PROG=? AND SEM=?`;
  connection.query(query,[prog,sem],(err,results)=>{
    if(err){
      res.status(500).send('Error Fetching Portal Details');
    }else{
      res.send({out:results[0],msg:"Successful Fetch"});
    }
  })
});

//Payment Integration
// Fetch payment details from Razorpay API
app.get('/payments/:paymentId', async (req, res) => {
  const paymentId = req.params.paymentId;
  console.log(paymentId);
  try {
    const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      auth: {
        username: 'rzp_test_McwSUcwNGFPUuj',
        password: 'tMiEVgXMLywBs8e2EzN5cv0F'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.get('/api/fine-manager', (req, res) => {
  const query = 'SELECT * FROM fine_manager';
  connection.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
});

// Update fine status to 4 (Cancelled)
app.put('/api/fine-manager/:id/:flag', (req, res) => {
  const { id, flag } = req.params;
  console.log('Updating fine with ID:', id, 'and flag:', flag);

  let query;
  if (flag === '0') {
    query = 'UPDATE fine_manager SET STATUS = 4 WHERE fid = ?';
  } else if (flag === '1') {
    query = 'UPDATE fine_manager SET STATUS = 1 WHERE fid = ?';
  }

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Error updating fine status' });
    }
    console.log('Query result:', result);
    res.json({ message: 'Fine status updated successfully' });
  });
});

app.put('/payments/update-fineManager',(req, res) => {
  const fineManagerQuery = 'SELECT * FROM fine_manager';
  connection.query(fineManagerQuery, async (fineManagerError, fineManagerResults) => {
    if (fineManagerError) {
      console.error('Error fetching fineManager records:', fineManagerError);
      return res.status(500).send('Error fetching fineManager records');
    }

    // Iterate over each record in fineManager table
    for (const record of fineManagerResults) {
      const fid = record.fid;

      // Check if fid exists in payment table
      const paymentQuery = 'SELECT * FROM payment WHERE fid = ?';
      connection.query(paymentQuery, [fid], async (paymentError, paymentResults) => {
        if (paymentError) {
          console.error('Error checking payment table:', paymentError);
          return res.status(500).send('Error checking payment table');
        }

        // If fid exists in payment table
        if (paymentResults.length > 0) {
          // Update status in fineManager table to 2
          const updateQuery = 'UPDATE fine_manager SET status = ? WHERE fid = ?';
          connection.query(updateQuery, [2, fid], (updateError, updateResults) => {
            if (updateError) {
              console.error('Error updating fineManager table:', updateError);
              return res.status(500).send('Error updating fineManager table');
            }
            console.log(`Status updated successfully for fid: ${fid}`);
          });
        }
      });
    }

    res.status(200).send('Status updated for all applicable records');
  });
});

// Inserting payment details into the database
app.post('/api/specific-payment-details/', async (req, res) => {
  const { userId, fid } = req.query;
  const { id, amount, created_at, method } = req.body.data;
  console.log(req.body.data);
  const date = new Date(created_at * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const amt = amount/100;

  console.log('Formatted date:', date);

    // Insert payment details into the payment table
    const insertQuery = 'INSERT INTO payment(REG_NO, fid, TRANSACTION_ID, TYPE, AMOUNT, DOP, MOP) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [userId, fid, id, 'fine', amt, date, method], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting payment details:', insertError);
        res.status(500).send('Error inserting payment details');
      } else {
        console.log('Payment details inserted successfully');
        res.status(200).send('success');
      }
    });
});

//Inserting fee payment details into database
app.post('/api/fee-payment-details/', async (req, res) => {
  const { userId, sem } = req.query;
  const { id, amount, created_at, method } = req.body.data;
  console.log(sem);
  const date = new Date(created_at * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const amt = amount/100;


    // Insert payment details into the payment table
    const insertQuery = 'INSERT INTO payment(REG_NO, fid, TRANSACTION_ID, TYPE, AMOUNT, DOP, MOP) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [userId, sem, id, 'fee', amt, date, method], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting payment details:', insertError);
        res.status(500).send('Error inserting payment details');
      } else {
        console.log('Payment details inserted successfully');
        res.status(200).send('success');
      }
    });

    const insQuery=`INSERT INTO hallticked(REG_NO,SEM)`
});


app.get('/api/view-payment', (req, res) =>{
  const query =  `Select p.REG_NO, p.fid, p.TRANSACTION_ID ,p.DOP ,p.MOP, p.AMOUNT,p.TYPE from se.payment p 
  join academic a  ON p.REG_NO=a.REG_NO JOIN portal l ON l.SEM=a.sem and l.PROG=a.PROGRAMME and a.sem=p.fid and p.TYPE='fee'
 AND l.STATUS=1 ;`

 connection.query(query, (error, results) => {
  if(error){
    res.status(500).send("Error fetching payment details");
  }
  res.status(200).send(results);
 });
});

app.get('/api/view-payment-defaulter', (req, res) =>{
  const query =  ` SELECT a.REG_NO, n.NAME,a.PROGRAMME,a.sem, u.email, d.name AS DEPARTMENT
FROM academic a
JOIN portal l ON a.sem = l.SEM JOIN nominal_roll n JOIN department d ON a.dept_id = d.dept_id JOIN users u ON a.REG_NO=u.id AND a.PROGRAMME = l.PROG AND l.STATUS = 1 AND n.REG_NO = a.REG_NO
WHERE a.REG_NO NOT IN (
    SELECT p1.REG_NO
    FROM se.payment p1
    JOIN academic a1 ON p1.REG_NO = a1.REG_NO
    JOIN portal l1 ON l1.SEM = a1.sem AND l1.PROG = a1.PROGRAMME AND a1.sem = p1.fid
    WHERE p1.TYPE = 'fee' AND l1.STATUS = 1
);`


 connection.query(query, (error, results) => {
  if(error){
    res.status(500).send("Error fetching payment details");
  }
  res.status(200).send(results);
 });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
