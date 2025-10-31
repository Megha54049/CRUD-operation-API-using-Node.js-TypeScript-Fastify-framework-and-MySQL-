import { FastifyInstance } from 'fastify';
import { bookController } from '../controllers/Controller';

export async function bookRoutes(fastify: FastifyInstance) {
  // GET all books
  fastify.get('/', bookController.getAllBooks);

  // GET book by ID
  fastify.get('/:id', bookController.getBookById);

  // POST create new book
  fastify.post('/', bookController.createBook);

  // PUT update entire book
  fastify.put('/:id', bookController.updateBook);

  // PATCH partial update
  fastify.patch('/:id', bookController.patchBook);

  // DELETE book
  fastify.delete('/:id', bookController.deleteBook);

  // Search books
  fastify.get('/search/all', bookController.searchBooks);
}