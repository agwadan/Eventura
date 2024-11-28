import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import styles from "./EventDetail.module.css";

function EventDetail() {
  const [isClient, setIsClient] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const apiUrl = "http://localhost:1337"; // Use environment variable for React

  const { eventId } = useParams();
  console.log("====================================");
  console.log(eventId);
  console.log("====================================");
  useEffect(() => {
    setIsClient(true);

    if (eventId) {
      const fetchEventDetail = async () => {
        try {
          const token = localStorage.getItem("authToken");
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
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventDetail();
    }
  }, [eventId, apiUrl]);

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
            <img
              src={`${apiUrl}${event.flyers[0].url}`}
              alt={event.name}
              style={{ objectFit: "cover", width: "100%", height: "auto" }}
            />
          )}
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.eventName}>{event.name}</h1>

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
              <p>Category: {event.categories[0]?.name || "Not specified"}</p>
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
