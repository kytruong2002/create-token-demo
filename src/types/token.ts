import type { UploadFile } from 'antd'

export interface Token {
  _id?: string
  name: string
  symbol: string
  maxSupply: string
  amountPerMint: string
  tokenAddress: string
  description: string
  mintFee: string
  websiteUrl?: string
  telegramUrl?: string
  discordUrl?: string
  xUrl?: string
  image: string
  owner: string
}

export interface FieldTokenType {
  name?: string
  symbol?: string
  maxSupply?: number
  initialSupply?: number
  amountPerMint?: number
  mintFee?: number
  description?: string
  image?: UploadFile[]
}
