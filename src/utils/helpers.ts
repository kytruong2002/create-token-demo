export const shortenAddress = (address: `0x${string}`, startLength = 4, endLength = 4) => {
  if (address.length < 10) {
    return address
  }

  const start = address.slice(0, startLength + 2)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}

export const checkValueNumber = (value: string) => {
  if (isNaN(Number(value))) {
    return Promise.reject('Value must be a number')
  }
  if (Number(value) <= 0) {
    return Promise.reject('Value must be greater than 0')
  }
  return Promise.resolve()
}