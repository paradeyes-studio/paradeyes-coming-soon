import Image from "next/image";

type Size = "small" | "medium" | "large";

type ParadeyesLogoProps = {
  size?: Size;
  className?: string;
};

const SIZE_MAP: Record<Size, number> = {
  small: 180,
  medium: 220,
  large: 280,
};

export default function ParadeyesLogo({
  size = "small",
  className,
}: ParadeyesLogoProps) {
  const width = SIZE_MAP[size];
  const height = Math.round((width * 105) / 837);

  return (
    <Image
      src="/logos/paradeyes-logo.svg"
      alt="Paradeyes"
      width={width}
      height={height}
      priority
      className={`h-auto ${className ?? ""}`.trim()}
    />
  );
}
