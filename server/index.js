import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import demoRoutes from "./routes/demo.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import businessRoutes from "./routes/business.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import centersRoutes from "./routes/centers.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import contentsRoutes from "./routes/contents.routes.js";
import studentRoutes from "./routes/student.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";
import templatesRoutes from "./routes/templates.routes.js";
import adminRoutes from "./routes/admin.routes.js";

export function createServer() {
  const app = express();
  const port = process.env.PORT || 3001;

  // Connect to MongoDB
  connectDB();

  app.use(cors());
  // Handle CORS preflight requests globally (Express 5 + path-to-regexp v6)
  app.options(/.*/, cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Temporary request logger (debug 404s)
  app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.use("/api/demo", demoRoutes);

  // Auth routes
  app.use("/api/auth", authRoutes);

  // Content routes (Creator only)
  app.use("/api/content", contentRoutes);

  // Business routes
  app.use("/api/businesses", businessRoutes);

  // Sales routes (Creator only)
  app.use("/api/sales", salesRoutes);

  // Centers API routes
  app.use("/api/centers", centersRoutes);

  // Payment API routes
  app.use("/api/payment", paymentRoutes);

  // Catalog
  app.use("/api/contents", contentsRoutes);

  // Student checkout and enrollments
  app.use("/api/student", studentRoutes);

  // Pricing management routes
  app.use("/api/pricing", pricingRoutes);
  
  // Templates selection routes
  app.use("/api/templates", templatesRoutes);
  
  // Admin routes
  app.use("/api/admin", adminRoutes);
  
  // Global error handler (handle multer and other runtime errors)
  app.use((err, _req, res, _next) => {
    console.error('[ERR]', err);
    // Multer errors or our fileFilter error message
    if (err?.name === 'MulterError' || (typeof err?.message === 'string' && err.message.toLowerCase().includes('invalid file type'))) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  });

  // 404 handler (debugging)
  app.use((req, res) => {
    console.warn(`[404] ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Not Found', path: req.url, method: req.method });
  });

  return app;
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const port = process.env.PORT || 3001;
  
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
