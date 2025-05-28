import type { ApiResponse } from '@/types/api'
import type { requestMessage, SingInRequest, User } from '@/types/user'
import api from '@/config/axios'

const userService = {
  requestMessage: (userData: requestMessage): Promise<ApiResponse<string>> => {
    return api.post('/users/request', userData)
  },
  signIn: (userData: SingInRequest): Promise<ApiResponse<string>> => {
    return api.post('/users/login', userData)
  },
  getProfile: (): Promise<ApiResponse<User>> => {
    return api.get('/users/profile')
  },
  updateProfile: (userData: User): Promise<ApiResponse<User>> => {
    return api.put('/users/profile', userData)
  }
}

export default userService
