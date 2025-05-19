import { CHAIN_ID, CHAIN_SUPPORTED } from '@/config/chain'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { Button } from 'antd'
import { toast } from 'react-toastify'
import { useSwitchChain } from 'wagmi'

const BtnSwitchChain = () => {
  const { isConnected, chainId } = useConnectWallet()
  const { switchChain } = useSwitchChain({
    mutation: {
      onSuccess: () => {
        toast.success('Switch chain success!')
      },
      onError: () => {
        toast.error('Switch chain failed!')
      }
    }
  })

  const handleSwitchChain = () => {
    if (isConnected && chainId !== CHAIN_ID) {
      switchChain({ chainId: CHAIN_ID })
    } else if (chainId === CHAIN_ID) {
      toast.info('You are already on the correct chain.')
    }
  }
  return (
    <Button color='cyan' variant='outlined' onClick={handleSwitchChain} size='large'>
      Switch Chain to {CHAIN_SUPPORTED.name}
    </Button>
  )
}

export default BtnSwitchChain
