// export interface Book {
//   id: number;
//   title: string;
//   author: string;
//   isbn?: string;
//   genre?: string;
//   published_year?: number;
//   publisher?: string;
//   page_count?: number;
//   language?: string;
//   price?: number;
//   in_stock?: boolean;
//   description?: string;
//   created_at: Date;
//   updated_at: Date;
// }

// export interface CreateBookInput {
//   title: string;
//   author: string;
//   isbn?: string;
//   genre?: string;
//   published_year?: number;
//   publisher?: string;
//   page_count?: number;
//   language?: string;
//   price?: number;
//   in_stock?: boolean;
//   description?: string;
// }

// export interface UpdateBookInput {
//   title?: string;
//   author?: string;
//   isbn?: string;
//   genre?: string;
//   published_year?: number;
//   publisher?: string;
//   page_count?: number;
//   language?: string;
//   price?: number;
//   in_stock?: boolean;
//   description?: string;
// }

// export interface PaginationResult<T> {
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface SearchResult<T> {
//   books: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
//   details?: any;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  published_year?: number;
  publisher?: string;
  language?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookInput {
  title: string;
  author: string;
  isbn?: string;
  published_year?: number;
  publisher?: string;
  language?: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  published_year?: number;
  publisher?: string;
  language?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
