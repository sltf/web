import React from "react";
import styles from "../style/searchStyle.module.css";

export default function NotFound() {
  return (
    <div className={styles.centerMessage}>
      <h2>404 - Not Found</h2>
      <p>The URL you requested is not available in this site</p>
    </div>
  );
}
