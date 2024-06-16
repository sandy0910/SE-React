import React, { useState, useEffect } from 'react';
import { auth, sendPasswordResetEmail } from '../Firebase';
import Carousal from './Carousal';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();
  const images = [
    { src: 'image1.png', text: '<p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing</strong> elit. Text 1</p>' },
    { src: 'image2.png', text: '<p>Sed do eiusmod tempor incididunt ut <em>labore et dolore</em> magna aliqua. Text 2</p>' },
    { src: 'image3.png', text: '<p>Ut enim ad minim veniam, quis nostrud <u>exercitation ullamco</u>. Text 3</p>' },
    { src: 'image4.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 4</p>' },
    { src: 'image5.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 5</p>' },
    { src: 'image6.png', text: '<p>Duis aute irure dolor in reprehenderit in <strong>voluptate velit</strong>. Text 6</p>' }
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
      await sendPasswordResetEmail(auth, email);
      alert('Check your email for password reset instructions.');
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('Email not found. Please contact admin.');
      } else {
        setError('Error sending password reset email. Please try again later.');
      }
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
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
      <div className='foot'>
        <p>Contact:</p>
      </div>
    </div>
  );
};

export default ForgetPassword;
