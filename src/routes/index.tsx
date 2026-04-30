import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyCustomWorks } from "@/components/home/WhyCustomWorks";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CustomWorks — Crafted with intent. Made just for you." },
      {
        name: "description",
        content:
          "Premium made-to-order apparel, accessories, and corporate gifts, crafted in India and shipped in days. Discover the CustomWorks collection.",
      },
    ],
  }),
});

function Home() {
  return (
    <Layout>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyCustomWorks />
      <HowItWorks />
      <Testimonials />
      <NewsletterBanner />
    </Layout>
  );
}
