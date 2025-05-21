import { CHAIN_ID } from '@/config/chain'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { useEffect, type ReactNode } from 'react'
import { useSwitchChain } from 'wagmi'

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { isConnected, chainId } = useConnectWallet()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (isConnected && chainId !== CHAIN_ID) {
      switchChain({ chainId: CHAIN_ID })
    }
  }, [isConnected, chainId, switchChain])

  return <>{children}</>
}

export default Wrapper
