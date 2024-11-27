"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Here you would typically make an API call to your authentication endpoint
      // For example:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // For demo purposes, let's just log the data
      console.log('Login attempt:', formData);
      
      // On successful login, redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div>
          <h2 className={styles.title}>
            Login into your account
          </h2>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <div>
              <label htmlFor="email" className={styles.srOnly}>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.inputTop}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className={styles.srOnly}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.inputBottom}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
