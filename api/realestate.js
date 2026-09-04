export default async function handler(req, res) {
  const { lawdCd, dealYmd } = req.query;

  // ▼▼▼ 추가: 클라이언트 검증만 믿지 말고 서버에서도 확인 ▼▼▼
  if (!/^\d{5}$/.test(lawdCd || "")) {
    return res.status(400).json({ error: 'lawdCd는 5자리 숫자여야 합니다.' });
  }
  if (!/^\d{6}$/.test(dealYmd || "")) {
    return res.status(400).json({ error: 'dealYmd는 YYYYMM 6자리 숫자여야 합니다.' });
  }
  // ▲▲▲ 추가 끝 ▲▲▲

  const serviceKey = process.env.PUBLIC_DATA_API_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=100&pageNo=1`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // ▼▼▼ 추가: 같은 조합으로 반복 조회 시 공공데이터 API 호출 절감 (10분 캐시) ▼▼▼
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    // ▲▲▲ 추가 끝 ▲▲▲
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: '공공데이터 API 호출 실패', detail: String(err) });
  }
}
