export const TOP_TRENDING_QUERY = `
query GetTrendingTokens($filters: TokenFilters, $rankings: [TokenRanking!], $limit: Int) {
    filterTokens(
      filters: $filters
      rankings: $rankings
      limit: $limit
    ) {
      results {
        token {
          name
          symbol
          address
          networkId
        }
        priceUSD
        volume24
        liquidity
      }
    }
  }
`
