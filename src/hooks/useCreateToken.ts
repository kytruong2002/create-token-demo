import { NATIVE_DECIMAL } from '@/config/chain'
import { useGlobalDataContext } from '@/contexts/globalData'
import type { FieldTokenType } from '@/types/token'
import { toast } from 'react-toastify'
import { parseUnits } from 'viem'
import { useConnectWallet } from './useConnectWallet'
import { usePublicClient, useWriteContract } from 'wagmi'
import { factoryContract } from '@/contracts'
import tokenService from '@/services/tokenService'
import { useGasFee } from './useGasFee'

export function useCreateToken() {
  const { setIsLoading } = useGlobalDataContext()
  const { address, checkNetwork } = useConnectWallet()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const functionName = 'createStandardToken'
  const { fetchGasFee } = useGasFee({
    ...factoryContract,
    functionName
  })

  const handleCreateToken = async (values: FieldTokenType) => {
    if (!address && !publicClient) {
      toast.error('Please connect your wallet first.')
      return
    }

    if (!checkNetwork()) return

    const file = values.image?.[0]?.originFileObj as File
    if (!file) {
      toast.error('Please upload an image file.')
      return
    }

    try {
      setIsLoading(true)
      const initialSupply = parseUnits(values.initialSupply?.toString() || '0', NATIVE_DECIMAL)
      const maxSupply = parseUnits(values.maxSupply?.toString() || '0', NATIVE_DECIMAL)
      const amountPerMint = parseUnits(values.amountPerMint?.toString() || '0', NATIVE_DECIMAL)
      const mintFee = parseUnits(values.mintFee?.toString() || '0', NATIVE_DECIMAL)
      const args = [values.name, values.symbol, initialSupply, maxSupply, amountPerMint, mintFee]

      const isEnough = await fetchGasFee({ args })
      if (!isEnough) {
        toast.error('Insufficient balance for gas fees.')
        return
      }

      const hash = await writeContractAsync({
        ...factoryContract,
        functionName,
        args
      })
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: hash
      })
      if (receipt?.status === 'success') {
        const formData = new FormData()
        formData.append('txHash', receipt.transactionHash)
        formData.append('description', values.description as string)
        formData.append('image', file)

        const res = await tokenService.create(formData)
        toast.success(`🎉 ${res.message}`)
        return true
      } else {
        toast.error('Create token failed!')
      }
    } catch (error) {
      console.error('Error creating token:', error)
      toast.error('Create token failed!')
    } finally {
      setIsLoading(false)
    }
    return false
  }

  return { handleCreateToken }
}
