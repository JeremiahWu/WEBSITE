import '../home.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppDownload from '@/components/AppDownload';

export const metadata = { title: '应用下载 · 老吴咖啡实验室' };

export default function DownloadPage() {
  return <div className="home-page"><Navbar /><main><AppDownload /></main><Footer /></div>;
}
