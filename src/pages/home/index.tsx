import { useGlobalDataContext } from '@/contexts/globalData'
import { Button, Card, Col, Flex, Form, Input, Row, Upload, type FormProps, type UploadFile } from 'antd'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { tokenSchema } from '@/schemas/tokenSchema'
import type { FieldTokenType } from '@/types/token'
import { useCreateToken } from '@/hooks/useCreateToken'

const UploadCustom = styled(Upload)`
  .ant-upload.ant-upload-select,
  .ant-upload-list-item-container {
    width: 100% !important;
  }
`

const Home = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(tokenSchema),
    defaultValues: {
      description: 'abc',
      name: 'ABToken',
      symbol: 'ABT',
      amountPerMint: 1000,
      initialSupply: 100000,
      maxSupply: 1000000,
      mintFee: 0
    }
  })

  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { setTitle, title } = useGlobalDataContext()
  const { handleCreateToken } = useCreateToken()

  useEffect(() => {
    document.title = 'Create Token'
    setTitle(document.title)
  }, [setTitle])

  const onFinish: FormProps<FieldTokenType>['onFinish'] = async (values) => {
    const isSuccess = await handleCreateToken({
      ...values,
      image: fileList
    })
    if (isSuccess) form.resetFields()
  }

  return (
    <>
      <Card title={title.toLocaleUpperCase()} variant='borderless'>
        <Form name='createToken' onFinish={handleSubmit(onFinish)} layout='vertical' form={form}>
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Name'
                name='name'
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
                required
              >
                <Controller name='name' control={control} render={({ field }) => <Input {...field} />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item<FieldTokenType>
                label='Symbol'
                name='symbol'
                validateStatus={errors.symbol ? 'error' : ''}
                help={errors.symbol?.message}
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
