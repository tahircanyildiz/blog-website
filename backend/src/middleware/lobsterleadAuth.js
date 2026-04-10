/**
 * LobsterLead API Key Authentication Middleware
 * X-API-KEY header'ı ile gelen istekleri doğrular
 */
const lobsterleadAuth = (req, res, next) => {
  const validApiKey = process.env.LOBSTERLEAD_API_KEY;

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
