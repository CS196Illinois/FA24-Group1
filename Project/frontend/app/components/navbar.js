import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (

<nav className="navbar">
  <div className="navbar-left">
    <Link href="/" className="logo">
      Website Title Here
    </Link>
  </div>
</nav>
);
};

export default Navbar;