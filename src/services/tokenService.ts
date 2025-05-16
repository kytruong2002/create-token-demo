import type { ApiResponse } from '@/types/api'
import type { Token } from '@/types/token'
import api from '@/utils/axios'

const tokenService = {
  create: (data: FormData): Promise<ApiResponse<Token>> => {
    return api.post('/tokens', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default tokenService
