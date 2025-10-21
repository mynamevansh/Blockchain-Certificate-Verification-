const app = require('../server/server.js');

module.exports = async (req, res) => {
  console.log(`[Vercel Function] ${req.method} ${req.url}`);
  console.log('[Vercel Function] Headers:', req.headers);
  
  return app(req, res);
};
