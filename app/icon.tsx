import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1A1A1A',
          color: '#FAF7F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 22,
          fontWeight: 500,
          fontStyle: 'italic',
        }}
      >
        l
      </div>
    ),
    { ...size }
  );
}
