import Image from "next/image";

export default function BrandLogo({ variant = "nav", decorative = false }: { variant?: "nav" | "footer" | "hero"; decorative?: boolean }) {
  return (
    <Image
      src="/images/laowu-cafe-logo-448.png"
      alt={decorative ? "" : "老吴咖啡实验室 LAOWU-CAFE Labs"}
      width={448}
      height={252}
      sizes={variant === "hero" ? "(max-width: 700px) 190px, 260px" : variant === "footer" ? "180px" : "(max-width: 700px) 104px, 124px"}
      priority={variant === "nav"}
      className={`brand-logo brand-logo-${variant}`}
    />
  );
}
