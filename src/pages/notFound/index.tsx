import { PATH } from '@/utils/const'
import { Button, Flex, Result } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FlexCustom = styled(Flex)`
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
`

const NotFound = () => {
  return (
    <FlexCustom align='center' justify='center'>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Link to={PATH.HOME}>
            <Button type='primary'>Back Home</Button>
          </Link>
        }
      />
    </FlexCustom>
  )
}

export default NotFound
