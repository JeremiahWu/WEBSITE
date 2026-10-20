import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../home.css";

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <div className="home-page"><Navbar /><main>{children}</main><Footer /></div>;
}
