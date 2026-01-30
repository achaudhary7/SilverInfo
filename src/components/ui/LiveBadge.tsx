/**
 * LiveBadge Component
 *
 * A pulsing badge that indicates real-time data updates.
 * Shows last update time and updates dynamically.
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Pulsing green dot animation
 * - "LIVE" text with optional timestamp
 * - Compact and prominent variants
 * - Dark theme optimized
 */

"use client";

import { useState, useEffect } from "react";

interface LiveBadgeProps {
  /** Timestamp of last update (ISO string or Date) */
  lastUpdate?: string | Date;
  /** Visual variant */
  variant?: "default" | "compact" | "prominent";
  /** Show timestamp text */
  showTimestamp?: boolean;
  /** Custom className */
  className?: string;
}

export default function LiveBadge({
  lastUpdate,
  variant = "default",
  showTimestamp = true,
  className = "",
}: LiveBadgeProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [isRecent, setIsRecent] = useState(true);

  // Update time ago every second
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastUpdate) {
        setTimeAgo("just now");
        setIsRecent(true);
        return;
      }

      const updateTime = new Date(lastUpdate);
      const now = new Date();
      const diffMs = now.getTime() - updateTime.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 5) {
        setTimeAgo("just now");
        setIsRecent(true);
      } else if (diffSeconds < 60) {
        setTimeAgo(`${diffSeconds}s ago`);
        setIsRecent(diffSeconds < 30);
      } else if (diffSeconds < 3600) {
        const mins = Math.floor(diffSeconds / 60);
        setTimeAgo(`${mins}m ago`);
        setIsRecent(mins < 5);
      } else {
        const hours = Math.floor(diffSeconds / 3600);
        setTimeAgo(`${hours}h ago`);
        setIsRecent(false);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Variant styles
  const variantStyles = {
    default: {
      container: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30",
      dot: "w-2 h-2",
      text: "text-xs font-medium text-emerald-400",
      timestamp: "text-xs text-emerald-400/60",
    },
    compact: {
      container: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10",
      dot: "w-1.5 h-1.5",
      text: "text-[10px] font-medium text-emerald-400",
      timestamp: "text-[10px] text-emerald-400/60",
    },
    prominent: {
      container: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10",
      dot: "w-3 h-3",
      text: "text-sm font-semibold text-emerald-400",
      timestamp: "text-xs text-emerald-300/70 ml-1",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Pulsing dot */}
      <span className="relative flex">
        <span
          className={`${styles.dot} rounded-full ${
            isRecent ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        {isRecent && (
          <span
            className={`absolute ${styles.dot} rounded-full bg-emerald-400 animate-ping opacity-75`}
          />
        )}
      </span>

      {/* LIVE text */}
      <span className={styles.text}>LIVE</span>

      {/* Timestamp */}
      {showTimestamp && timeAgo && (
        <span className={styles.timestamp}>• {timeAgo}</span>
      )}
    </div>
  );
}

/**
 * Inline version for use in headers/titles
 */
export function LiveBadgeInline({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="relative flex">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
      </span>
      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
        Live
      </span>
    </span>
  );
}
