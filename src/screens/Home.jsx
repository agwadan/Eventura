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

        // Sort events by likeCount and shareCount
        const sortedEvents = eventsData.data.sort((a, b) => {
          // First, compare likeCount
          if (b.likeCount !== a.likeCount) {
            return (b.likeCount || 0) - (a.likeCount || 0);
          }

          // If likeCount is the same, compare shareCount
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

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.brandName}>Eventura</h1>
          <div className={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search events..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={styles.seeMore}>
              {menuOpen ? "See Less" : "See More"}
            </span>
          </div>
        </div>
        {menuOpen && (
          <div className={styles.dropdownMenu}>
            {categories.map((category) => (
              <a
                key={category.id}
                onClick={() => handleCategoryClick(category.documentId)} // Corrected category ID
                style={{ cursor: "pointer" }}
              >
                {category.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Carousel Section */}
      <div className={styles.gridContainer}>
        <div className={styles.imageContainer}>
          <div
            className={styles.imageWrapper}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event, index) => (
              <div key={index} className={styles.imageSlide}>
                <img
                  src={`${apiUrl}${event?.flyers[0]?.url}`}
                  alt={event.name}
                  className={styles.carouselImage}
                />
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
            </>
          )}
        </div>
      </div>

      {/* Event Cards */}
      <div className={styles.cardContainer}>
        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          events.map((event, index) => <EventCard key={index} event={event} />)
        ) : (
          <p>No events available at the moment.</p>
        )}
      </div>
    </>
  );
}
