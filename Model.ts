import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/data';
import { Book, CreateBookInput, UpdateBookInput, PaginationResult } from '../schema/schema';

export const bookModel = {
  // GET all books with optional pagination
  async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<Book>> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT * FROM books 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = 'SELECT COUNT(*) as total FROM books';
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, [limit, offset]);
    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery);
    
    const total = countRows[0].total as number;
    
    return {
      data: rows as Book[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // GET book by ID
  async findById(id: number): Promise<Book | null> {
    const query = 'SELECT * FROM books WHERE id = ?';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Book;
  },

  // POST create new book
  async create(bookData: CreateBookInput): Promise<Book> {
    const {
      title, author, isbn, published_year, publisher, language
    } = bookData;

    const query = `
      INSERT INTO books (
        title, author, isbn, published_year, publisher, language
      ) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title, author, isbn, published_year, publisher, language
    ];

    const [result] = await pool.execute<ResultSetHeader>(query, values);
    
    // Fetch the newly created book
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM books WHERE id = ?',
      [result.insertId]
    );
    
    return rows[0] as Book;
  },

  // PUT update entire book
  async update(id: number, bookData: UpdateBookInput): Promise<Book | null> {
    const {
      title, author, isbn, published_year, publisher, language
    } = bookData;

    const query = `
      UPDATE books 
      SET 
        title = ?, 
        author = ?, 
        isbn = ?, 
        published_year = ?, 
        publisher = ?,
        language = ?
      WHERE id = ?
    `;

    const values = [
      title, author, isbn, published_year, publisher, language, id
    ];

    const [result] = await pool.execute<ResultSetHeader>(query, values);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    // Fetch the updated book
    const updatedBook = await this.findById(id);
    return updatedBook;
  },

  // PATCH partial update
  async partialUpdate(id: number, updates: Partial<UpdateBookInput>): Promise<Book | null> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic query based on provided fields
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    
    const query = `
      UPDATE books 
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, values);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    // Fetch the updated book
    const updatedBook = await this.findById(id);
    return updatedBook;
  },

  // DELETE book
  async delete(id: number): Promise<Book | null> {
    // First get the book to return it
    const book = await this.findById(id);
    
    if (!book) {
      return null;
    }

    const query = 'DELETE FROM books WHERE id = ?';
    await pool.execute(query, [id]);
    
    return book;
  },

  // Search books by title or author
  async search(searchTerm: string, page: number = 1, limit: number = 10): Promise<PaginationResult<Book>> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total FROM books 
      WHERE title LIKE ? OR author LIKE ?
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      query, 
      [searchPattern, searchPattern, limit, offset]
    );
    
    const [countRows] = await pool.execute<RowDataPacket[]>(
      countQuery, 
      [searchPattern, searchPattern]
    );
    
    const total = countRows[0].total as number;
    
    return {
      data: rows as Book[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  // Check if ISBN already exists
  async isbnExists(isbn: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT id FROM books WHERE isbn = ?';
    const params: any[] = [isbn];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.length > 0;
  }
};