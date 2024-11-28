"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import styles from "./page.module.css";

export default function EventList() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Extract the query from the URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("query");
    setSearchQuery(query);

    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `${apiUrl}/api/events?populate=flyers&filters[name][$containsi]=${query}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchEvents();
  }, [apiUrl]);

  return (
    <>
      <div className={styles.pageContainer}>
        <h1>Search results for: {searchQuery}</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.cardContainer}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))
            ) : (
              <p>No events found</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
