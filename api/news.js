export default async function handler(req, res) {
  const { query } = req.query;

  // ▼▼▼ 추가: 쿼리/키 검증 ▼▼▼
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ error: 'query 파라미터가 필요합니다.' });
  }
  if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
    return res.status(500).json({ error: '네이버 API 키가 설정되지 않았습니다.' });
  }
  // ▲▲▲ 추가 끝 ▲▲▲

  try {
    const r = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=5&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      }
    );
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=120');
    res.status(r.status).json(data); // 네이버가 에러 내면 그 상태코드 그대로 전달
  } catch (err) {
    res.status(500).json({ error: '네이버 뉴스 API 호출 실패', detail: String(err) });
  }
}
