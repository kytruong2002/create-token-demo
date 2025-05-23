import { Tooltip } from 'antd'

type FormatTokenProps = {
  token: number | string
  symbol?: string
}

const FormatToken = ({ token, symbol }: FormatTokenProps) => {
  const valueStr = typeof token === 'number' ? token.toFixed(18) : token.toString()
  const [intPart, decimalPartRaw = ''] = valueStr.split('.')

  const first8Digits = decimalPartRaw.slice(0, 8)
  const remainingDigits = decimalPartRaw.slice(8)

  const isTrailingZeroAfter8 = remainingDigits.split('').every((char) => char === '0')

  if (!decimalPartRaw || /^0+$/.test(decimalPartRaw)) {
    return (
      <Tooltip title={`${valueStr}`}>
        <span>
          {intPart}.0 {symbol}
        </span>
      </Tooltip>
    )
  }

  if (isTrailingZeroAfter8) {
    return (
      <Tooltip title={`${valueStr}`}>
        <span>
          {intPart}.{first8Digits} {symbol}
        </span>
      </Tooltip>
    )
  }

  const firstNonZeroIndex = [...decimalPartRaw].findIndex((char) => char !== '0')
  const subDigit = decimalPartRaw[firstNonZeroIndex]
  const rest = decimalPartRaw.slice(firstNonZeroIndex + 1, firstNonZeroIndex + 5)

  return (
    <Tooltip title={`${valueStr}`}>
      <span>
        {intPart}.0<sub style={{ fontSize: '0.8em' }}>{subDigit}</sub>
        {rest} {symbol}
      </span>
    </Tooltip>
  )
}

export default FormatToken
