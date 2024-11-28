"use client";
import React, { useState, useEffect, Suspense } from "react";
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
  const [isSaved, setIsSaved] = useState(false);

  // Consolidate useEffect hooks
  useEffect(() => {
    setIsClient(true);

    if (eventId) {
      const fetchEventDetail = async () => {
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("authToken")
              : null;
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

  // Share functionality
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/event-detail?eventId=${eventId}`;

    if (navigator.share) {
      navigator
        .share({
          title: event?.name || "Event",
          text: `Check out this event: ${event?.name || "Event Details"}`,
          url: shareUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Event link copied to clipboard!");
    }
  };

  const handleSaveClick = () => {
    setIsSaved((prev) => !prev);
  };

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
    <Suspense fallback={<div>Loading...</div>}>
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
              {event.discount && (
                <p>
                  Click <strong>Pay here</strong> to get a {event.discount}%
                  discount
                </p>
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.interestedBtn} onClick={handleSaveClick}>
              {isSaved ? "Saved" : "Interested"}
            </button>
            <button className={styles.getCodeBtn}>Pay here</button>
          </div>

          {/* Share Button */}
          <div className={styles.shareButtonContainer}>
            <button onClick={handleShare} className={styles.shareBtn}>
              Share Event
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default EventDetail;
