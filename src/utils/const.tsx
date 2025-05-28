import { Link } from 'react-router-dom'

export const BE_URL_SHORT = 'http://localhost:5035'
export const BE_URL = `${BE_URL_SHORT}/v1`
export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  MINT: '/mint/:contract',
  LIST_TOKEN: '/list',
  LIST_POOL: '/list-pool',
  YOUR_TOKEN: '/your'
}
export const NAVBAR_ITEM = [
  {
    label: <Link to={PATH.HOME}>Create Token</Link>,
    key: PATH.HOME
  },
  {
    label: <Link to={PATH.LIST_TOKEN}>List Token</Link>,
    key: PATH.LIST_TOKEN
  },
  {
    label: <Link to={PATH.YOUR_TOKEN}>Your Token</Link>,
    key: PATH.YOUR_TOKEN
  },
  {
    label: <Link to={PATH.LIST_POOL}>List Pool</Link>,
    key: PATH.LIST_POOL
  }
]

export const COLORS = ['default', 'primary', 'danger', 'pink', 'purple', 'cyan']
export const LIMIT = 10
export const GRAPHQLURI = 'https://gateway.thegraph.com/api/subgraphs/id/3utanEBA9nqMjPnuQP1vMCCys6enSM3EawBpKTVwnUw2'
