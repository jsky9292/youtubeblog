// pages/api/revalidate.js
// On-demand ISR 재검증 API

export default async function handler(req, res) {
  // 내부 호출 또는 특정 토큰으로만 허용 (보안)
  const { path, secret } = req.query;

  // 개발 환경에서는 secret 검증 생략
  if (process.env.NODE_ENV === 'production' && secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // 특정 경로 또는 홈페이지 재검증
    const pathToRevalidate = path || '/';
    await res.revalidate(pathToRevalidate);

    console.log(`[Revalidate] 페이지 재검증 완료: ${pathToRevalidate}`);

    return res.json({
      revalidated: true,
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Revalidate] 재검증 실패:', err);
    return res.status(500).json({
      message: 'Error revalidating',
      error: err.message
    });
  }
}
