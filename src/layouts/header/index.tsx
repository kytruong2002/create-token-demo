import { useConnectWallet } from '@/hooks/useConnectWallet'
import { PATH } from '@/utils/const'
import { Container } from '@/utils/styles'
import { Button, Flex } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Title = styled(Button)`
  font-size: 2rem;
  font-weight: 700;
`

const HeaderContainer = styled.header`
  height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
`

const Header = () => {
  const { isConnected, handleDisconnect } = useConnectWallet()
  const location = useLocation()
  const [title, setTitle] = useState(document.title)
  useEffect(() => {
    setTitle(document.title)
  }, [location.pathname])

  return (
    <HeaderContainer>
      <Container>
        <Flex justify='space-between' align='center'>
          <Link to={PATH.HOME}>
            <Title color='cyan' variant='link'>
              {title}
            </Title>
          </Link>
          {isConnected && (
            <Button color='danger' variant='solid' onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </Flex>
      </Container>
    </HeaderContainer>
  )
}

export default Header
