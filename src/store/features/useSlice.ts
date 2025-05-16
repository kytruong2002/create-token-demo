import type { User } from '@/types/user'
import { createSlice } from '@reduxjs/toolkit'

interface UserStateType {
  user: User | null
  token: string | null
  loading: boolean
}

const initialState: UserStateType = {
  token: null,
  user: null,
  loading: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
    },
    addUser: (state, action) => {
      state.user = action.payload
    },
    addToken: (state, action) => {
      state.token = action.payload
    }
  }
})

export const { logout, addUser, addToken } = userSlice.actions

export default userSlice.reducer
