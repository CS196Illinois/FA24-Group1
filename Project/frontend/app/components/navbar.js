import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css";
import Image from "next/image";
import LogoImg from "../public/Logo.png";

const Navbar = () => {
  return (

<nav className={styles.navbar}>
    <ul>
    <Image alt="logo" src={LogoImg} className={styles.logoPic}/>
      <li className = {styles.logo}>
          Memory Mosaic
      </li>
      <li>
      <Link href="/" className= {styles.item}>
        home
      </Link>
    </li>
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
    <li>
      <Link href="/about" className= {styles.item}>
        about
      </Link>
    </li>
  </ul>
  
</nav>
);
};

export default Navbar;