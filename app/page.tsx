import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyWeb from "./components/WhyWeb";
import Specialties from "./components/Specialties";
import Plans from "./components/Plans";
import Portfolio from "./components/Portfolio";
import HowWeWork from "./components/HowWeWork";
import FAQ from "./components/FAQ";
import CTAClose from "./components/CTAClose";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <WhyWeb />
        <Specialties />
        <Plans />
        <Portfolio />
        <HowWeWork />
        <FAQ />
        <CTAClose />
      </main>
      <Footer />
    </>
  );
}
