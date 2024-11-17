"use client"; // Marks this file as a Client Component

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import styles from "./page.module.css";
import "./button.css"; // Import the button CSS file
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import Link from "next/link";
import { useState } from "react";

const clientId = "907457302435-186q2nuk56chhf16pr4auhd6o2lkftj6.apps.googleusercontent.com";

export default function Login() {
  const [user, setUser] = useState(null); // Manage user state

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Successful:", credentialResponse);
    setUser(credentialResponse);


    fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Backend Response:", data);
      })
      .catch((error) => {
        console.error("Error communicating with backend:", error);
      });
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google Login Failed");
  };

  const handleLogout = () => {
    googleLogout(); // Clear Google session
    setUser(null); // Reset user state
    console.log("User logged out");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={styles.photo}>
        <div className={styles.pad}>
          <div className={styles.box}>
            <div className={styles.logoContainer}>
              <Image src={LogoImg} className={styles.logo} alt="Logo" />
              <h1 className={styles.title}>Memory Mosaic</h1>
            </div>
            <h4 className={styles.boxDes}>Username</h4>
            <input
              type="text"
              placeholder="Enter Username"
              className={styles.textBox}
              required
            />
            <h4 className={styles.boxDes}>Password</h4>
            <input
              type="password"
              placeholder="Enter Password"
              className={styles.textBox}
              required
            />
            {/* Corrected Link Usage */}
            <Link href="login/empty" className={styles.signIn}>
              Sign In
            </Link>

            {/* Google Login Button */}
            <div className={styles.googleButtonContainer}>
              {!user ? (
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                  useOneTap
                  render={(renderProps) => (
                    <button
                      className={styles.googleSignIn}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Sign in with Google
                    </button>
                  )}
                />
              ) : (
                <>
                  <button
                    className={styles.googleSignIn}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
