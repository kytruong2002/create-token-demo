import { useConnectWallet } from '@/hooks/useConnectWallet'
import Header from '@/layouts/header'
import { Container } from '@/utils/styles'
import { Spin } from 'antd'
import React from 'react'

interface FormProps {
  children: React.ReactNode
  title: string
}

const Form = ({ children, title }: FormProps) => {
  const { isLoading } = useConnectWallet()
  return (
    <>
      <Header title={title} />
      <Container>{children}</Container>
      <Spin spinning={isLoading} fullscreen />
    </>
  )
}

export default Form
