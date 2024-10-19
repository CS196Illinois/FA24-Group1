import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css";
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import './navbar.module.css';

const Navbar = () => {
  return (

<nav className={styles.navbar}>
  <div className = {styles.navbarLeft}>
    <ul>
      <Image alt="logo" src={LogoImg} className={styles.logoPic}/>
      <li className = {styles.logo}>
        <Link href="/">
          Memory Mosaic
        </Link>
      </li>
    </ul>
  </div>

  <div className = {styles.navbarCenter}>
    <ul>
      <li>
        <Link href="/about" className= {styles.item}>
          about
        </Link>
      </li>
      <li>
          <Link href="/View-Person">view person</Link>
      </li>
    </ul>
  </div>
  
  <div className = {styles.navbarRight}>
    <ul>
      <li>
        <Link href="/login" className = {styles.item}>
          login
        </Link>
      </li>
      <li>
        <Link href="/createUser" className = {styles.item}>
          create user
        </Link>
      </li>
    </ul>
  </div>

</nav>
);
};

export default Navbar;