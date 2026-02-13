import { EcosystemBenefitsSection } from "@/components/landing/ecosystem-benefits";
import { FinalCtaSection } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { RuntimeProofSection } from "@/components/landing/runtime-proof";
import { UseCasesSection } from "@/components/landing/use-cases";

export default function IndexPage() {
  return (
    <>
      <HeroSection />
      <RuntimeProofSection />
      <HowItWorksSection />
      <EcosystemBenefitsSection />
      <UseCasesSection />
      <FinalCtaSection />
    </>
  );
}
