import Header from '@/layouts/header'
import { Container } from '@/utils/styles'
import React from 'react'

interface FormProps {
  children: React.ReactNode
  title: string
}

const Form = ({ children, title }: FormProps) => {
  return (
    <>
      <Header title={title} />
      <Container>{children}</Container>
    </>
  )
}

export default Form
