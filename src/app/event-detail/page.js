"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

function EventDetail() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [isClient, setIsClient] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consolidate useEffect hooks
  useEffect(() => {
    // Set client-side rendering flag
    setIsClient(true);

    // Fetch event details
    if (eventId) {
      const fetchEventDetail = async () => {
        try {
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMyNzM3MzM2LCJleHAiOjE3MzUzMjkzMzZ9.G1ymtCNq05XmiDYPvngzjxxTtIC_9WNqMjuCo9Z0NdQ";
          const response = await fetch(
            `${apiUrl}/api/events/${eventId}?populate[0]=flyers&populate[1]=categories`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch event details");
          }

          const data = await response.json();

          console.log("====================================");
          console.log(data);
          console.log("====================================");
          setEvent(data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event:", error);
          setLoading(false);
        }
      };

      fetchEventDetail();
    }
  }, [eventId, apiUrl]);

  // Early return for loading and error states
  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!eventId) {
    return <div>Loading event...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className={styles.eventDetailContainer}>
      <div className={styles.imageSection}>
        {event?.flyers?.[0]?.url && (
          <Image
            src={`${apiUrl}${event.flyers[0].url}`}
            alt={event.name}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        )}
      </div>

      <div className={styles.detailsSection}>
        <h1 className={`${styles.eventName} eventura`}>{event.name}</h1>

        <div className={styles.eventInfo}>
          {/* <div className={styles.infoItem}>
            <label>Venue: {event.venue || "Unknown Venue"}</label>
          </div> */}

          <div className={styles.infoItem}>
            <label>
              Fee: {event.price ? `UGX. ${event.price}` : "Not specified"}
            </label>
          </div>

          <div className={styles.infoItem}>
            <p>
              Date:{" "}
              {new Date(event.start_date).toLocaleDateString() ||
                "Not specified"}
            </p>
          </div>

          <div className={styles.infoItem}>
            <label>
              Time:{" "}
              {new Date(event.start_date).toLocaleTimeString() ||
                "Not specified"}
            </label>
          </div>

          <div className={styles.infoItem}>
            <p>Category: {event.categories[0].name || "Not specified"}</p>
            <br />
            {event.discount && (
              <p>
                Click <strong>Pay here</strong> to get a {event.discount}%
                discount
              </p>
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.interestedBtn}>Interested</button>
          <button className={styles.getCodeBtn}>Pay here</button>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
