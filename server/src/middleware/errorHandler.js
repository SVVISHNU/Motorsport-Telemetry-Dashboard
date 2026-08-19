module.exports = function (err, req, res, next) {
  console.error('[Error Handler]', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};
