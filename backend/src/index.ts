import "dotenv/config";
import 'reflect-metadata'; // Required for typedi
import "./core/di/register.js";
import express from 'express';
import { registerDependencies } from './infrastructure/di/container';
import { prisma } from './infrastructure/database';
import orderRoutes from './modules/order/infrastructure/order.routes';



const app = express();

app.use(express.json());

// Register all dependencies
registerDependencies();

// Register routes
app.use('/api/orders', orderRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;

console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});