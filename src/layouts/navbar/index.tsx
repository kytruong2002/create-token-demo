import { BtnSwitchChain, FormatToken } from '@/components'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { NAVBAR_ITEM } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Button, Card, Flex, Tag } from 'antd'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { formatUnits } from 'viem'
import { useBalance } from 'wagmi'

const CustomBtn = styled(Button)`
  width: 100%;
  margin-bottom: 10px;

  a {
    padding-block: 15px;
    display: block;
    width: 100%;
  }
`

const Navbar = () => {
  const { address, chain } = useConnectWallet()
  const { data: balanceData } = useBalance({ address })
  const location = useLocation()

  return (
    <div>
      <Card title={'Wallet Info'.toLocaleUpperCase()} variant='borderless'>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Wallet Address:</span>
          {address && (
            <Tag bordered={false} color='cyan'>
              <CustomParagraph copyable={{ text: address }}>{shortenAddress(address!)}</CustomParagraph>
            </Tag>
          )}
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Network:</span>
          <Tag bordered={false} color='cyan'>
            {chain?.name}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Chain ID:</span>
          <Tag bordered={false} color='cyan'>
            {chain?.id}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Wallet Balance:</span>
          <Tag bordered={false} color='cyan'>
            <FormatToken
              token={formatUnits(balanceData?.value ?? BigInt(0), balanceData?.decimals ?? 18)}
              symbol={balanceData?.symbol}
            />
          </Tag>
        </FlexCustom>
      </Card>
      <Card title={'Menu'.toLocaleUpperCase()} variant='borderless' style={{ marginTop: 20 }}>
        {NAVBAR_ITEM.map((item) => (
          <CustomBtn key={item.key} color='cyan' variant={location.pathname === item.key ? 'filled' : 'text'}>
            {item.label}
          </CustomBtn>
        ))}
      </Card>
      <Flex justify='center' align='center' gap={10} style={{ marginTop: 20 }}>
        <BtnSwitchChain />
      </Flex>
    </div>
  )
}

export default Navbar
