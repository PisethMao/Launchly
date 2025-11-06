import HeroSection from "@/components/hero_section/HeroSection";
import DeploymentPreview from "@/components/home/DeploymntPreview";
import HighLight from "@/components/home/HighLight";
import HowItWorks from "@/components/home/HowItWorks";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import TargetUsersSection from "@/components/landing/TargetUsersSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <HowItWorks />
      <HighLight />
      <BeforeAfterSection />
      <TargetUsersSection />
      <TestimonialsSection />
      <DeploymentPreview />
    </main>
  );
}
