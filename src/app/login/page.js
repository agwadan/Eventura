"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use the router from Next.js
import styles from "./page.module.css";

function Login() {
  const [identifier, setIdentifier] = useState(""); // Identifier can be username or email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    const apiUrl = "http://localhost:1337/api/auth/local"; // Strapi login endpoint

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier, // Can be email or username
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem("authToken", data.jwt);

      console.log("Login successful:", data);

      // Redirect to the home page
      router.push("/");
    } catch (error) {
      setError(error.message);
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formWrapper}>
        <h1 className={`${styles.title} eventura`}>Login</h1>

        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.signupButton}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.loginLink}>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;