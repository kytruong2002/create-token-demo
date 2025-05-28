import type { ApiResponse, PaginationParams } from '@/types/api'
import type { Token } from '@/types/token'
import api from '@/config/axios'
import { LIMIT } from '@/utils/const'

const url = (path: string = '') => `/tokens/${path}`

const tokenService = {
  create: (data: FormData): Promise<ApiResponse<Token>> => {
    return api.post(url(), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getAll: (params: PaginationParams = {}): Promise<ApiResponse<Token[]>> => {
    const { page = 1, limit = LIMIT } = params
    return api.get(url(), {
      params: {
        page,
        limit
      }
    })
  },
  getByUser: (params: PaginationParams = {}): Promise<ApiResponse<Token[]>> => {
    const { page = 1, limit = LIMIT } = params
    return api.get(url('user'), {
      params: {
        page,
        limit
      }
    })
  },
  getOne: (address: string): Promise<ApiResponse<Token>> => {
    return api.get(url(address))
  }
}

export default tokenService
