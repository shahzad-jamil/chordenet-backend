import rateLimit from "express-rate-limit";

const limiterMiddleware = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.ip;
    res.status(429).json({
      status: 429,
      error: "Too many requests",
      message: "Too many requests, please try again later.",
    });
  },
});

export default limiterMiddleware;
