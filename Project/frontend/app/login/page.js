import styles from './page.module.css';
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import Link from 'next/link';

export default function Login() {
    return (
      <div className = {styles.photo}>
        <div className = {styles.pad}>
          <div className = {styles.box}>
              <div className = {styles.logoContainer}>
                <Image src={LogoImg} className = {styles.logo} alt = "MemoryMosaic Logo"/>
                <h1 className = {styles.title}>Memory Mosaic</h1>
              </div>
              <div id="g_id_onload"
              data-client_id="977126465587-tqhbr0spj73u0vttvc1nckebcmmj1jd0.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-login_uri="http://localhost:3000/login"
              data-auto_prompt="false">
            </div>
            <div className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
              {/*
              <h4 className = {styles.boxDes}> Username</h4>
              <input type="text" placeholder="Enter Username" className={styles.textBox} required></input>
              <h4 className = {styles.boxDes}> Password</h4>
              <input type="text" placeholder="Enter Password" className={styles.textBox} required></input>
              <Link href="login/empty" className={styles.signIn}>
                Sign In
              </Link>
              */}
          </div>
        </div>
      </div>
    );
}

