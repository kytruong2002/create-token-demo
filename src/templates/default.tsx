import { ProtectedRoute } from '@/components'
import { Header, Navbar } from '@/layouts'
import { Container } from '@/utils/styles'
import { Col, Row } from 'antd'
import { Outlet } from 'react-router-dom'

const Default = () => {
  return (
    <>
      <Header />
      <Container>
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24} md={8}>
            <Navbar />
          </Col>
          <Col xs={24} md={16}>
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Default
