import { wagmiConfig } from '@/config/wagmi'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { CONTRACRT_ADDRESS } from '@/utils/const'
import { checkValueNumber, shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Button, Card, Flex, Form, Input, Spin, Tag, type FormProps } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { formatUnits, parseEther } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { useBalance, useReadContract, useWriteContract } from 'wagmi'
import { useConnectWallet } from '@/hooks/useConnectWallet'

type FieldMintType = {
  amount?: string
}

const Mint = () => {
  document.title = 'Mint'
  const paramsContract = {
    address: CONTRACRT_ADDRESS,
    abi: Standard_ERC20_ABI
  }
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const initValueFormMint: FieldMintType = {
    amount: '0.0001'
  }
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
  const { address } = useConnectWallet()
  const { writeContractAsync } = useWriteContract()
  const { data: balanceData } = useBalance({ address })

  const onFinish: FormProps<FieldMintType>['onFinish'] = async (values) => {
    if (typeof totalSupply === 'bigint' && typeof maxSupply === 'bigint') {
      const total = BigInt(totalSupply)
      const amount = parseEther(values.amount ?? '0')
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
          value: amount
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
        <Form
          form={form}
          name='mint'
          onFinish={onFinish}
          layout='vertical'
          initialValues={initValueFormMint}
          style={{ width: '100%' }}
        >
          <Form.Item
            label='Amount'
            name='amount'
            rules={[
              { required: true, message: 'Please input your amount!' },
              {
                validator: (_, value) => checkValueNumber(value)
              },
              {
                validator: (_, value) => {
                  if (value && balanceData && value > formatUnits(balanceData.value, balanceData.decimals)) {
                    return Promise.reject(new Error('Amount must be less than your balance'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Flex justify='end'>
            <Button htmlType='submit' color='cyan' variant='solid' size='large' style={{ width: '100%' }}>
              Mint
            </Button>
          </Flex>
        </Form>
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
      </Card>
      <Spin fullscreen size='large' spinning={isLoading} />
    </>
  )
}

export default Mint
