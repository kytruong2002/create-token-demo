import { BtnSwitchChain } from '@/components'
import { NATIVE_SYMBOL } from '@/config/chain'
import { wagmiConfig } from '@/config/wagmi'
import { factoryContract } from '@/contracts'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import tokenService from '@/services/tokenService'
import Default from '@/templates/default'
import { RULES } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { Button, Card, Col, Flex, Form, Input, Row, Spin, Tag, Upload, type FormProps, type UploadFile } from 'antd'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { formatEther, parseEther } from 'viem'
import { useBalance, usePublicClient, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

type FieldTokenType = {
  name?: string
  symbol?: string
  maxSupply?: string
  initialSupply?: string
  amountPerMint?: string
  mintFee?: string
  description?: string
  image?: UploadFile[]
}

const FlexCustom = styled(Flex)`
  margin-bottom: 20px;
`

const UploadCustom = styled(Upload)`
  .ant-upload.ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
  }
`

const Home = () => {
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const initValueFormToken: FieldTokenType = {
    name: 'MyToken',
    symbol: 'MTK',
    initialSupply: '1000000',
    maxSupply: '10000000',
    amountPerMint: '1000',
    mintFee: '0.000001',
    description: ''
  }
  const [feeGas, setFeeGas] = useState<bigint>(BigInt(0))
  const { address } = useConnectWallet()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { data: balanceData } = useBalance({ address })
  const [isLoading, setIsLoading] = useState(false)
  const lastValuesRef = useRef<any>({})

  const getParamsABI = (values: FieldTokenType) => {
    const { name, symbol, maxSupply, initialSupply, amountPerMint, mintFee } = values

    return {
      address: factoryContract.address as `0x${string}`,
      abi: factoryContract.abi,
      functionName: 'createStandardToken',
      args: [
        name,
        symbol,
        parseEther(initialSupply as string),
        parseEther(maxSupply as string),
        parseEther(amountPerMint as string),
        parseEther(mintFee as string)
      ],
      account: address
    }
  }

  const getFeeGas = async (values: FieldTokenType) => {
    try {
      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const gasEstimated = (await publicClient?.estimateContractGas(getParamsABI(values))) ?? BigInt(0)
      setFeeGas(gasEstimated * gasPrice)
    } catch (error: any) {
      console.error('Error estimating gas:', error)
    }
  }

  const onFinish: FormProps<FieldTokenType>['onFinish'] = async (values) => {
    if (!address) {
      toast.error('Please connect your wallet first.')
      return
    }
    const balance = balanceData?.value ?? BigInt(0)
    if (balance < feeGas) {
      const balanceBNB = formatEther(balance)
      const neededBNB = formatEther(feeGas)
      toast.error(`Not enough ${NATIVE_SYMBOL}. You need ${neededBNB}, but only have ${balanceBNB}`)
      return
    }

    try {
      setIsLoading(true)
      const hash = await writeContractAsync(getParamsABI(values))

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: hash
      })

      if (receipt.status === 'success') {
        const formData = new FormData()
        formData.append('txHash', receipt.transactionHash)
        formData.append('description', values.description as string)
        const file = values.image?.[0]?.originFileObj as File
        if (file) {
          formData.append('image', file)
        }
        const res = await tokenService.create(formData)
        toast.success(`🎉 ${res.message}`)
        form.resetFields()
        setFileList([])
      } else {
        toast.error('Create token failed!')
      }
    } catch (error: any) {
      console.error('Error creating token:', error)
      toast.error('Create token failed!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldsChange = (_: any, allFields: any[]) => {
    const values: any = {}
    allFields.forEach((field) => {
      values[field.name[0]] = field.value
    })

    const requiredFields = ['name', 'symbol', 'maxSupply', 'initialSupply', 'amountPerMint', 'mintFee']
    const allFilled = requiredFields.every((key) => !!values[key])

    if (allFilled) {
      const lastValues = lastValuesRef.current
      const isSame = requiredFields.every((key) => lastValues[key] === values[key])

      if (!isSame) {
        lastValuesRef.current = values
        getFeeGas(values)
      }
    }
  }

  return (
    <Default title='Home Page'>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card title={'Wallet Info'.toLocaleUpperCase()} variant='borderless'>
            <FlexCustom justify='space-between' align='center' gap={10}>
              <span>Wallet Address:</span>
              <Tag bordered={false} color='cyan'>
                {shortenAddress(address as `0x${string}`)}
              </Tag>
            </FlexCustom>
            <FlexCustom justify='space-between' align='center' gap={10}>
              <span>Network:</span>
              <Tag bordered={false} color='cyan'>
                {wagmiConfig?.chains[0]?.name}
              </Tag>
            </FlexCustom>
            <FlexCustom justify='space-between' align='center' gap={10}>
              <span>Chain ID:</span>
              <Tag bordered={false} color='cyan'>
                {wagmiConfig?.chains[0]?.id}
              </Tag>
            </FlexCustom>
            <FlexCustom justify='space-between' align='center' gap={10}>
              <span>Wallet Balance:</span>
              <Tag bordered={false} color='cyan'>
                <span>
                  {formatEther(balanceData?.value ?? BigInt(0))} {balanceData?.symbol}
                </span>
              </Tag>
            </FlexCustom>
          </Card>
        </Col>
        <Col span={16}>
          <Card title={'Create Token'.toLocaleUpperCase()} variant='borderless'>
            <Form
              name='createToken'
              initialValues={initValueFormToken}
              onFinish={onFinish}
              onFieldsChange={handleFieldsChange}
              layout='vertical'
              form={form}
            >
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='name' name='name' rules={RULES.name}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='symbol' name='symbol' rules={RULES.symbol}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='maxSupply' name='maxSupply' rules={RULES.maxSupply}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='initialSupply' name='initialSupply' rules={RULES.initialSupply}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='amountPerMint' name='amountPerMint' rules={RULES.amountPerMint}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='mintFee' name='mintFee' rules={RULES.mintFee}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldTokenType> label='description' name='description' rules={RULES.description}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Image'
                    name='image'
                    valuePropName='fileList'
                    getValueFromEvent={(e) => {
                      const newFileList = Array.isArray(e) ? e : e?.fileList || []
                      setFileList(newFileList)
                      return newFileList
                    }}
                    rules={RULES.image}
                  >
                    <UploadCustom
                      name='image'
                      listType='picture-card'
                      accept='image/*'
                      maxCount={1}
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                    >
                      {fileList?.length < 1 && (
                        <div>
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </UploadCustom>
                  </Form.Item>
                </Col>
              </Row>
              <FlexCustom justify='flex-end' align='center' gap={10}>
                <span>Estimated gas fee: </span>
                <Tag bordered={false} color='volcano'>
                  {formatEther(feeGas)} {NATIVE_SYMBOL}
                </Tag>
              </FlexCustom>
              <Flex justify='end' gap={10}>
                <BtnSwitchChain />
                <Button htmlType='submit' color='cyan' variant='solid' size='large'>
                  Create
                </Button>
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
      <Spin fullscreen size='large' spinning={isLoading} />
    </Default>
  )
}

export default Home
