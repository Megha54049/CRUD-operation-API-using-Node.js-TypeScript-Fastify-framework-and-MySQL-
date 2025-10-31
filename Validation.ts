import { z } from 'zod';

// Validation schema for creating a book
export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  author: z.string().min(1, "Author is required").max(255, "Author name too long"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(20, "ISBN too long").optional(),
  published_year: z.number().int().min(1000, "Invalid year").max(new Date().getFullYear(), "Year cannot be in future").optional(),
  publisher: z.string().max(255, "Publisher name too long").optional(),
  language: z.string().max(50, "Language too long").optional().default('English'),
});

// Validation schema for updating a book (all fields optional)
export const updateBookSchema = createBookSchema.partial();

// Validation schema for partial updates (PATCH)
export const patchBookSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  author: z.string().min(1).max(255).optional(),
  isbn: z.string().min(10).max(20).optional(),
  published_year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  publisher: z.string().max(255).optional(),
  language: z.string().max(50).optional(),
});

// ID validation schema
export const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number)
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10')
});

// Search validation schema
export const searchSchema = z.object({
  q: z.string().min(1, "Search term is required"),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10')
});

// Types inferred from Zod schemas
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type PatchBookInput = z.infer<typeof patchBookSchema>;
export type IdParams = z.infer<typeof idSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;