import { GRAPHQLURI } from '@/utils/const'
import { cacheExchange, createClient, fetchExchange } from 'urql'

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
