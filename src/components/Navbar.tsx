"use client";
import { useState } from "react";
const links = [
  { href: "#services", label: "研究方向" },
  { href: "#download", label: "应用下载" },
  { href: "#values", label: "价值观" },
  { href: "#goals", label: "目标" },
  { href: "#about", label: "关于老吴" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="home-nav">
      <div className="home-nav-inner"><a href="#hero" className="home-brand" onClick={() => setOpen(false)}>LABSOFT<span>老吴咖啡实验室</span></a>
        <nav className="home-desktop-nav" aria-label="主导航">{links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
        <button type="button" className="home-menu-toggle" aria-label={open ? "关闭导航" : "打开导航"} aria-expanded={open} aria-controls="home-mobile-nav" onClick={() => setOpen(!open)}>{open ? "关闭 −" : "菜单 +"}</button>
      </div>
      {open && <nav id="home-mobile-nav" className="home-mobile-nav" aria-label="移动端导航">{links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}<span aria-hidden="true">↗</span></a>)}</nav>}
    </header>
  );
}
