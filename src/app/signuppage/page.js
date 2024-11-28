'use client';
import React from 'react';
import styles from './page.module.css';

function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formWrapper}>
        <h1 className={`${styles.title} eventura`}>Create Account</h1>
        
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Username</label>
            <input 
              type="text" 
              id="fullName"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              placeholder="Create a password"
              required
            />
          </div>

         

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
