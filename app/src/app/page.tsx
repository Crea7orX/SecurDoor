import { LandingCallToActionSection } from "@/components/landing/landing-call-to-action-section";
import { LandingContactSection } from "@/components/landing/landing-contact-section";
import { LandingFeaturesSection } from "@/components/landing/landing-features-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingPricingSection } from "@/components/landing/landing-pricing-section";
import { LandingTestimonialsSection } from "@/components/landing/landing-testimonials-section";

export default function LandingPage() {
  return (
    <div className="relative w-full">
      <LandingNavbar />
      <main>
        <LandingHeroSection />
        <LandingFeaturesSection />
        <LandingTestimonialsSection />
        <LandingPricingSection />
        <LandingCallToActionSection />
        <LandingContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
