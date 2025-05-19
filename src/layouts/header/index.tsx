import { useConnectWallet } from '@/hooks/useConnectWallet'
import { PATH } from '@/utils/const'
import { Container } from '@/utils/styles'
import { Button, Flex } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface HeaderProps {
  title: string
}

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

const Header = ({ title }: HeaderProps) => {
  const { isConnected, handleDisconnect } = useConnectWallet()

  useEffect(() => {
    document.title = title
  }, [title])

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
