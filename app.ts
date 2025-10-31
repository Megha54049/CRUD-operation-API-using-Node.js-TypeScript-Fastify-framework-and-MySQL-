import Fastify, { FastifyInstance } from 'fastify';
import { initializeDatabase } from './config/data';
import { bookRoutes } from './routes/Routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app: FastifyInstance = Fastify({
  logger: true
});

const PORT = parseInt(process.env.PORT || '3000');

// Register routes
app.register(bookRoutes, { prefix: '/api/books' });

// Health check route
app.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    message: 'Book CRUD API is running',
    timestamp: new Date().toISOString()
  };
});

// 404 handler
app.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Books API: http://localhost:${PORT}/api/books`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await app.close();
  process.exit(0);
});