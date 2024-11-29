import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Using react-router for route handling
import EventCard from "../../components/EventCard"; // Ensure correct path to EventCard
import styles from "./page.module.css";
import qs from "qs";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Add state to track categoryId

  const apiUrl = "http://192.168.100.39:1337";
  const location = useLocation(); // Hook to access the current location (URL)
  const navigate = useNavigate(); // Hook for navigation

  // Extract search query and category ID from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const category = queryParams.get("category");

    console.log("Query:", query);
    console.log("Category ID:", category);
    // Set searchQuery and categoryId if present in the URL
    if (query) {
      setSearchQuery(query);
    }
    if (category) {
      setCategoryId(category); // Set categoryId if it's in the URL
    }

    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      try {
        // Construct the query string based on the presence of query or category filter
        const filters = {};
        if (query) {
          filters.$or = [
            { name: { $containsi: query } },
            { categories: { name: { $containsi: query } } },
          ];
        }
        if (category) {
          filters.categories = { documentId: { $eq: category } }; // Filter by category_id
        }

        const queryString = qs.stringify(
          {
            populate: ["flyers", "categories"], // Populate necessary relations
            filters,
          },
          { encodeValuesOnly: true } // Encode only the values
        );

        const response = await fetch(`${apiUrl}/api/events?${queryString}`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents(); // Fetch events based on the query or category filter
  }, [location.search, apiUrl]);

  return (
    <div className={styles.pageContainer}>
      <h1>
        {searchQuery
          ? `Search results for: ${searchQuery}`
          : categoryId
          ? `Events selected category`
          : "All events"}
      </h1>

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
  );
}
