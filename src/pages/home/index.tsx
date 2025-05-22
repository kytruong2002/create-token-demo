import { NATIVE_SYMBOL } from '@/config/chain'
import { useGlobalDataContext } from '@/contexts/globalData'
import { factoryContract } from '@/contracts'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import tokenService from '@/services/tokenService'
import { FlexCustom } from '@/utils/styles'
import { Button, Card, Col, Flex, Form, Input, Row, Tag, Upload, type FormProps, type UploadFile } from 'antd'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { formatEther, parseEther } from 'viem'
import { useBalance, usePublicClient, useWriteContract } from 'wagmi'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Decimal from 'decimal.js'
import { tokenSchema } from '@/schemas/tokenSchema'
import { FormatToken } from '@/components'

type FieldTokenType = {
  name?: string
  symbol?: string
  maxSupply?: number
  initialSupply?: number
  amountPerMint?: number
  mintFee?: number
  description?: string
  image?: UploadFile[]
}

const UploadCustom = styled(Upload)`
  .ant-upload.ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
  }
`

const Home = () => {
  document.title = 'Create Token'
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(tokenSchema)
  })
  const [feeGas, setFeeGas] = useState<bigint>(BigInt(0))
  const { address, checkNetwork } = useConnectWallet()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { data: balanceData } = useBalance({ address })
  const { setIsLoading } = useGlobalDataContext()
  const lastValuesRef = useRef<Partial<FieldTokenType>>({})

  const getStandardERC20 = (values: FieldTokenType) => {
    const { name, symbol, maxSupply, initialSupply, amountPerMint, mintFee } = values

    return {
      address: factoryContract.address as `0x${string}`,
      abi: factoryContract.abi,
      functionName: 'createStandardToken',
      args: [
        name,
        symbol,
        parseEther(initialSupply?.toString() || '0'),
        parseEther(maxSupply?.toString() || '0'),
        parseEther(amountPerMint?.toString() || '0'),
        parseEther(mintFee?.toString() || '0')
      ],
      account: address
    }
  }

  const getFeeGas = async (values: FieldTokenType) => {
    try {
      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const gasEstimated = (await publicClient?.estimateContractGas(getStandardERC20(values))) ?? BigInt(0)

      const gasPriceDecimal = new Decimal(gasPrice.toString())
      const gasEstimatedDecimal = new Decimal(gasEstimated.toString())
      const feeGasDecimal = gasPriceDecimal.times(gasEstimatedDecimal)
      setFeeGas(BigInt(feeGasDecimal.toFixed(0)))
    } catch (error) {
      console.error('Error estimating gas:', error)
    }
  }

  const onFinish: FormProps<FieldTokenType>['onFinish'] = async (values) => {
    if (!address) {
      toast.error('Please connect your wallet first.')
      return
    }

    const balance = balanceData?.value ?? BigInt(0)
    const balanceDecimal = new Decimal(balance.toString())
    const feeGasDecimal = new Decimal(feeGas.toString())
    if (balanceDecimal.lessThan(feeGasDecimal)) {
      toast.error(`Not enough ${NATIVE_SYMBOL}. You need ${formatEther(feeGas)}, but only have ${formatEther(balance)}`)
      return
    }

    if (!checkNetwork()) return
    try {
      setIsLoading(true)
      const hash = await writeContractAsync(getStandardERC20(values))

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: hash
      })

      if (receipt?.status === 'success') {
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
    } catch (error) {
      console.error('Error creating token:', error)
      toast.error('Create token failed!')
    } finally {
      setIsLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldsChange = (_: unknown, allFields: any[]) => {
    const values: Record<string, unknown> = {}
    allFields.forEach((field) => {
      values[field.name[0]] = field.value
    })

    const requiredFields: (keyof FieldTokenType)[] = [
      'name',
      'symbol',
      'maxSupply',
      'initialSupply',
      'amountPerMint',
      'mintFee'
    ]
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
    <>
      <Card title={'Create Token'.toLocaleUpperCase()} variant='borderless'>
        <Form
          name='createToken'
          onFinish={handleSubmit(onFinish)}
          onFieldsChange={handleFieldsChange}
          layout='vertical'
          form={form}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='name'
                name='name'
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
              >
                <Controller name='name' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='symbol'
                name='symbol'
                validateStatus={errors.symbol ? 'error' : ''}
                help={errors.symbol?.message}
              >
                <Controller name='symbol' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Max Supply'
                name='maxSupply'
                validateStatus={errors.maxSupply ? 'error' : ''}
                help={errors.maxSupply?.message}
              >
                <Controller name='maxSupply' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Initial Supply'
                name='initialSupply'
                validateStatus={errors.initialSupply ? 'error' : ''}
                help={errors.initialSupply?.message}
              >
                <Controller name='initialSupply' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Amount Per Mint'
                name='amountPerMint'
                validateStatus={errors.amountPerMint ? 'error' : ''}
                help={errors.amountPerMint?.message}
              >
                <Controller name='amountPerMint' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Mint Fee'
                name='mintFee'
                validateStatus={errors.mintFee ? 'error' : ''}
                help={errors.mintFee?.message}
              >
                <Controller name='mintFee' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='description'
                name='description'
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description?.message}
              >
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => <Input.TextArea {...field} rows={4} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label='Image'
                name='image'
                valuePropName='fileList'
                getValueFromEvent={(e) => {
                  const newFileList = Array.isArray(e) ? e : e?.fileList || []
                  setFileList(newFileList)
                  return newFileList
                }}
                rules={[{ required: true, message: 'Please upload a token image!' }]}
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
              <FormatToken token={formatEther(feeGas)} symbol={NATIVE_SYMBOL} />
            </Tag>
          </FlexCustom>
          <Flex justify='end'>
            <Button htmlType='submit' color='cyan' variant='solid' size='large'>
              Create
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  )
}

export default Home
