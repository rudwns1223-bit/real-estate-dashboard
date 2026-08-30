export default async function handler(req, res) {
  const { lawdCd, dealYmd } = req.query;
  const serviceKey = process.env.PUBLIC_DATA_API_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=100&pageNo=1`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: '공공데이터 API 호출 실패', detail: String(err) });
  }
}
