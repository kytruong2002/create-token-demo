import Header from '@/layouts/header'
import { Container } from '@/utils/styles'
import React from 'react'

interface DefaultProps {
  children: React.ReactNode
  title: string
}

const Default = ({ children, title }: DefaultProps) => {
  return (
    <>
      <Header title={title} />
      <Container>{children}</Container>
    </>
  )
}

export default Default
