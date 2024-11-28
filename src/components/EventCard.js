import Image from "next/image";
import styles from "./EventCard.module.css";
import Link from "next/link";

// Helper function to generate a random rank
const getRandomRank = () => {
  const ranks = ["bronze", "silver", "gold"];
  const randomIndex = Math.floor(Math.random() * ranks.length);
  return ranks[randomIndex];
};

const EventCard = ({ event }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Generate a random rank for the badge
  const badgeType = getRandomRank();

  // Badge styles for each rank
  const badgeStyles = {
    bronze: styles.bronzeBadge,
    silver: styles.silverBadge,
    gold: styles.goldBadge,
  };

  return (
    <div className={styles.card}>
      <Link href={`/event-detail?eventId=${event.documentId}`}>
        <Image
          src={`${apiUrl}${event?.flyers[0].url}`}
          alt={event.name}
          width={200}
          height={200}
          objectFit="cover"
        />
      </Link>
      <h2 style={{ fontSize: 16, margin: 12, alignItems: "center" }}>
        {event.name}
      </h2>
      <p style={{ fontSize: 12, alignItems: "flex-start", marginBottom: 8 }}>
        {event.category}
      </p>

      {/* Add badge with the random rank */}
      {badgeType && (
        <div className={`${styles.badge} ${badgeStyles[badgeType]}`}>
          {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}
        </div>
      )}
    </div>
  );
};

export default EventCard;
