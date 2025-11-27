// pages/api/og.js
// 동적 OG 이미지 생성

export default function handler(req, res) {
  const { title = '보담' } = req.query;

  // SVG를 반환
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#EFF6FF"/>
          <stop offset="100%" style="stop-color:#FFFFFF"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>

      <!-- Logo -->
      <rect x="520" y="150" width="160" height="160" rx="40" fill="#3B82F6"/>
      <text x="600" y="260" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">보</text>

      <!-- Site name -->
      <text x="600" y="380" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#111827" text-anchor="middle">보담</text>

      <!-- Subtitle -->
      <text x="600" y="440" font-family="Arial, sans-serif" font-size="24" fill="#6B7280" text-anchor="middle">손해사정사의 보험 이야기</text>

      <!-- Tagline -->
      <text x="600" y="520" font-family="Arial, sans-serif" font-size="20" fill="#3B82F6" text-anchor="middle">보험사가 알려주지 않는 보험금 청구의 모든 것</text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(svg);
}
