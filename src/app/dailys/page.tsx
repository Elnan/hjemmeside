"use client";

import { useUser } from "@clerk/nextjs";
import styles from "./page.module.css";
import { DailyGamesContainer } from "@/components/dailys/DailyGamesContainer";

export default function DailysPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.signInState}>
          Please sign in to access daily games
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DailyGamesContainer />
    </div>
  );
}
