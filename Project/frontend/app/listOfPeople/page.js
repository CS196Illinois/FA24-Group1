import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import userImg from '/public/addUser.png';
import styles from './friends.module.css';

const friends = [
  { name: 'Johnny Anderson', url: '/View-Person', picture: '/Johnny.jpeg' },
  { name: 'Jane Anderson', url: '/login', picture: '/headshot-dummy.jpg'},
  { name: 'Chris Anderson', url: '/chris', picture: '/headshot-dummy.jpg'}
];

const PersonIcon = ({ name, url, picture }) => {
  return (
    <div className = {styles.userIcon}>
      <Link href = {url}>
        <div className = {styles.imageContainer}>
          <Image alt = {name} src = {picture} className = {styles.userPicture} width = {100} height = {100} />
        </div>
        <p>{name}</p>
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <div className = {styles.app}>
      <div className = {styles.iconGrid}>
        {friends.map((user, index) => (
          <PersonIcon key = {index} name = {user.name} url = {user.url} picture = {user.picture} />
        ))}
        <div className = {styles.addIcon}>
          <Link href = "/createUser" className = {styles.item}>
            <div className = {styles.imageContainer}>
              <Image src = {userImg} alt = "Add User" className = {styles.userPicture} />
            </div>
            <p>Add User</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;