"use client";

import { useMemo } from "react";
import { CampaignReport } from "@/lib/api";

interface Props {
  campaigns: CampaignReport[];
}

export function MetricsBar({ campaigns }: Props) {
  // useMemo here because these aggregations run on every render.
  // If the parent re-renders for unrelated reasons, we don't recompute.
  const metrics = useMemo(() => {
    const totalImpressions = campaigns.reduce((sum, c) => sum + Number(c.impressions), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + Number(c.clicks), 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + Number(c.spend), 0);
    const avgCtr = totalImpressions > 0
      ? (totalClicks / totalImpressions) * 100
      : 0;

    return { totalImpressions, totalClicks, totalSpend, avgCtr };
  }, [campaigns]);

  return (
    <div style={styles.bar}>
      <Metric label="Impressions" value={metrics.totalImpressions.toLocaleString()} />
      <Metric label="Clicks" value={metrics.totalClicks.toLocaleString()} />
      <Metric label="Spend" value={`$${metrics.totalSpend.toFixed(2)}`} />
      <Metric label="Avg CTR" value={`${metrics.avgCtr.toFixed(2)}%`} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.metric}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}

const styles = {
  bar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1px",
    background: "#2a2a2a",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  metric: {
    background: "#1a1a1a",
    padding: "20px 24px",
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
};
