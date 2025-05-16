import { sepolia } from 'viem/chains'

export const CHAIN_SUPPORTED = sepolia
export const CHAIN_ID = CHAIN_SUPPORTED.id
export const NATIVE_SYMBOL = CHAIN_SUPPORTED.nativeCurrency.symbol
export const NATIVE_DECIMAL = CHAIN_SUPPORTED.nativeCurrency.decimals
