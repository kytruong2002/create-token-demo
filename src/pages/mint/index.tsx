import { PATH } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Button, Card, Tag } from 'antd'
import { formatUnits } from 'viem'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useMintToken } from '@/hooks/useMintToken'

const Mint = () => {
  const { contract } = useParams<{ contract: `0x${string}` }>()
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'Mint'
    if (!contract) navigate(PATH.LIST_TOKEN)
  }, [contract, navigate])

  const { handleMint, tokenInfo, totalSupply } = useMintToken(contract!)

  return (
    <>
      <Card title={'Mint'.toLocaleUpperCase()} variant='borderless' style={{ marginBottom: 20 }}>
        <Button color='cyan' variant='solid' size='large' style={{ width: '100%' }} onClick={handleMint}>
          Mint
        </Button>
      </Card>
      <Card title={'Token Info'.toLocaleUpperCase()} variant='borderless'>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Conntract Address:</span>
          <Tag bordered={false} color='cyan'>
            <CustomParagraph copyable={{ text: contract }}>{shortenAddress(contract!)}</CustomParagraph>
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Name:</span>
          <Tag bordered={false} color='cyan'>
            {tokenInfo && tokenInfo.name}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Symbol:</span>
          <Tag bordered={false} color='cyan'>
            {tokenInfo && tokenInfo.symbol}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Decimals:</span>
          <Tag bordered={false} color='cyan'>
            {tokenInfo && tokenInfo.decimals}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Total Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((totalSupply as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Max Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.maxSupply as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Amount Per Mint:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.amountPerMint as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Mint Fee:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.mintFee as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
      </Card>
    </>
  )
}

export default Mint
