import { useConnectWallet } from '@/hooks/useConnectWallet'
import type { StyleColor } from '@/types/style'
import { COLORS } from '@/utils/const'
import { Button, Card, Flex } from 'antd'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const CardCustom = styled(Card)`
  width: 50vw;
  margin-top: 20px;
`

const Login = () => {
  document.title = 'Login'
  const { connectors, handleConnect, address, isConnected, requestMutate, isDisconnected } = useConnectWallet()
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (address && isConnected && !hasRequestedRef.current && !isDisconnected) {
      hasRequestedRef.current = true
      requestMutate({ walletAddress: address })
    }

    if (isDisconnected) {
      hasRequestedRef.current = false
    }
  }, [address, isConnected, requestMutate, isDisconnected])
  return (
    <>
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
    </>
  )
}

export default Login
