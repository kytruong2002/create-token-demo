export const TOP_POOLS_QUERY = `{
  pools(first: 10, orderBy: volumeUSD, orderDirection: desc) {
    id
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
    volumeUSD
    totalValueLockedUSD
  }
}`
