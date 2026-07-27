export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  errors?: ApiFieldError[];
}

export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}