import { number, object, string } from 'yup'

export const tokenSchema = object().shape({
  name: string().required('Name is required'),
  symbol: string().required('Symbol is required'),
  maxSupply: number()
    .typeError('Max supply must be a number')
    .positive('Max supply must be greater than 0')
    .required('Max supply is required'),
  initialSupply: number()
    .typeError('Initial supply must be a number')
    .positive('Initial supply must be greater than 0')
    .required('Initial supply is required'),
  amountPerMint: number()
    .typeError('Amount per mint must be a number')
    .positive('Amount per mint must be greater than 0')
    .required('Amount per mint is required'),
  mintFee: number()
    .typeError('Mint fee must be a number')
    .min(0, 'Mint fee must be greater than 0')
    .required('Mint fee is required'),
  description: string().required('Description is required')
})
