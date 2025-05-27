import { useGlobalDataContext } from '@/contexts/globalData'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { useConnectWallet } from './useConnectWallet'
import { useBalance, usePublicClient, useReadContract, useWriteContract } from 'wagmi'
import { formatUnits } from 'viem'
import Decimal from 'decimal.js'
import { toast } from 'react-toastify'
import { NATIVE_SYMBOL } from '@/config/chain'
import { useEffect, useState } from 'react'
import tokenService from '@/services/tokenService'
import type { Token } from '@/types/token'

export function useMintToken(contract: `0x${string}`) {
  const standardERC20 = {
    address: contract,
    abi: Standard_ERC20_ABI
  }
  const { setIsLoading } = useGlobalDataContext()
  const { checkNetwork, address } = useConnectWallet()
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    ...standardERC20,
    functionName: 'totalSupply'
  })
  const { data: decimals } = useReadContract({
    ...standardERC20,
    functionName: 'decimals'
  })
  // const tokenInfo = useERC20TokenInfo({
  //   address: standardERC20.address,
  //   abi: standardERC20.abi as Abi
  // })
  const [tokenInfo, setTokenInfo] = useState<Token>()
  const [totalGas, setTotalGas] = useState<bigint>(BigInt(0))
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

  const getTotalGas = async (fee: bigint) => {
    try {
      if (!publicClient) return BigInt(0)
      const { request } = await publicClient.simulateContract(getStandardERC20(fee))
      const gasPrice = (await publicClient.getGasPrice()) ?? BigInt(0)
      const gasEstimated = (await publicClient?.estimateContractGas(request)) ?? BigInt(0)

      const gasPriceDecimal = new Decimal(gasPrice.toString())
      const gasEstimatedDecimal = new Decimal(gasEstimated.toString())
      const feeGasDecimal = gasPriceDecimal.times(gasEstimatedDecimal)

      const minFeeDecimal = new Decimal(fee.toString())
      const totalGasDecimal = feeGasDecimal.plus(minFeeDecimal)
      setTotalGas(BigInt(totalGasDecimal.toFixed(0)))
      return BigInt(totalGasDecimal.toFixed(0))
    } catch (error) {
      console.error('Error calculating total gas:', error)
      return BigInt(0)
    }
  }

  useEffect(() => {
    if (contract) {
      ;(async () => {
        try {
          setIsLoading(true)
          const { data } = await tokenService.getOne(contract)
          setTokenInfo(data)
          if (!isNaN(parseInt(data.mintFee))) {
            await getTotalGas(BigInt(data.mintFee))
          }
        } catch (error) {
          console.error('Error fetching token data:', error)
        } finally {
          setIsLoading(false)
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract])

  const checkFeeGas = async (fee: bigint) => {
    try {
      const balance = balanceData?.value ?? BigInt(0)
      const balanceDecimal = new Decimal(balance.toString())
      if (balanceDecimal.lessThanOrEqualTo(new Decimal(0))) {
        toast.error(`Not enough ${NATIVE_SYMBOL}`)
        return false
      }
      const totalGas = await getTotalGas(fee)
      const totalGasDecimal = new Decimal(totalGas.toString())

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
      tokenInfo &&
      typeof totalSupply === 'bigint' &&
      !isNaN(parseInt(tokenInfo?.maxSupply as string)) &&
      !isNaN(parseInt(tokenInfo?.amountPerMint as string)) &&
      !isNaN(parseInt(tokenInfo?.mintFee as string)) &&
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

  return { handleMint, totalSupply, tokenInfo, decimals, totalGas }
}
