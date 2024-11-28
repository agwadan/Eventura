import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard"; // Ensure correct path to EventCard
import styles from "./Home.module.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for events and categories

  const apiUrl = "http://localhost:1337"; // Use environment variable for React
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    // Fetch cached search query from localStorage if available
    const cachedQuery = localStorage.getItem("cachedSearchQuery");
    if (cachedQuery) setSearchQuery(cachedQuery);

    // Fetch events and categories
    const fetchData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("authToken");

        // Fetch events
        const eventsResponse = await fetch(
          `${apiUrl}/api/events?populate=flyers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!eventsResponse.ok) throw new Error("Network response was not ok");
        const eventsData = await eventsResponse.json();

        // Retrieve viewed events from local storage
        const viewedEventsOrder = JSON.parse(
          localStorage.getItem("viewedEventsOrder") || "[]"
        );

        // Sort events with priority to viewed events
        const sortedEvents = eventsData.data.sort((a, b) => {
          const aViewIndex = viewedEventsOrder.indexOf(a.id);
          const bViewIndex = viewedEventsOrder.indexOf(b.id);

          // If both events have been viewed, maintain their relative order
          if (aViewIndex !== -1 && bViewIndex !== -1) {
            return aViewIndex - bViewIndex;
          }

          // Viewed events come first
          if (aViewIndex !== -1) return -1;
          if (bViewIndex !== -1) return 1;

          // Then sort by likeCount and shareCount
          if (b.likeCount !== a.likeCount) {
            return (b.likeCount || 0) - (a.likeCount || 0);
          }

          return (b.shareCount || 0) - (a.shareCount || 0);
        });

        setEvents(sortedEvents);

        // Fetch categories
        const categoriesResponse = await fetch(`${apiUrl}/api/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!categoriesResponse.ok)
          throw new Error("Network response was not ok");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval
  }, [events.length]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      localStorage.setItem("cachedSearchQuery", searchQuery);
      navigate(`/event-list?query=${searchQuery}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/event-list?category=${categoryId}`);
  };

  // Add this function to the EventCard component or pass it as a prop
  const handleEventView = (eventId) => {
    const viewedEventsOrder = JSON.parse(
      localStorage.getItem("viewedEventsOrder") || "[]"
    );

    // Remove the event if it already exists to avoid duplicates
    const filteredOrder = viewedEventsOrder.filter((id) => id !== eventId);

    // Add the event to the beginning of the array
    filteredOrder.unshift(eventId);

    // Limit to last 10 viewed events to prevent infinite growth
    const updatedOrder = filteredOrder.slice(0, 10);

    localStorage.setItem("viewedEventsOrder", JSON.stringify(updatedOrder));
  };

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        {/* ... (previous navbar code remains the same) ... */}
      </nav>

      {/* Carousel Section */}
      <div className={styles.gridContainer}>
        {/* ... (previous carousel code remains the same) ... */}
      </div>

      {/* Event Cards */}
      <div className={styles.cardContainer}>
        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          events.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              onView={() => handleEventView(event.id)}
            />
          ))
        ) : (
          <p>No events available at the moment.</p>
        )}
      </div>
    </>
  );
}
