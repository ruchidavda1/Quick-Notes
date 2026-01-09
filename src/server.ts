import express, { Application } from 'express';
import { logger } from './middleware/logger';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import healthRoutes from './routes/health';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quick Notes API running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints:`);
  console.log(`   POST   /auth/mock-login`);
  console.log(`   POST   /notes`);
  console.log(`   GET    /notes`);
  console.log(`   PATCH  /notes/:id`);
  console.log(`   DELETE /notes/:id`);
  console.log(`   GET    /health`);
});

export default app;

