"use client";

import { CampaignReport } from "@/lib/api";

interface Props {
  campaigns: CampaignReport[];
}

export function CampaignTable({ campaigns }: Props) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <Th>Campaign ID</Th>
            <Th>Impressions</Th>
            <Th>Clicks</Th>
            <Th>Spend</Th>
            <Th>CTR</Th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.campaign_id} style={styles.row}>
              <td style={styles.td}>{c.campaign_id}</td>
              <td style={styles.td}>{Number(c.impressions).toLocaleString()}</td>
              <td style={styles.td}>{Number(c.clicks).toLocaleString()}</td>
              <td style={styles.td}>${Number(c.spend).toFixed(2)}</td>
              <td style={{ ...styles.td, color: ctrColor(Number(c.ctr)) }}>
                {Number(c.ctr).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={styles.th}>{children}</th>;
}

function ctrColor(ctr: number): string {
  if (ctr >= 5) return "#4ade80";   // green
  if (ctr >= 2) return "#facc15";   // yellow
  return "#f87171";                  // red
}

const styles = {
  wrapper: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#666",
    borderBottom: "1px solid #2a2a2a",
  },
  td: {
    padding: "12px 16px",
    color: "#e0e0e0",
    borderBottom: "1px solid #1f1f1f",
  },
  row: {},
};
