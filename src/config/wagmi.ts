import { http } from 'viem'
import { CHAIN_SUPPORTED } from './chain'
import { createConfig } from 'wagmi'

export const wagmiConfig = createConfig({
  chains: [CHAIN_SUPPORTED],
  transports: {
    [CHAIN_SUPPORTED.id]: http()
  }
})
