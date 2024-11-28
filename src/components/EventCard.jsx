import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EventCard.module.css";
import { FaRegEye, FaRegHeart, FaShareAlt } from "react-icons/fa";

const EventCard = ({ event }) => {
  const apiUrl = "http://localhost:1337";
  const navigate = useNavigate();

  // State to manage the updated view count
  const [viewCount, setViewCount] = useState(event.viewCount || 0);

  // Determine badge type based on event rank
  let badgeType;
  if (event.rank === "GOLD") badgeType = "gold";
  else if (event.rank === "SILVER") badgeType = "silver";
  else if (event.rank === "PLATINUM") badgeType = "platinum";
  else badgeType = null;

  // Function to update the view count in the backend
  const updateViewCount = async () => {
    try {
      // Send updated view count to the backend
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/api/events/${event.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            viewCount: viewCount + 1, // Increment view count
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update view count");

      const updatedEvent = await response.json();
      setViewCount(updatedEvent.data.viewCount); // Update the local view count state
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  // Function to handle navigation to the event details
  const handleNavigate = async () => {
    // First, update the view count in the backend
    await updateViewCount();

    // Then navigate to event details
    navigate(`/event-detail/${event.documentId}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleNavigate}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.imageContainer}>
        <img
          src={`${apiUrl}${event?.flyers[0]?.url}`}
          alt={event.name}
          width={200}
          height={200}
          style={{ objectFit: "cover" }}
        />
        {badgeType && (
          <div className={`${styles.badge} ${styles[badgeType]}`}>
            {badgeType}
          </div>
        )}
      </div>
      <div className={styles.titleContainer}>
        <h2 style={{ fontSize: 16, margin: 12, alignItems: "center" }}>
          {event.name}
        </h2>
      </div>
      <p style={{ fontSize: 12, alignItems: "flex-start", marginBottom: 8 }}>
        {event.category}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        {/* Eye icon for click count */}
        <p
          style={{
            fontSize: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            color: "#2c9083", // Update the color of the counter
          }}
        >
          <FaRegEye style={{ marginRight: 5, color: "#2c9083" }} />
          {viewCount}
        </p>

        {/* Heart icon for like count */}
        <p
          style={{
            fontSize: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            color: "#2c9083", // Update the color of the counter
          }}
        >
          <FaRegHeart
            style={{ marginRight: 5, cursor: "pointer", color: "#2c9083" }}
            // Add like functionality
          />
          {event.likeCount || 0}
        </p>

        {/* Share icon for share count */}
        <p
          style={{
            fontSize: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            color: "#2c9083", // Update the color of the counter
          }}
        >
          <FaShareAlt
            style={{ marginRight: 5, cursor: "pointer", color: "#2c9083" }}
            // Add share functionality
          />
          {event.shareCount || 0}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
