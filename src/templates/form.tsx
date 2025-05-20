import { Header } from '@/layouts'
import { Container } from '@/utils/styles'
import { Outlet } from 'react-router-dom'

const Form = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  )
}

export default Form
