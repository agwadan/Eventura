"use client";
import Image from "next/image";
import styles from "./page.module.css";

import LoginPage from "@/loginpage/pages";


import SignUp from "./signuppage/page";


import EventCard from "../components/EventCard";
import { useState, useEffect } from "react";
import Link from "next/link";


export default function Home() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMyNzM3MzM2LCJleHAiOjE3MzUzMjkzMzZ9.G1ymtCNq05XmiDYPvngzjxxTtIC_9WNqMjuCo9Z0NdQ"; // Or wherever you're storing the token
      try {
        const response = await fetch(
          "http://localhost:1337/api/events?populate=flyers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("====================================");
        console.log(data);
        console.log("====================================");
        setEvents(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextEvent();
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <>


      <div className={styles.gridContainer}>
        {/* ==== Left Half ==== */}
        <div className={styles.imageContainer}>
          <div
            className={styles.imageWrapper}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event, index) => (
              <div key={index} className={styles.imageSlide}>
                <Link href={`/event-detail?eventId=${event.documentId}`}>
                  <Image
                    src={`${apiUrl}${event?.flyers[0].url}`}
                    alt={event.name}
                    width={500}
                    height={500}
                    objectFit="cover"
                    style={{ borderRadius: 16 }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.textContainer}>
          {events.length > 0 && (
            <>
              <h1>{events[currentIndex].name}</h1>
              <p>
                <i>{events[currentIndex].tag_line}</i>
              </p>
              {/*   <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={prevEvent}>
                  Previous
                </button>
                <button className={styles.button} onClick={nextEvent}>
                  Next
                </button>
              </div> */}
            </>
          )}
        </div>
      </div>

      <div className={styles.cardContainer}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </>
  );
}
