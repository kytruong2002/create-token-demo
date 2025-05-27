import { PATH } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Alert, Button, Card, Flex, Tag } from 'antd'
import { formatUnits } from 'viem'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useMintToken } from '@/hooks/useMintToken'
import { useGlobalDataContext } from '@/contexts/globalData'
import { FormatToken } from '@/components'
import { NATIVE_SYMBOL } from '@/config/chain'

const Mint = () => {
  const { contract } = useParams<{ contract: `0x${string}` }>()
  const navigate = useNavigate()
  const { title, setTitle } = useGlobalDataContext()
  useEffect(() => {
    document.title = 'Mint'
    setTitle(document.title)
    if (!contract) navigate(PATH.LIST_TOKEN)
  }, [contract, navigate, setTitle])

  const { handleMint, tokenInfo, totalSupply, decimals, totalGas } = useMintToken(contract!)

  return (
    <>
      <Card title={title.toLocaleUpperCase()} variant='borderless' style={{ marginBottom: 20 }}>
        <Alert
          message={
            <Flex justify='space-between'>
              <span>Total Gas: </span>
              <FormatToken
                token={formatUnits(totalGas ?? BigInt(0), (decimals as number) ?? 18)}
                symbol={NATIVE_SYMBOL}
              />
            </Flex>
          }
          type='warning'
          showIcon
        />
        <Button
          color='cyan'
          variant='solid'
          size='large'
          style={{ width: '100%', marginTop: '20px' }}
          onClick={handleMint}
        >
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
            {decimals as number}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Total Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((totalSupply as bigint) ?? BigInt(0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Max Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits(BigInt(tokenInfo?.maxSupply ?? 0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Amount Per Mint:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits(BigInt(tokenInfo?.amountPerMint ?? 0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Mint Fee:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits(BigInt(tokenInfo?.mintFee ?? 0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
      </Card>
    </>
  )
}

export default Mint
