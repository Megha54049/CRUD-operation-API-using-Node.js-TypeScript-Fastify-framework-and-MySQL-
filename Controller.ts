import { FastifyRequest, FastifyReply } from 'fastify';
import { bookModel } from '../models/Model';
import { 
  createBookSchema, 
  updateBookSchema, 
  patchBookSchema, 
  idSchema,
  paginationSchema,
  searchSchema
} from '../validations/Validation';
import { ApiResponse } from '../schema/schema';

export const bookController = {
  // GET all books
  async getAllBooks(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { page, limit } = paginationSchema.parse(request.query);
      
      if (page < 1 || limit < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Page and limit must be positive numbers'
        };
        reply.code(400).send(response);
        return;
      }

      const result = await bookModel.findAll(page, limit);
      
      const response: ApiResponse<any> = {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
      
      reply.send(response);
    } catch (error) {
      console.error('Error fetching books:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // GET book by ID
  async getBookById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = idSchema.parse(request.params);
      
      const book = await bookModel.findById(id);
      
      if (!book) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Book not found'
        };
        reply.code(404).send(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        data: book
      };
      
      reply.send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid book ID'
        };
        reply.code(400).send(response);
        return;
      }
      
      console.error('Error fetching book:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // POST create new book
  async createBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const validatedData = createBookSchema.parse(request.body);
      
      // Check if ISBN already exists
      if (validatedData.isbn) {
        const isbnExists = await bookModel.isbnExists(validatedData.isbn);
        if (isbnExists) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'ISBN already exists'
          };
          reply.code(400).send(response);
          return;
        }
      }
      
      const newBook = await bookModel.create(validatedData);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Book created successfully',
        data: newBook
      };
      
      reply.code(201).send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          details: error.errors
        };
        reply.code(400).send(response);
        return;
      }

      console.error('Error creating book:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // PUT update entire book
  async updateBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = idSchema.parse(request.params);
      const validatedData = updateBookSchema.parse(request.body);
      
      // Check if book exists
      const existingBook = await bookModel.findById(id);
      if (!existingBook) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Book not found'
        };
        reply.code(404).send(response);
        return;
      }
      
      // Check if ISBN already exists (excluding current book)
      if (validatedData.isbn) {
        const isbnExists = await bookModel.isbnExists(validatedData.isbn, id);
        if (isbnExists) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'ISBN already exists'
          };
          reply.code(400).send(response);
          return;
        }
      }
      
      const updatedBook = await bookModel.update(id, validatedData);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Book updated successfully',
        data: updatedBook
      };
      
      reply.send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          details: error.errors
        };
        reply.code(400).send(response);
        return;
      }

      console.error('Error updating book:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // PATCH partial update
  async patchBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = idSchema.parse(request.params);
      const validatedData = patchBookSchema.parse(request.body);
      
      // Check if book exists
      const existingBook = await bookModel.findById(id);
      if (!existingBook) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Book not found'
        };
        reply.code(404).send(response);
        return;
      }
      
      // Check if ISBN already exists (excluding current book)
      if (validatedData.isbn) {
        const isbnExists = await bookModel.isbnExists(validatedData.isbn, id);
        if (isbnExists) {
          const response: ApiResponse<null> = {
            success: false,
            error: 'ISBN already exists'
          };
          reply.code(400).send(response);
          return;
        }
      }
      
      const updatedBook = await bookModel.partialUpdate(id, validatedData);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Book updated successfully',
        data: updatedBook
      };
      
      reply.send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          details: error.errors
        };
        reply.code(400).send(response);
        return;
      }

      console.error('Error patching book:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // DELETE book
  async deleteBook(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = idSchema.parse(request.params);
      
      const deletedBook = await bookModel.delete(id);
      
      if (!deletedBook) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Book not found'
        };
        reply.code(404).send(response);
        return;
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Book deleted successfully',
        data: deletedBook
      };
      
      reply.send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid book ID'
        };
        reply.code(400).send(response);
        return;
      }

      console.error('Error deleting book:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  },

  // Search books
  async searchBooks(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { q: searchTerm, page, limit } = searchSchema.parse(request.query);

      if (page < 1 || limit < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Page and limit must be positive numbers'
        };
        reply.code(400).send(response);
        return;
      }

      const result = await bookModel.search(searchTerm, page, limit);
      
      const response: ApiResponse<any> = {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
      
      reply.send(response);
    } catch (error: any) {
      if (error.errors) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Validation failed',
          details: error.errors
        };
        reply.code(400).send(response);
        return;
      }

      console.error('Error searching books:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Internal server error'
      };
      reply.code(500).send(response);
    }
  }
};