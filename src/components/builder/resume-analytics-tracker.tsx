"use client";

import { useEffect, useRef } from "react";

export function ResumeAnalyticsTracker({ resumeId }: { resumeId: string }) {
  const isRecorded = useRef(false);

  useEffect(() => {
    if (isRecorded.current) return;

    // Track page view load
    const startTime = Date.now();
    isRecorded.current = true;

    // Try to get geolocation approximations
    let location = "Unknown";
    try {
      location = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      // Ignore error and fall back to "Unknown"
    }

    // When the component unmounts (user leaves), we record the analytics
    return () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      // We use a small blob trick to send the data on unload using sendBeacon or fetch keepalive
      const data = {
        resumeId,
        location,
        durationSeconds,
      };

      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/analytics/resume-view", blob);
    };
  }, [resumeId]);

  return null;
}
