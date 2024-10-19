import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css";
import Image from "next/image";
import LogoImg from "/public/Logo.png";
import './navbar.module.css';
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Image alt="logo" src={LogoImg} className={styles.logoPic}/>
        </li>
        <li className={styles.logo}>
          Memory Mosaic
        </li>
        <li>
          <Link href="/" className={styles.item}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/login" className={styles.item}>
            Login
          </Link>
        </li>
        <li>
          <Link href="/createUser" className={styles.item}>
            Create User
          </Link>
        </li>
        <li>
          <Link href="/about" className={styles.item}>
            About
          </Link>
        </li>
        <li>
          <Link href="/View-Person">View Person</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;