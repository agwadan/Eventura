import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import styles from "./EventDetail.module.css";

function EventDetail() {
  const [isClient, setIsClient] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Track like count locally
  const [shareCount, setShareCount] = useState(0); // Track share count locally

  const apiUrl = "http://localhost:1337"; // Use environment variable for React

  const { eventId } = useParams();
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
          setEvent(data.data);
          setLikeCount(data.data.likeCount || 0); // Initialize like count from API
          setShareCount(data.data.shareCount || 0); // Initialize share count from API
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventDetail();
    }
  }, [eventId, apiUrl]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/event-detail?eventId=${eventId}`;

    // Update the share count when the event is shared
    const updatedShareCount = shareCount + 1;
    setShareCount(updatedShareCount); // Update the frontend

    // Update the backend with the new share count
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            shareCount: updatedShareCount,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update share count");
      }

      const data = await response.json();
      console.log("Share count updated:", data);
    } catch (error) {
      console.error("Error updating share count:", error);
    }

    // Perform sharing action
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

  const handleSaveClick = async () => {
    setIsSaved((prev) => !prev);

    // Update like count locally
    const updatedLikeCount = likeCount + 1;
    setLikeCount(updatedLikeCount);

    try {
      const token = localStorage.getItem("authToken");
      const userInfo = localStorage.getItem("userData");

      if (!userInfo) {
        console.error("No user data found in localStorage");
        return;
      }

      // Parse and extract userId
      const userData = JSON.parse(userInfo);
      const userId = userData.user?.id;

      if (!userId) {
        console.error("User ID not found in user data");
        return;
      }

      console.log("User ID:", userId);

      // 1. Update like count for the event
      await fetch(`${apiUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            likeCount: updatedLikeCount,
          },
        }),
      });

      // 2. Fetch user's existing events
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userResponseData = await response.json();
      const existingEvents = userResponseData.events || [];

      // 3. Check if event is already saved
      const eventAlreadySaved = existingEvents.some(
        (savedEvent) => savedEvent.id === eventId
      );

      if (!eventAlreadySaved) {
        // 4. Add current event to user's events
        const updatedEvents = [
          ...existingEvents,
          {
            id: eventId,
            name: event.name,
            date: event.start_date,
            category: event.categories[0]?.name || "Uncategorized",
          },
        ];

        // 5. Update user events in backend
        const updateResponse = await fetch(`${apiUrl}/api/users/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events: updatedEvents,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update user events");
        }

        console.log(
          "User events updated successfully:",
          await updateResponse.json()
        );
      } else {
        console.log("Event is already saved in user's events list.");
      }
    } catch (error) {
      console.error("Error updating user's events:", error);
    }
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
