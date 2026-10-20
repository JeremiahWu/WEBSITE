import "./home.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AppDownload from "@/components/AppDownload";
import Values from "@/components/Values";
import Goals from "@/components/Goals";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
      <Hero />
      <Services />
      <AppDownload />
      <Values />
      <Goals />
      <About />
      </main>
      <Footer />
    </div>
  );
}
