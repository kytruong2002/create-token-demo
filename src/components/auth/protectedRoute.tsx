import { userSelector } from '@/store/selectors'
import { PATH } from '@/utils/const'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useSelector(userSelector)
  const location = useLocation()

  if (token) {
    return <>{children}</>
  }

  return <Navigate to={PATH.LOGIN} state={{ from: location }} replace />
}

export default ProtectedRoute
