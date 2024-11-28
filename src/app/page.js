"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import styles from "./page.module.css";
import EventCard from "../components/EventCard";
import Image from "next/image";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter(); // Initialize useRouter

  // Load cached search query from localStorage
  useEffect(() => {
    const cachedQuery = localStorage.getItem("cachedSearchQuery");
    if (cachedQuery) {
      setSearchQuery(cachedQuery); // Pre-fill search query with cached value
    }

    // Fetch events after setting initial state
    const fetchEvents = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${apiUrl}/api/events?populate=flyers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEvents(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${apiUrl}/api/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("====================================");
        console.log(data);
        console.log("====================================");
        setCategories(data.data); // Set the categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const nextEvent = () => setCurrentIndex((prev) => (prev + 1) % events.length);

  useEffect(() => {
    const interval = setInterval(nextEvent, 5000);
    return () => clearInterval(interval);
  }, [events.length]);

  const handleSearchSubmit = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Cache the search query in localStorage
      localStorage.setItem("cachedSearchQuery", searchQuery);

      // Navigate to the search results page
      router.push(`/event-list?query=${searchQuery}`);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.brandName}>Eventura</h1>

          {/* Search Bar */}
          <div className={styles.searchBarContainer}>
            <input
              type="text"
              placeholder="Search events..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit} // Trigger on Enter key
            />
          </div>

          {/* Toggle menu to "See More" when the menu is open */}
          <div
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <span className={styles.seeMore}>See Less</span> // Display "See Less" when open
            ) : (
              <span className={styles.seeMore}>See More</span> // Display "See More" when closed
            )}
          </div>
        </div>

        {menuOpen && (
          <div className={styles.dropdownMenu}>
            {/* Map through the categories and display them */}
            {categories.map((category) => (
              <a
                key={category.id}
                onClick={() => handleCategoryClick(category.documentId)}
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
                <Link href={`/event-detail?eventId=${event.documentId}`}>
                  <Image
                    src={`${apiUrl}${event.flyers[0]?.url}`}
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
            </>
          )}
        </div>
      </div>

      {/* Event Cards */}
      <div className={styles.cardContainer}>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </>
  );
}
