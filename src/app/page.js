import Image from "next/image";
import styles from "./page.module.css";
import EventDetail from "./event-detail/page";

export default function Home() {
  return (
    <>
      <h1>Eventura</h1>
      <EventDetail/>
    </>
  );
}
