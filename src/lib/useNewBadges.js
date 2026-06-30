import { useEffect, useState } from "react";

const STORAGE_KEY = "damulink_seen_badges";

function readSeenBadges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSeenBadges(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — badge "new" state just won't persist, not fatal
  }
}

/**
 * Given the donor's current badge list, returns which ones are "new"
 * (earned since the last time the dashboard recorded what's been seen),
 * and marks them as seen after a short delay so the pulse has time to
 * actually play before it's marked off.
 */
export function useNewBadges(badges) {
  const [newBadgeNames, setNewBadgeNames] = useState([]);

  useEffect(() => {
    if (!badges || badges.length === 0) return;

    const seen = readSeenBadges();
    const currentNames = badges.map((b) => b.badge);
    const unseen = currentNames.filter((name) => !seen.includes(name));

    if (unseen.length > 0) {
      setNewBadgeNames(unseen);
      const timeout = setTimeout(() => {
        writeSeenBadges([...seen, ...unseen]);
      }, 2500); // let the pulse play before marking as seen
      return () => clearTimeout(timeout);
    }
  }, [badges]);

  return newBadgeNames;
}