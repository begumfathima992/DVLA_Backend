export const createRateLimiter = ({ windowMs, max, message }) => {
  const buckets = new Map();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of buckets) if (value.resetAt <= now) buckets.delete(key);
  }, Math.min(windowMs, 60000));
  cleanup.unref?.();

  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}:${req.path}`;
    const now = Date.now();
    const current = buckets.get(key);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    buckets.set(key, bucket);

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(0, max - bucket.count));
    res.setHeader("RateLimit-Reset", Math.ceil(bucket.resetAt / 1000));

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message,
        error: message,
        code: "TOO_MANY_REQUESTS",
        requestId: req.id,
      });
    }
    return next();
  };
};
