import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DSP Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "monospace", background: "#0f0f0f", color: "#e0e0e0" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
