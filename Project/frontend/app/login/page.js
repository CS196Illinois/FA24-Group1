"use client"; // Marks this file as a Client Component

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import styles from "./page.module.css";
import "./button.css"; // Import the button CSS file
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import Link from "next/link";

const clientId = "907457302435-186q2nuk56chhf16pr4auhd6o2lkftj6.apps.googleusercontent.com";

export default function Login() {
  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Successful:", credentialResponse);
    // Send credential to backend for verification
    fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend Response:", data);
      })
      .catch((error) => {
        console.error("Error sending credential to backend:", error);
      });
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google Login Failed");
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
            <input type="text" placeholder="Enter Username" className={styles.textBox} required />
            <h4 className={styles.boxDes}>Password</h4>
            <input type="password" placeholder="Enter Password" className={styles.textBox} required />
            <Link href="login/empty" className={styles.signIn}>
              Sign In
            </Link>

            {/* Google Login Button */}
            <div className={styles.googleButtonContainer}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
