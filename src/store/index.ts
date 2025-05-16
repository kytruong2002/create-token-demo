import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './features/useSlice'

// Cấu hình redux-persist để chỉ lưu token
const persistConfig = {
  key: 'user',
  version: 1,
  storage,
  whitelist: ['token']
}

// Kết hợp reducers
const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer)
})

// Áp dụng persistReducer vào store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export const persistor = persistStore(store)
export default store
