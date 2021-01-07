const { getReasonPhrase } = require('http-status-codes');

class Response {
  constructor(statusCode, message, data) {
    this.error = statusCode >= 400;
    this.statusCode = statusCode;
    this.reason = getReasonPhrase(statusCode);
    this.message = message instanceof Error ? message.message : message;
    this.data = data !== undefined && data !== null ? data : {};
  }
}

module.exports = Response;
