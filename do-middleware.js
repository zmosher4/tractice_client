module.exports = function middleware(req, res, next) {
  // Skip for API requests or actual files
  if (req.url.includes('.') || req.url.startsWith('/api/')) {
    return next();
  }

  // Rewrite all other requests to index.html
  req.url = '/index.html';
  next();
};
