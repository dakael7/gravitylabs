import Image from "next/image";

export default function BrandLogo({ size }: { size: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20"
      style={{
        width: size,
        height: size,
        background: "#fff",
        boxShadow: "0 0 12px rgba(84,217,255,0.18)",
      }}
    >
      <Image
        src="/images/res/logo_gl.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className="absolute z-10 max-w-none object-contain"
        style={{
          width: size * 1.35,
          height: size * 1.35,
          filter:
            "brightness(1.12) saturate(1.3) drop-shadow(0 0 3px rgba(84,217,255,0.4))",
        }}
      />
    </span>
  );
}
