import { useGlobalDataContext } from '@/contexts/globalData'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { useConnectWallet } from './useConnectWallet'
import { useBalance, usePublicClient, useReadContract, useWriteContract } from 'wagmi'
import { type Abi } from 'viem'
import { useStandardTokenInfo } from './useStandardTokenInfo'
import Decimal from 'decimal.js'
import { toast } from 'react-toastify'
import { checkBalance, checkFeeGas } from '@/utils/helpers'

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
  const tokenInfo = useStandardTokenInfo(standardERC20 as { address: `0x${string}`; abi: Abi })

  const { address } = useConnectWallet()
  const { data: balanceData } = useBalance({ address })
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const handleMint = async () => {
    if (!checkNetwork()) return
    try {
      setIsLoading(true)
      if (
        typeof totalSupply === 'bigint' &&
        typeof tokenInfo?.maxSupply === 'bigint' &&
        typeof tokenInfo.amountPerMint === 'bigint' &&
        typeof tokenInfo.mintFee === 'bigint'
      ) {
        const functionName = 'mint'
        const fee = BigInt(tokenInfo.mintFee)

        if (!checkBalance(balanceData?.value ?? BigInt(0), fee)) {
          toast.error('Insufficient balance')
          return
        }

        const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
        const gasLimit =
          (await publicClient?.estimateContractGas({
            ...standardERC20,
            functionName,
            value: fee,
            account: address
          })) ?? BigInt(0)
        if (!checkFeeGas(balanceData?.value ?? BigInt(0), gasLimit, gasPrice)) {
          toast.error('Insufficient balance for gas fees.')
          return
        }

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

        const hash = await writeContractAsync({
          ...standardERC20,
          functionName,
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
      } else {
        toast.error('Invalid token information.')
        return
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Mint transaction failed!')
    } finally {
      setIsLoading(false)
    }
  }

  return { handleMint, totalSupply, tokenInfo }
}
