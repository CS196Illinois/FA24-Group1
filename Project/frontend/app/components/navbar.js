import React from 'react';
import Link from 'next/link';
import styles from "./navbar.module.css";


const Navbar = () => {
  return (

<nav className={styles.navbar}>
    <ul>
      <li className = {styles.logo}>
          Website Title Here
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
      <Link href="/about" className= {styles.item}>
        about
      </Link>
    </li>
  </ul>
  
</nav>
);
};

export default Navbar;