export class ApiError extends Error {
  constructor(message, { payload, status, url } = {}) {
    super(message);
    this.name = "ApiError";
    this.payload = payload;
    this.status = status;
    this.url = url;
  }
}
