import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ViewPerson.module.css';
import Navbar from '../components/navbar';

const ViewPerson = () => {
  const events = [
    {
      id: 1,
      title: 'His Birth',
      description: "Johnny's birth on October 16, 2012, was a joyous occasion. I remember holding him for the first time, marveling at his tiny fingers and toes.",
      image: '/JohnnyBorn.jpg'
    },
    {
      id: 2,
      title: 'Ducks at the Pond',
      description: "When Johnny was just 2 years old, we spent a day at the park. He was fascinated by the ducks in the pond, and we fed them together.",
      image: '/JohnnyFeedingDucks.jpg'
    },
    {
      id: 3,
      title: 'First Time Baking Cookies',
      description: "At age 3, Johnny helped me bake cookies for the first time. The kitchen was a mess, but his laughter made it all worthwhile.",
      image: '/JohnnyMakingCookies.jpg'
    },
    {
      id: 4,
      title: 'First Day of Kindergarten',
      description: "Johnny's first day of kindergarten in 2017 was bittersweet. He was so excited, but I couldn't help feeling emotional as he waved goodbye.",
      image: '/JohnnyFirstDay.jpeg'
    },
    {
      id: 5,
      title: 'His First Fishing Trip',
      description: "When Johnny was 6, we went fishing at the lake. I taught him how to cast a line, and his face lit up when he caught his first fish.",
      image: '/JohnnyFishing.png'
    },
    {
      id: 6,
      title: 'First School Sports Day',
      description: "At age 7, Johnny participated in his first school sports day. I cheered so loudly for him, I'm sure the whole neighborhood heard me.",
      image: '/JohnnyAtSportsDay.png'
    },
    {
      id: 7,
      title: 'Christmas 2020',
      description: "Christmas morning when Johnny was 8 was particularly special. He gave me a hand-drawn picture that brought tears to my eyes.",
      image: '/JohnnyAtChristmas.jpg'
    },
    {
      id: 8,
      title: 'Thanksgiving 2023',
      description: "Last Thanksgiving, we went on a road trip together. Johnny sang along to all my favorite old tunes, much to my delight.",
      image: '/JohnnyThanksgiving.png'
    },
    {
      id: 9,
      title: 'Fourth of July',
      description: "This past Fourth of July, we watched fireworks together. I shared stories about the history of Independence Day, and Johnny listened with rapt attention.",
      image: '/JohnnyAtFireworks.png'
    },
    {
      id: 10,
      title: 'Zoo',
      description: "A few months ago, Johnny and I visited the zoo. Seeing his excitement at each animal exhibit reminded me of the wonder of childhood.",
      image: '/JohnnyAtTheZoo.jpg'
    },
    {
      id: 11,
      title: 'Knitting Class',
      description: "Just last week, Johnny joined me for my knitting class. He was so determined to learn and managed to knit a small scarf.",
      image: '/JohnnyGrandmaKnitting.jpg'
    },
    {
      id: 12,
      title: 'Video Games',
      description: "Yesterday, we played video games together. To Johnny's surprise, I managed to win a round. The look of astonishment on his face was priceless.",
      image: '/JohnnyGamingwithGrandma.jpg'
    }
  ];
  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Johnny's Life Events</h1>
        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImage}>
                <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" />
              </div>
              <div className={styles.eventContent}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPerson;