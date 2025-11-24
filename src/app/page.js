  import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import HomePageClient from "./components/HomePageClient";
import { FAQSchema } from "./components/SEO/StructuredData";
import { homePageFAQs } from "./components/SEO/FAQData";

export const metadata = pageMetadata.home;

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mpcpct.com';
  
  return (
    <>
      {/* FAQ Structured Data */}
      <FAQSchema faqs={homePageFAQs} />
      
      {/* Main Content */}
      <HomePageClient />
    </>
  );
}
