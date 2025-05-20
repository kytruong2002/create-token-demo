import { userSelector } from '@/store/selectors'
import { PATH } from '@/utils/const'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Wrapper } from '@/components'
import { useConnectWallet } from '@/hooks/useConnectWallet'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useSelector(userSelector)
  const { isConnected } = useConnectWallet()
  const location = useLocation()

  if (token && isConnected) {
    return <Wrapper>{children}</Wrapper>
  }

  return <Navigate to={PATH.LOGIN} state={{ from: location }} replace />
}

export default ProtectedRoute
