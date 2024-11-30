const errorHandler = (err, req, res, next) => {
  console.error(err.message || "Server Error");
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
};

module.exports = errorHandler;
