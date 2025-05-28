import { FACTORY_ADDRESS } from '@/config/contract'
import FACTORY_ABI from './abi/factory'
import type { Abi } from 'viem'

export const factoryContract = {
  abi: FACTORY_ABI,
  address: FACTORY_ADDRESS
} as {
  address: `0x${string}`
  abi: Abi
}
