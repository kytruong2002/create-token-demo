import { Link } from 'react-router-dom'
import { checkValueNumber } from './helpers'

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
export const RULES = {
  name: [{ required: true, message: 'Please input a token name!' }],
  symbol: [
    { required: true, message: 'Please input a token symbol!' },
    {
      pattern: /^[A-Z]{1,10}$/,
      message: 'Symbol must be 1-10 uppercase letters (A-Z)'
    }
  ],
  maxSupply: [
    { required: true, message: 'Please input a token maxSupply!' },
    {
      validator: (_: unknown, value: string) => checkValueNumber(value)
    }
  ],
  initialSupply: [
    { required: true, message: 'Please input a token initialSupply!' },
    {
      validator: (_: unknown, value: string) => checkValueNumber(value)
    }
  ],
  amountPerMint: [
    { required: true, message: 'Please input a token amountPerMint!' },
    {
      validator: (_: unknown, value: string) => checkValueNumber(value)
    }
  ],
  mintFee: [
    { required: true, message: 'Please input a token mintFee!' },
    {
      validator: (_: unknown, value: string) => checkValueNumber(value)
    }
  ],
  description: [{ required: true, message: 'Please input a token description!' }],
  image: [{ required: true, message: 'Please upload a token image!' }]
}
