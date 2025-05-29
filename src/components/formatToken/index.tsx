import { Tooltip } from 'antd'

type FormatTokenProps = {
  token: number | string
  symbol?: string
}

const FormatToken = ({ token, symbol }: FormatTokenProps) => {
  const valueStr = token.toString()
  const [intPart, decimalPartRaw = ''] = valueStr.split('.')
  const trimmedDecimal = decimalPartRaw.replace(/0+$/, '').trim()

  if (trimmedDecimal.length <= 7) {
    if (trimmedDecimal.length <= 0) {
      return (
        <span>
          {`${intPart}.0`} {symbol}
        </span>
      )
    }

    return (
      <span>
        {valueStr} {symbol}
      </span>
    )
  }

  const firstNonZeroIndex = [...trimmedDecimal].findIndex((char) => char !== '0')
  if (firstNonZeroIndex > 3) {
    return (
      <Tooltip title={`${valueStr}`}>
        <span>
          {intPart}.0<sub style={{ fontSize: '0.8em' }}>{firstNonZeroIndex}</sub>
          {trimmedDecimal.slice(firstNonZeroIndex, firstNonZeroIndex + 4)} {symbol}
        </span>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={`${valueStr}`}>
      <span>
        {Number(token).toFixed(7).toString()} {symbol}
      </span>
    </Tooltip>
  )
}

export default FormatToken
