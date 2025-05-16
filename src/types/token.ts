export interface CreateTokenRequest {
  txHash: string
  description: string
  websiteUrl?: string
  telegramUrl?: string
  discordUrl?: string
  xUrl?: string
}

export interface TokenRequest {
  name: string
  symbol: string
  decimals: number
  supply: number
  description: string
  websiteUrl?: string
  telegramUrl?: string
  discordUrl?: string
  xUrl?: string
}

export interface Token {
  _id?: string
  name: string
  symbol: string
  decimals: number
  supply: number
  description: string
  websiteUrl?: string
  telegramUrl?: string
  discordUrl?: string
  xUrl?: string
  image: string
  owner: string
}
