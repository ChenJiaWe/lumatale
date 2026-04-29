import { ImageResponse } from 'next/og';

export const alt = 'lumatale — Stories that read you back.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FAF7F0',
          color: '#1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 144,
            letterSpacing: '0.18em',
            fontWeight: 500,
            display: 'flex',
          }}
        >
          lumatale
        </div>
        <div
          style={{
            width: 380,
            height: 1,
            background: '#D9CFB8',
            marginTop: 8,
            marginBottom: 56,
          }}
        />
        <div
          style={{
            fontSize: 40,
            color: '#8B7E66',
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          Stories that read you back.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            fontSize: 22,
            color: '#A0998A',
            letterSpacing: '0.3em',
            display: 'flex',
          }}
        >
          VOLUME I &middot; 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
