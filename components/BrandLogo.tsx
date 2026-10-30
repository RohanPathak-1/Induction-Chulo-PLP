import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Link href="/" className="focus-ring block shrink-0 rounded-lg" aria-label="VoltMart Nepal home">
      <Image
        src="/brand/voltmart-nepal-logo.png"
        alt="VoltMart Nepal — Smart Cooking"
        width={297}
        height={89}
        priority={priority}
        className="h-auto w-[158px] sm:w-[190px]"
      />
    </Link>
  );
}
