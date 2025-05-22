import { useMemo } from 'react'
import type { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

export function useERC20TokenInfo(standardERC20: { address: `0x${string}`; abi: Abi }) {
  const functionNames = ['maxSupply', 'name', 'symbol', 'decimals', 'amountPerMint', 'mintFee'] as const

  const { data } = useReadContracts({
    contracts: functionNames.map((fn) => ({
      ...standardERC20,
      functionName: fn
    })) as unknown as readonly {
      functionName: string
      address: `0x${string}`
      abi: Abi
    }[]
  })

  const tokenInfo = useMemo(() => {
    if (!data) return null

    return {
      maxSupply: data[0]?.result as bigint,
      name: data[1]?.result as string,
      symbol: data[2]?.result as string,
      decimals: data[3]?.result as number,
      amountPerMint: data[4]?.result as bigint,
      mintFee: data[5]?.result as bigint
    }
  }, [data])

  return tokenInfo
}
