import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <path
            d="M50 20 C65 20 75 35 75 50 C75 65 65 80 50 80 C35 80 25 65 25 50 C25 35 35 20 50 20Z"
            fill="#3b82f6"
          />
          {/* Top Claw */}
          <path
            d="M70 30 C85 15 95 30 85 45 L75 40"
            fill="#60a5fa"
          />
          {/* Bottom Claw */}
          <path
            d="M70 70 C85 85 95 70 85 55 L75 60"
            fill="#fb923c"
          />
          {/* Tail */}
          <path
            d="M25 50 L10 40 L15 50 L10 60 Z"
            fill="#3b82f6"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
