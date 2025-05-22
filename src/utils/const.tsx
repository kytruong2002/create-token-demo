import { Link } from 'react-router-dom'

export const BE_URL = 'http://localhost:5035/v1'
export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  MINT: '/mint'
}
export const NAVBAR_ITEM = [
  {
    label: <Link to='/'>Create Token</Link>,
    key: '/'
  },
  {
    label: <Link to='/mint'>Mint</Link>,
    key: '/mint'
  }
]

export const CONTRACRT_ADDRESS: `0x${string}` = '0x60af8349677959701c7973ae8ff2ee173b6fff5a'

export const COLORS = ['default', 'primary', 'danger', 'pink', 'purple', 'cyan']
