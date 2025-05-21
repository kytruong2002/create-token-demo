import { wagmiConfig } from '@/config/wagmi'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { CONTRACRT_ADDRESS } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Button, Card, Form, Spin, Tag } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { formatUnits } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { useReadContract, useWriteContract } from 'wagmi'
import { useConnectWallet } from '@/hooks/useConnectWallet'

const Mint = () => {
  document.title = 'Mint'
  const paramsContract = {
    address: CONTRACRT_ADDRESS,
    abi: Standard_ERC20_ABI
  }
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { checkNetwork } = useConnectWallet()
  const { data: totalSupply } = useReadContract({
    ...paramsContract,
    functionName: 'totalSupply'
  })
  const { data: maxSupply } = useReadContract({
    ...paramsContract,
    functionName: 'maxSupply'
  })
  const { data: name } = useReadContract({
    ...paramsContract,
    functionName: 'name'
  })
  const { data: symbol } = useReadContract({
    ...paramsContract,
    functionName: 'symbol'
  })
  const { data: decimals } = useReadContract({
    ...paramsContract,
    functionName: 'decimals'
  })
  const { data: amountPerMint } = useReadContract({
    ...paramsContract,
    functionName: 'amountPerMint'
  })
  const { data: mintFee } = useReadContract({
    ...paramsContract,
    functionName: 'mintFee'
  })

  const { writeContractAsync } = useWriteContract()

  const handleMint = async () => {
    if (
      typeof totalSupply === 'bigint' &&
      typeof maxSupply === 'bigint' &&
      typeof mintFee === 'bigint' &&
      typeof amountPerMint === 'bigint' &&
      checkNetwork()
    ) {
      const total = BigInt(totalSupply)
      const amount = BigInt(amountPerMint)
      const max = BigInt(maxSupply)

      if (total + amount > max) {
        toast.error('Total supply exceeded max supply')
        return
      }

      try {
        setIsLoading(true)
        const hash = await writeContractAsync({
          ...paramsContract,
          functionName: 'mint',
          value: BigInt(mintFee)
        })

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: hash
        })

        if (receipt.status === 'success') {
          toast.success('Mint transaction sent successfully!')
          form.resetFields()
        } else {
          toast.error('Mint transaction failed!')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Mint transaction failed!')
      } finally {
        setIsLoading(false)
      }
    }
  }

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
            <CustomParagraph copyable={{ text: CONTRACRT_ADDRESS }}>
              {shortenAddress(CONTRACRT_ADDRESS!)}
            </CustomParagraph>
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Name:</span>
          <Tag bordered={false} color='cyan'>
            {name as string}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Symbol:</span>
          <Tag bordered={false} color='cyan'>
            {symbol as string}
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
            {formatUnits((maxSupply as bigint) ?? BigInt(0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Amount Per Mint:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((amountPerMint as bigint) ?? BigInt(0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Mint Fee:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((mintFee as bigint) ?? BigInt(0), (decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
      </Card>
      <Spin fullscreen size='large' spinning={isLoading} />
    </>
  )
}

export default Mint
