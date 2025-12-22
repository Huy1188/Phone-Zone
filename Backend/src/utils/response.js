export const ok = (res, data = null, meta = null, message = null) =>
  res.json({ success: true, data, meta, message });

export const fail = (res, status = 400, message = "Bad Request", errors = null) =>
  res.status(status).json({ success: false, message, errors });
