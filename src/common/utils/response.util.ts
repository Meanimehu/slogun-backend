export interface SuccessWrapper<T> {
  data: T | null;
  message?: string;
  meta?: any;
  statusCode?: number;
}

// Helper to create success response from controller
export function success<T>(
  data: T | null,
  message: string = 'Success',
  meta?: any,
  statusCode?: number,
): SuccessWrapper<T> {
  return { data, message, meta, statusCode };
}