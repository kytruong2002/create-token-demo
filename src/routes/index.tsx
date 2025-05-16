import { ProtectedRoute } from '@/components'
import { Home, Login, NotFound } from '@/pages'
import { PATH } from '@/utils/const'
import { Route, Routes } from 'react-router-dom'

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path={PATH.HOME}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default AppRouter
