import { checkValueNumber } from './helpers'

export const BE_URL = 'http://localhost:5035/v1'
export const PATH = {
  HOME: '/',
  LOGIN: '/login'
}
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
      validator: (_, value) => checkValueNumber(value)
    }
  ],
  initialSupply: [
    { required: true, message: 'Please input a token initialSupply!' },
    {
      validator: (_, value) => checkValueNumber(value)
    }
  ],
  amountPerMint: [
    { required: true, message: 'Please input a token amountPerMint!' },
    {
      validator: (_, value) => checkValueNumber(value)
    }
  ],
  mintFee: [
    { required: true, message: 'Please input a token mintFee!' },
    {
      validator: (_, value) => checkValueNumber(value)
    }
  ],
  description: [{ required: true, message: 'Please input a token description!' }],
  image: [{ required: true, message: 'Please upload a token image!' }]
}
