import Decimal from 'decimal.js'

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
  return balanceDecimal.greaterThan(valueDecimal)
}

export const checkFeeGas = (balance: bigint, gasLimit: bigint, gasPrice: bigint) => {
  const gasLimitDecimal = new Decimal(gasLimit.toString())
  const gasPriceDecimal = new Decimal(gasPrice.toString())
  const feeGas = gasLimitDecimal.times(gasPriceDecimal)

  const balanceDecimal = new Decimal(balance.toString())
  return balanceDecimal.greaterThan(feeGas)
}
