import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Carousal from './Carousal';
import './Login.css';

function Login() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const images = [
    { src: 'image1.png', text: '<p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit. Text 1</p>' },
    { src: 'image2.png', text: '<p>Sed do eiusmod tempor incididunt ut <em>labore et dolore</em> magna aliqua. Text 2</p>' },
    { src: 'image3.png', text: '<p>Ut enim ad minim veniam, quis nostrud <u>exercitation ullamco</u>. Text 3</p>' },
    { src: 'image4.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 4</p>' },
    { src: 'image5.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 4</p>' },
    { src: 'image6.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 4</p>' }
  ];

  const goToSlide = (index) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsFading(false);
    }, 500);
  };

  const nextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsFading(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000); // Auto transition every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // If authentication is successful, navigate based on user role
      const response = await fetch('http://localhost:3001/checkRole?email=' + email);
      if (response.ok) {
        const data = await response.json();
        const { role, id } = data;

        // Store role and ID in session storage
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('id', id);

        // Navigate based on the role
        if (role === 0) {
          navigate('/admin/form/student'); // Navigate to admin dashboard
        } else if (role === 1) {
          navigate('/student/profile'); // Navigate to student dashboard
        } else if (role === 2) {
          navigate('/staff/profile'); // Navigate to staff dashboard
        } else {
          setError('Invalid role');
        }
      } else {
        setError('Mapping Error');
      }
    } catch (error) {
      console.log(error.message);
      setError("Invalid Credentials");
    }
  };

  return (
    <div>
      <div className='head'>
        <img src="/ptu-logo.png" height={"100px"} alt="logo" />
        <h2>PUDUCHERRY TECHNOLOGICAL UNIVERSITY</h2>
      </div>
      <div className='page'>
        <div className='Crsl'>
          <Carousal images={images} index={currentIndex} goToSlide={goToSlide} nextSlide={nextSlide} />
        </div>
        <div className='Lgn'>
          <div className='form-container'>
            <h2>LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <p>{error}</p>
              <input type="submit" value="Sign In" />
            </form>
            <a href="forget-password">Forgot Password</a>
          </div>
        </div>
      </div>
      <div className='foot'>
        <p>Contact:</p>
      </div>
    </div>
  );
}

export default Login;
