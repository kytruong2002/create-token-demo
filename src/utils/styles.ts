import { Typography } from 'antd'
import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
`

export const CustomParagraph = styled(Typography.Paragraph)`
  margin: 0 !important;
  color: inherit;

  .anticon.anticon-copy {
    color: rgb(19, 194, 194);
  }
`
