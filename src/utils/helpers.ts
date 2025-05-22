export const shortenAddress = (address: `0x${string}`, startLength = 4, endLength = 4) => {
  if (address.length < 10) {
    return address
  }

  const start = address.slice(0, startLength + 2)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}
