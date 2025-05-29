export const TOP_TRENDING_QUERY = `{
  tokens(first: 10, orderBy: volumeUSD, orderDirection: desc) {
    id
    symbol
    name
    volumeUSD
    txCount
  }
}`
