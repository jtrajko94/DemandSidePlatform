"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCampaignReports } from "@/lib/api";
import { MetricsBar } from "@/components/MetricsBar";
import { CampaignTable } from "@/components/CampaignTable";

export default function Dashboard() {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaignReports,
    refetchInterval: 5000,
  });

  const campaigns = data ?? [];
  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>DSP Dashboard</h1>
        {lastUpdated && (
          <span style={styles.updated}>Last updated: {lastUpdated}</span>
        )}
      </div>

      {isError && <div style={styles.error}>Failed to load data</div>}
      {isLoading && <div style={styles.muted}>Loading...</div>}

      {campaigns.length > 0 && (
        <>
          <MetricsBar campaigns={campaigns} />
          <CampaignTable campaigns={campaigns} />
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    margin: 0,
  },
  updated: {
    fontSize: 12,
    color: "#555",
  },
  error: {
    color: "#f87171",
    padding: 16,
  },
  muted: {
    color: "#555",
    padding: 16,
  },
};
