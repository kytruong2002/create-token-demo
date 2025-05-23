import { Link } from 'react-router-dom'

export const BE_URL = 'http://localhost:5035/v1'
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

export const CONTRACRT_ADDRESS: `0x${string}` = '0x60af8349677959701c7973ae8ff2ee173b6fff5a'

export const COLORS = ['default', 'primary', 'danger', 'pink', 'purple', 'cyan']

export const LIMIT = 10
