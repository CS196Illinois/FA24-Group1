import styles from './page.module.css';
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import Link from 'next/link';

export default function Login() {
    return (
<<<<<<< HEAD
      <div className = {styles.photo}>
        <div className = {styles.pad}>
          <div className = {styles.box}>
              <div className = {styles.logoContainer}>
                <Image src={LogoImg} className = {styles.logo}/>
                <h1 className = {styles.title}>Memory Mosaic</h1>
              </div>
              <h4 className = {styles.boxDes}> Username</h4>
              <input type="text" placeholder="Enter Username" className={styles.textBox} required></input>
              <h4 className = {styles.boxDes}> Password</h4>
              <input type="text" placeholder="Enter Password" className={styles.textBox} required></input>
              <Link href="login/empty" className={styles.signIn}>
                Sign In
              </Link>
          </div>
        </div>
=======
      <div>
        <h1> . </h1>
        <h1> . </h1>
        <h1>Login</h1>
        <p>This is the login page.</p>
>>>>>>> 60b48d0fe5de30e37b0d91b98f87a8e43ff255bd
      </div>
    );
}

