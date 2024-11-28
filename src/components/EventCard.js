import Image from "next/image";
import styles from "./EventCard.module.css";
import Link from "next/link";

const EventCard = ({ event }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    </div>
  );
};

export default EventCard;
