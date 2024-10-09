import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css";


const Navbar = () => {
  return (

<nav className={styles.navbar}>
    <Link href="/" className={styles.logo}>
        Website Title Here
    </Link>
    <ul >
    <li>
      <Link href="/" className= {styles.home}>
        home
      </Link>
    </li>
    <li>|</li>
    <li>
      <Link href="/login" className = {styles.login}>
        login
      </Link>
    </li>
    <li>|</li>
    <li>
      <Link href="/about" className= {styles.about}>
        about
      </Link>
    </li>
  </ul>
  
</nav>
);
};

export default Navbar;