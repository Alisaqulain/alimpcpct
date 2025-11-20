import "./globals.css";
import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import LayoutWrapper from "./components/LayoutWrapper";
import { defaultMetadata } from "../lib/metadata";
import { OrganizationSchema, WebSiteSchema, ServiceSchema } from "./components/SEO/StructuredData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap", // Optimize font loading
});

// Export metadata for SEO
export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mpcpct.com';
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#290c52" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo2.png" />
        
        {/* Structured Data for SEO */}
        <OrganizationSchema siteUrl={siteUrl} />
        <WebSiteSchema siteUrl={siteUrl} />
        <ServiceSchema siteUrl={siteUrl} />
        
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased ${poppins.className}`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
