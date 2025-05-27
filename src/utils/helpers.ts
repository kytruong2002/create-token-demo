import Decimal from 'decimal.js'
import { parseEther } from 'viem'

export const shortenAddress = (address: `0x${string}`, startLength = 4, endLength = 4) => {
  if (address.length < 10) {
    return address
  }

  const start = address.slice(0, startLength + 2)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}

export const checkBalance = (balance: bigint, value: bigint) => {
  const balanceDecimal = new Decimal(balance.toString())
  const valueDecimal = new Decimal(value.toString())
  return balanceDecimal.greaterThanOrEqualTo(valueDecimal)
}

export const checkFeeGas = ({
  balance,
  gasLimit,
  gasPrice,
  baseFeePerGas
}: {
  balance: bigint
  gasLimit: bigint
  gasPrice?: bigint
  baseFeePerGas?: bigint
}) => {
  const gasLimitDecimal = new Decimal(gasLimit.toString())
  const gasPriceDecimal = new Decimal(gasPrice?.toString() || '0')
  const balanceDecimal = new Decimal(balance.toString())
  let feeGas = new Decimal(0)
  if (baseFeePerGas) {
    const maxPriorityFeePerGas = parseEther('2', 'gwei')
    const maxPriorityFeePerGasDecimal = new Decimal(maxPriorityFeePerGas.toString())
    const baseFeePerGasDecimal = new Decimal(baseFeePerGas.toString())
    const maxFeePerGas = baseFeePerGasDecimal.plus(maxPriorityFeePerGasDecimal)
    feeGas = gasLimitDecimal.times(maxFeePerGas)
  } else {
    feeGas = gasLimitDecimal.times(gasPriceDecimal)
  }

  return balanceDecimal.greaterThanOrEqualTo(feeGas)
}
