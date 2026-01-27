/**
 * LobsterLead API Key Authentication Middleware
 * X-API-KEY header'ı ile gelen istekleri doğrular
 */
const lobsterleadAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.LOBSTERLEAD_API_KEY;

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
