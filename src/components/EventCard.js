import Image from "next/image";
import styles from "./EventCard.module.css"; // Create a CSS module for the card styles

const EventCard = ({ event }) => {
  return (
    <div className={styles.card}>
      <Image
        src={event.image}
        alt={event.name}
        width={200}
        height={200}
        objectFit="cover"
      />
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
