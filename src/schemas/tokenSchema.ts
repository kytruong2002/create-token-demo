import { number, object, ref, string } from 'yup'

export const tokenSchema = object().shape({
  name: string().required('Name is required'),
  symbol: string().required('Symbol is required'),
  maxSupply: number()
    .typeError('Max supply must be a number')
    .positive('Max supply must be greater than 0')
    .required('Max supply is required')
    .min(ref('initialSupply'), 'Max supply must be greater than Initial supply'),
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
  // image: array()
  //   .of(
  //     object().shape({
  //       uid: string().required(),
  //       name: string().required(),
  //       status: string(),
  //       url: string(),
  //       originFileObj: mixed().test('fileType', 'Unsupported File Format', (value) => {
  //         if (!value || typeof value !== 'object' || !('type' in value)) return false
  //         const file = value as File
  //         return ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  //       })
  //     })
  //   )
  //   .min(1, 'Please upload a token image!')
  //   .required('Please upload a token image!')
})
