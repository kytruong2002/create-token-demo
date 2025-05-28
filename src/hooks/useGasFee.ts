import type { Abi } from 'viem'
import { useBalance, usePublicClient } from 'wagmi'
import { useConnectWallet } from './useConnectWallet'
import { useGlobalDataContext } from '@/contexts/globalData'
import { checkFeeGas } from '@/utils/helpers'

interface GasFeeProps {
  address: `0x${string}`
  abi: Abi
  functionName: string
}

export function useGasFee(props: GasFeeProps) {
  const publicClient = usePublicClient()
  const { address } = useConnectWallet()
  const { data: balanceData } = useBalance({ address })
  const { setIsLoading } = useGlobalDataContext()

  async function fetchGasFee({ value, args }: { value?: bigint; args?: readonly unknown[] }) {
    try {
      setIsLoading(true)
      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const block = await publicClient?.getBlock({ blockTag: 'latest' })
      const gasLimit =
        (await publicClient?.estimateContractGas({
          ...props,
          args,
          account: address,
          value
        })) ?? BigInt(0)
      if (
        !checkFeeGas({
          balance: balanceData?.value ?? BigInt(0),
          gasLimit,
          gasPrice,
          baseFeePerGas: block?.baseFeePerGas ?? undefined
        })
      ) {
        return false
      }
      return true
    } catch (error) {
      console.error('Error fetching gas fee:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchGasFee }
}
