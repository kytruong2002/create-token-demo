import { useGlobalDataContext } from '@/contexts/globalData'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { useConnectWallet } from './useConnectWallet'
import { useBalance, usePublicClient, useReadContract, useWriteContract } from 'wagmi'
import { formatUnits, type Abi } from 'viem'
import { useERC20TokenInfo } from './useERC20TokenInfo'
import Decimal from 'decimal.js'
import { toast } from 'react-toastify'
import { NATIVE_SYMBOL } from '@/config/chain'

export function useMintToken(contract: `0x${string}`) {
  const standardERC20 = {
    address: contract,
    abi: Standard_ERC20_ABI
  }
  const { setIsLoading } = useGlobalDataContext()
  const { checkNetwork } = useConnectWallet()
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    ...standardERC20,
    functionName: 'totalSupply'
  })
  const tokenInfo = useERC20TokenInfo({
    address: standardERC20.address,
    abi: standardERC20.abi as Abi
  })

  const { address } = useConnectWallet()
  const { data: balanceData } = useBalance({ address })
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const getStandardERC20 = (fee: bigint) => {
    return {
      ...standardERC20,
      functionName: 'mint',
      value: fee,
      account: address
    }
  }

  const checkFeeGas = async (fee: bigint) => {
    try {
      const balance = balanceData?.value ?? BigInt(0)
      const balanceDecimal = new Decimal(balance.toString())
      if (balanceDecimal.lessThanOrEqualTo(new Decimal(0))) {
        toast.error(`Not enough ${NATIVE_SYMBOL}`)
        return false
      }
      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const gasEstimated = (await publicClient?.estimateContractGas(getStandardERC20(fee))) ?? BigInt(0)

      const gasPriceDecimal = new Decimal(gasPrice.toString())
      const gasEstimatedDecimal = new Decimal(gasEstimated.toString())
      const feeGasDecimal = gasPriceDecimal.times(gasEstimatedDecimal)

      const minFeeDecimal = new Decimal(fee.toString())
      const totalGasDecimal = feeGasDecimal.plus(minFeeDecimal)
      const totalGas = BigInt(totalGasDecimal.toFixed(0))

      if (balanceDecimal.lessThan(totalGasDecimal)) {
        toast.error(
          `Not enough ${NATIVE_SYMBOL}. You need ${formatUnits(totalGas, balanceData?.decimals ?? 18)}, but only have ${formatUnits(balance, balanceData?.decimals ?? 18)}`
        )
        return false
      }
      return true
    } catch (error) {
      console.error('Error estimating gas:', error)
      return false
    }
  }

  const handleMint = async () => {
    if (
      typeof totalSupply === 'bigint' &&
      typeof tokenInfo?.maxSupply === 'bigint' &&
      typeof tokenInfo.amountPerMint === 'bigint' &&
      typeof tokenInfo.mintFee === 'bigint' &&
      checkNetwork()
    ) {
      const fee = BigInt(tokenInfo.mintFee)
      const isValid = await checkFeeGas(fee)
      if (!isValid) return

      const total = BigInt(totalSupply)
      const amount = BigInt(tokenInfo.amountPerMint)
      const max = BigInt(tokenInfo.maxSupply)

      const totalDecimal = new Decimal(total.toString())
      const amountDecimal = new Decimal(amount.toString())
      const maxDecimal = new Decimal(max.toString())

      if (totalDecimal.plus(amountDecimal).greaterThan(maxDecimal)) {
        toast.error('Total supply exceeded max supply')
        return
      }

      try {
        setIsLoading(true)
        const hash = await writeContractAsync({
          ...standardERC20,
          functionName: 'mint',
          value: fee
        })

        const receipt = await publicClient?.waitForTransactionReceipt({
          hash: hash
        })

        if (receipt?.status === 'success') {
          toast.success('Mint transaction sent successfully!')
          await refetchTotalSupply()
        } else {
          toast.error('Mint transaction failed!')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Mint transaction failed!')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return { handleMint, totalSupply, tokenInfo }
}
