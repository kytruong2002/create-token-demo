export interface ApiResponse<T> {
  message: string
  data: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  pagination: PaginationType
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationType {
  total: number
  page: number
  limit: number
}
