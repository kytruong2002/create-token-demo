import { NATIVE_DECIMAL } from '@/config/chain'
import { useGlobalDataContext } from '@/contexts/globalData'
import type { FieldTokenType } from '@/types/token'
import { toast } from 'react-toastify'
import { parseUnits, type Abi } from 'viem'
import { useConnectWallet } from './useConnectWallet'
import { useBalance, usePublicClient, useWriteContract } from 'wagmi'
import { factoryContract } from '@/contracts'
import { checkFeeGas } from '@/utils/helpers'
import tokenService from '@/services/tokenService'

export function useCreateToken() {
  const { setIsLoading } = useGlobalDataContext()
  const { address, checkNetwork } = useConnectWallet()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const { data: balanceData } = useBalance({ address })

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
      const functionName = 'createStandardToken'

      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const gasLimit =
        (await publicClient?.estimateContractGas({
          ...(factoryContract as { address: `0x${string}`; abi: Abi }),
          functionName,
          args,
          account: address
        })) ?? BigInt(0)
      if (!checkFeeGas(balanceData?.value ?? BigInt(0), gasLimit, gasPrice)) {
        toast.error('Insufficient balance for gas fees.')
        return
      }

      const hash = await writeContractAsync({
        ...(factoryContract as { address: `0x${string}`; abi: Abi }),
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
