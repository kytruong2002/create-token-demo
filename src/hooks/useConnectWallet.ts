import userService from '@/services/userService'
import { addToken, logout } from '@/store/features/useSlice'
import type { requestMessage, SingInRequest } from '@/types/user'
import { PATH } from '@/utils/const'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount, useBalance, useConnect, useDisconnect, useSignMessage, type Connector } from 'wagmi'

export function useConnectWallet() {
  const { connect, connectors } = useConnect({
    mutation: {
      onError: () => {
        toast.error(`Connect failed!`)
      }
    }
  })
  const dispatch = useDispatch()
  const { disconnect } = useDisconnect({
    mutation: {
      onError: () => {
        toast.error(`Disconnect failed!`)
      }
    }
  })
  const navigate = useNavigate()
  const { address, isConnected, chainId } = useAccount()
  const { data: nativeToken } = useBalance({ address })
  const [isLoading, setIsLoading] = useState(false)

  const handleDisconnect = () => {
    disconnect()
    dispatch(logout())
  }

  const { signMessageAsync } = useSignMessage({
    mutation: {
      onError: () => {
        toast.error(`signMessage failed!`)
        handleDisconnect()
      }
    }
  })

  const { mutate: handleLogin } = useMutation({
    mutationFn: (data: SingInRequest) => {
      setIsLoading(true)
      return userService.signIn(data)
    },
    onSuccess: (data) => {
      toast.success('Login successfully!')
      dispatch(addToken(data.data))
      navigate(PATH.HOME)
    },
    onError: () => {
      toast.error('Login faild!')
      handleDisconnect()
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const { mutate: requestMutate } = useMutation({
    mutationFn: (data: requestMessage) => {
      setIsLoading(true)
      return userService.requestMessage(data)
    },
    onSuccess: async (response) => {
      const messageSign = response.data
      const signature = await signMessageAsync({ message: messageSign })
      handleLogin({
        walletAddress: address as `0x${string}`,
        signature,
        message: messageSign
      })
    },
    onError: () => {
      toast.error("Can't request authentication")
      handleDisconnect()
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const handleConnect = (params: { connector: Connector }) => {
    connect(params)
  }

  return {
    handleConnect,
    connectors,
    isConnected,
    isLoading,
    chainId,
    nativeToken,
    address,
    requestMutate,
    handleDisconnect
  }
}
