/**
 * LobsterLead API Key Authentication Middleware
 * X-API-KEY header'ı, Authorization: Bearer, veya ?apiKey= query param'ı ile gelen istekleri doğrular
 */
const lobsterleadAuth = (req, res, next) => {
  const validApiKey = process.env.LOBSTERLEAD_API_KEY;

  // GEÇİCİ DEBUG LOG — gelen key'i (varsa) ve kaynağını görmek için
  console.log('[lobsterlead-debug] url:', req.originalUrl);
  console.log('[lobsterlead-debug] query:', JSON.stringify(req.query));
  console.log('[lobsterlead-debug] x-api-key header:', req.headers['x-api-key']);
  console.log('[lobsterlead-debug] authorization header:', req.headers['authorization']);
  console.log('[lobsterlead-debug] LOBSTERLEAD_API_KEY env is set:', !!validApiKey);

  // x-api-key header
  let apiKey = req.headers['x-api-key'];

  // Authorization: Bearer <key>
  if (!apiKey && req.headers['authorization']) {
    const auth = req.headers['authorization'];
    if (auth.startsWith('Bearer ')) {
      apiKey = auth.split(' ')[1];
    } else {
      apiKey = auth;
    }
  }

  // query param: ?apiKey=... (header göndermeyen entegrasyonlar için)
  if (!apiKey && req.query.apiKey) {
    apiKey = req.query.apiKey;
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API Key gerekli'
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz API Key'
    });
  }

  next();
};

module.exports = lobsterleadAuth;
