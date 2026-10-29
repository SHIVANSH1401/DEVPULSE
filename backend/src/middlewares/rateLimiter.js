import { AppError } from '../utils/AppError.js';

/**
 * In-Memory Sliding-Window Rate Limiter Middleware
 * Protects endpoints from abuse (e.g., invite spamming, brute-force creation)
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 60,000ms / 1 min)
 * @param {number} options.max - Max requests allowed per IP within the window (default: 30)
 * @param {string} options.message - Error message returned when rate limit exceeded
 */
export const rateLimiter = ({
  windowMs = 60 * 1000,
  max = 30,
  message = 'Too many requests from this IP, please try again after a minute.',
} = {}) => {
  const ipHits = new Map();

  return (req, res, next) => {
    // In test environment, bypass rate limiting
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const timestamps = ipHits.get(ip) || [];

    // Filter out timestamps older than the window
    const recentTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (recentTimestamps.length >= max) {
      return next(
        new AppError(
          message,
          429,
          'RATE_LIMIT_EXCEEDED',
          [
            {
              field: 'rateLimit',
              message: `Maximum of ${max} requests allowed per ${windowMs / 1000} seconds.`,
            },
          ]
        )
      );
    }

    recentTimestamps.push(now);
    ipHits.set(ip, recentTimestamps);

    // Periodic sweep to prevent unbounded memory growth
    if (ipHits.size > 5000) {
      for (const [key, times] of ipHits.entries()) {
        if (times.every((t) => now - t >= windowMs)) {
          ipHits.delete(key);
        }
      }
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recentTimestamps.length));

    next();
  };
};
