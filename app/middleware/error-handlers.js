/* eslint-disable semi */

// 404 Handler
function notFound() {
  console.error("Route Not Found")
  const err = new Error('Route Not Found')
  err.status = 404
  throw err
}

function errorHandler (err, req, res) {

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};


module.exports = {
  notFound, errorHandler
}
