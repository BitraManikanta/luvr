import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Luvr – Where Love Lives';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF85A1 0%, #C084FC 60%, #818CF8 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 32,
            padding: '48px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.3)',
          }}
        >
          {/* Icon */}
          <div style={{ fontSize: 80 }}>💌</div>

          {/* App name */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            Luvr
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Where love lives, grows, and shines. 💕
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {['🔒 Encrypted', '🎮 Couple Games', '🌸 Beautiful Themes'].map((badge) => (
              <div
                key={badge}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 50,
                  padding: '8px 20px',
                  fontSize: 20,
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Developer credit */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 48,
            fontSize: 18,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          Developed by BITRA MANIKANTA
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
