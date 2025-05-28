import { cacheExchange, createClient, fetchExchange } from 'urql'
import { GRAPHQLURI } from './const'

const graphQLClient = createClient({
  url: GRAPHQLURI,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  },

  exchanges: [cacheExchange, fetchExchange]
})

export default graphQLClient
