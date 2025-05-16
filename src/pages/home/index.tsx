import Default from '@/templates/default'
import { Button, Card, Col, Flex, Form, Input, Row, Upload, type FormProps } from 'antd'
import styled from 'styled-components'

type FieldTokenType = {
  name?: string
  symbol?: string
  maxSupply?: string
  initialSupply?: string
  amountPerMint?: string
  mintFee?: string
  description?: string
  image?: File[]
}

const CardCustom = styled(Card)`
  width: 60%;
  margin-top: 20px;
`

const Home = () => {
  const initValueFormToken: FieldTokenType = {
    name: '',
    symbol: '',
    maxSupply: '',
    initialSupply: '',
    amountPerMint: '',
    mintFee: '',
    description: ''
  }

  const onFinish: FormProps<FieldTokenType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const checkValueNumber = (value: string) => {
    if (isNaN(Number(value))) {
      return Promise.reject('Value must be a number')
    }
    if (Number(value) <= 0) {
      return Promise.reject('Value must be greater than 0')
    }
    return Promise.resolve()
  }

  return (
    <Default title='Home Page'>
      <Flex align='center' justify='center'>
        <CardCustom title='Create Token' variant='borderless'>
          <Form name='createToken' initialValues={initValueFormToken} onFinish={onFinish} layout='vertical'>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='name'
                  name='name'
                  rules={[{ required: true, message: 'Please input a token name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='symbol'
                  name='symbol'
                  rules={[
                    { required: true, message: 'Please input a token symbol!' },
                    {
                      pattern: /^[A-Z]{1,10}$/,
                      message: 'Symbol must be 1-10 uppercase letters (A-Z)'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='maxSupply'
                  name='maxSupply'
                  rules={[
                    { required: true, message: 'Please input a token maxSupply!' },
                    {
                      validator: (_, value) => checkValueNumber(value)
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='initialSupply'
                  name='initialSupply'
                  rules={[
                    { required: true, message: 'Please input a token initialSupply!' },
                    {
                      validator: (_, value) => checkValueNumber(value)
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='amountPerMint'
                  name='amountPerMint'
                  rules={[
                    { required: true, message: 'Please input a token amountPerMint!' },
                    {
                      validator: (_, value) => checkValueNumber(value)
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='mintFee'
                  name='mintFee'
                  rules={[
                    { required: true, message: 'Please input a token mintFee!' },
                    {
                      validator: (_, value) => checkValueNumber(value)
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTokenType>
                  label='description'
                  name='description'
                  rules={[{ required: true, message: 'Please input a token description!' }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Image'
                  name='image'
                  valuePropName='fileList'
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e
                    return e?.fileList
                  }}
                  rules={[{ required: true, message: 'Please upload a token image!' }]}
                  style={{ width: '100%' }}
                >
                  <Upload
                    style={{ width: '100%' }}
                    name='image'
                    listType='picture-card'
                    accept='image/*'
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    <div>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Flex justify='end'>
              <Button htmlType='submit' color='cyan' variant='solid' size='large'>
                Create
              </Button>
            </Flex>
          </Form>
        </CardCustom>
      </Flex>
    </Default>
  )
}

export default Home
