"use client";
import Image from "next/image"; // Ensure the import is correct
import styles from "./page.module.css";
import EventCard from "../components/EventCard"; // Import the EventCard component
import { useState, useEffect } from "react"; // Import useState and useEffect

const events = [
  {
    name: "Carol Nantongo Live in Concert",
    tagline: "Tugende mu kikade.",
    category: "Music",
    image: "/images/carol-nantongo.jpg",
  },
  {
    name: "Pearl Rhythm",
    tagline: "Don't miss this amazing show!",
    image: "/images/pearl-rhythm.jpg",
    category: "Festival",
  },
  {
    name: "Carol Nantongo Live in Concert",
    tagline: "Tugende mu kikade.",
    category: "Music",
    image: "/images/carol-nantongo.jpg",
  },
  {
    name: "Pearl Rhythm",
    tagline: "Don't miss this amazing show!",
    image: "/images/pearl-rhythm.jpg",
    category: "Festival",
  },
  {
    name: "Carol Nantongo Live in Concert",
    tagline: "Tugende mu kikade.",
    category: "Music",
    image: "/images/carol-nantongo.jpg",
  },
  {
    name: "Pearl Rhythm",
    tagline: "Don't miss this amazing show!",
    image: "/images/pearl-rhythm.jpg",
    category: "Festival",
  },
  {
    name: "Carol Nantongo Live in Concert",
    tagline: "Tugende mu kikade.",
    category: "Music",
    image: "/images/carol-nantongo.jpg",
  },
  {
    name: "Pearl Rhythm",
    tagline: "Don't miss this amazing show!",
    image: "/images/pearl-rhythm.jpg",
    category: "Festival",
  },
  {
    name: "Carol Nantongo Live in Concert",
    tagline: "Tugende mu kikade.",
    category: "Music",
    image: "/images/carol-nantongo.jpg",
  },
  {
    name: "Pearl Rhythm",
    tagline: "Don't miss this amazing show!",
    image: "/images/pearl-rhythm.jpg",
    category: "Festival",
  },
  // Add more events as needed
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  // Autoscroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextEvent(); // Automatically go to the next event
    }, 5000); // Change event every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <div className={styles.gridContainer}>
        <div className={styles.imageContainer}>
          <div
            className={styles.imageWrapper}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event, index) => (
              <div key={index} className={styles.imageSlide}>
                <Image
                  src={event.image}
                  alt={event.name}
                  width={500}
                  height={500}
                  objectFit="cover"
                  style={{ borderRadius: 16 }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.textContainer}>
          <h1>{events[currentIndex].name}</h1>
          <p style={{ marginTop: 12 }}>
            <i>{events[currentIndex].tagline}</i>
          </p>
          {/* <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={prevEvent}>
              Previous
            </button>
            <button className={styles.button} onClick={nextEvent}>
              Next
            </button>
          </div> */}
        </div>
      </div>

      {/* New section for event cards */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{ textAlign: "center" }}>Upcoming Events</h2>
        <div className={styles.cardContainer}>
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
