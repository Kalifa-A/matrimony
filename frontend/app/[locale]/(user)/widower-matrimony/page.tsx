import { Metadata } from "next";
import SeoLanding from "@/app/components/SeoLanding";
import { getSeoData } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getSeoData("widower_matrimony");
  if (!data) return {};
  return {
    title: data.seo_title,
    description: data.seo_description,
    keywords: data.seo_keywords,
    openGraph: {
      title: data.og_title,
      description: data.og_description,
    }
  };
}

export default async function WidowerMatrimonyPage() {
  return <SeoLanding pageKey="widower_matrimony" />;
}
