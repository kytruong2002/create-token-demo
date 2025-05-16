export interface requestMessage {
  walletAddress: string
}

export interface SingInRequest {
  walletAddress: string
  message: string
  signature: string
}

export interface User {
  _id?: string
  walletAddress: string
  password?: string
  username: string
  bio: string
  telegramUrl: string
  githubUrl: string
  xUrl: string
  src?: string
  tokenID?: number
}
