import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

function EventDetail() {
  return (
    <div className={styles.eventDetailContainer}>
      <div className={styles.imageSection}>
        <Image    
          src="/images/beach.jpg" 
          alt="Event-poster"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={styles.detailsSection}>
        <h1 className={`${styles.eventName} eventura`}>Malibu Beach Party</h1>
        
        <div className={styles.eventInfo}>
          <div className={styles.infoItem}>
            <label>Venue: Nabinoonya Beach</label>
          </div>

          <div className={styles.infoItem}>
            <label>Fee: UGX. 5000</label>
          </div>

          <div className={styles.infoItem}>
            <p>Date: 27th November, 2022</p>
          </div>

          <div className={styles.infoItem}>
            <label>Time: 5pm till late</label>
          </div>

          <div className={styles.infoItem}>
            <p>Category: Beach</p><br/>
            <p>Click <strong>Pay here</strong> to get  a 20% discount</p>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.interestedBtn}>
            Interested
          </button>
          
          <button className={styles.getCodeBtn}>
            Pay here
          </button>
           
        </div>
      </div>
    </div>
  );
}

export default EventDetail;