import "./home.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AppDownload from "@/components/AppDownload";
import Blog from "@/components/Blog";
import GitHub from "@/components/GitHub";
import Values from "@/components/Values";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
      <Hero />
      <Services />
      <AppDownload />
      <GitHub />
      <Blog />
      <Values />
      </main>
      <Footer />
    </div>
  );
}
