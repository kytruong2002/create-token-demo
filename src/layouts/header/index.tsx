import { useGlobalDataContext } from '@/contexts/globalData'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { PATH } from '@/utils/const'
import { Container } from '@/utils/styles'
import { Button, Flex } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Title = styled(Button)`
  font-size: 2rem;
  font-weight: 700;
  text-align: left;
  span {
    text-wrap: wrap;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    text-overflow: ellipsis;
  }
`

const HeaderContainer = styled.header`
  height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
`

const Header = () => {
  const { isConnected, handleDisconnect } = useConnectWallet()
  const { title } = useGlobalDataContext()

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
