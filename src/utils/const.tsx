import { Link } from 'react-router-dom'

export const BE_URL_SHORT = 'http://localhost:5035'
export const BE_URL = `${BE_URL_SHORT}/v1`
export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  MINT: '/mint/:contract',
  LIST_TOKEN: '/list'
}
export const NAVBAR_ITEM = [
  {
    label: <Link to={PATH.HOME}>Create Token</Link>,
    key: PATH.HOME
  },
  {
    label: <Link to={PATH.LIST_TOKEN}>List Token</Link>,
    key: PATH.LIST_TOKEN
  }
]

export const COLORS = ['default', 'primary', 'danger', 'pink', 'purple', 'cyan']

export const LIMIT = 10
