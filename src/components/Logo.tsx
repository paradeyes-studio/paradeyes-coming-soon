type LogoProps = {
  size?: number;
};

export default function Logo({ size = 80 }: LogoProps) {
  const width = size * 2;
  const height = size;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Paradeyes"
      role="img"
    >
      <path
        d="M4 50 C 40 10, 160 10, 196 50 C 160 90, 40 90, 4 50 Z"
        stroke="#57EEA1"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M100 30 L103 50 L100 70 L97 50 Z"
        fill="#57EEA1"
      />
      <path
        d="M70 50 L97 47 L130 50 L97 53 Z"
        fill="#57EEA1"
      />
    </svg>
  );
}
