import { useConnectWallet } from '@/hooks/useConnectWallet'
import Form from '@/templates/form'
import type { StyleColor } from '@/types/style'
import { COLORS } from '@/utils/const'
import { Button, Card, Flex, Spin } from 'antd'
import { useEffect } from 'react'
import styled from 'styled-components'

const CardCustom = styled(Card)`
  width: 50vw;
  margin-top: 20px;
`
const Login = () => {
  const { connectors, handleConnect, address, isConnected, requestMutate, isLoading } = useConnectWallet()

  useEffect(() => {
    if (address && isConnected) {
      requestMutate({ walletAddress: address })
    }
  }, [address, isConnected, requestMutate])
  return (
    <Form title='Login'>
      <Flex align='center' justify='center'>
        <CardCustom title={'Connect Wallet'.toLocaleUpperCase()} variant='borderless'>
          <Flex align='center' justify='center' vertical gap={15}>
            {connectors?.map((connector, index) => {
              const color = COLORS[index % COLORS.length] as StyleColor
              return (
                <Button key={connector.uid} onClick={() => handleConnect({ connector })} color={color} variant='solid'>
                  Connect {connector.name}
                </Button>
              )
            })}
          </Flex>
        </CardCustom>
      </Flex>
      <Spin fullscreen size='large' spinning={isLoading} />
    </Form>
  )
}

export default Login
