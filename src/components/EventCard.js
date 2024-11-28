import Image from "next/image";
import styles from "./EventCard.module.css";
import Link from "next/link";

const EventCard = ({ event }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("====================================");
  console.log(event);
  console.log("====================================");

  // Determine badge type based on event rank
  let badgeType;
  if (event.rank === "GOLD") badgeType = "gold";
  else if (event.rank === "SILVER") badgeType = "silver";
  else if (event.rank === "PLATINUM") badgeType = "platinum";
  else badgeType = null;

  return (
    <div className={styles.card}>
      <Link href={`/event-detail?eventId=${event.documentId}`}>
        <div className={styles.imageContainer}>
          <Image
            src={`${apiUrl}${event?.flyers[0].url}`}
            alt={event.name}
            width={200}
            height={200}
            objectFit="cover"
          />
          {badgeType && (
            <div className={`${styles.badge} ${styles[badgeType]}`}>
              {badgeType}
            </div>
          )}
        </div>
      </Link>
      <div className={styles.titleContainer}>
        <h2 style={{ fontSize: 16, margin: 12, alignItems: "center" }}>
          {event.name}
        </h2>
      </div>
      <p style={{ fontSize: 12, alignItems: "flex-start", marginBottom: 8 }}>
        {event.category}
      </p>
    </div>
  );
};

export default EventCard;
