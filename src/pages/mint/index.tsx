import { wagmiConfig } from '@/config/wagmi'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import { CONTRACRT_ADDRESS } from '@/utils/const'
import { shortenAddress } from '@/utils/helpers'
import { CustomParagraph, FlexCustom } from '@/utils/styles'
import { Button, Card, Form, Tag } from 'antd'
import { toast } from 'react-toastify'
import { formatEther, formatUnits, type Abi } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { useBalance, usePublicClient, useReadContract, useWriteContract } from 'wagmi'
import { useConnectWallet } from '@/hooks/useConnectWallet'
import { useGlobalDataContext } from '@/contexts/globalData'
import Decimal from 'decimal.js'
import { NATIVE_SYMBOL } from '@/config/chain'
import { useERC20TokenInfo } from '@/hooks/useERC20TokenInfo'

const Mint = () => {
  document.title = 'Mint'
  const standardERC20 = {
    address: CONTRACRT_ADDRESS,
    abi: Standard_ERC20_ABI
  }
  const [form] = Form.useForm()
  const { setIsLoading } = useGlobalDataContext()
  const { checkNetwork } = useConnectWallet()
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    ...standardERC20,
    functionName: 'totalSupply'
  })
  const tokenInfo = useERC20TokenInfo({
    address: standardERC20.address,
    abi: standardERC20.abi as Abi
  })

  const { address } = useConnectWallet()
  const { data: balanceData } = useBalance({ address })
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()

  const getStandardERC20 = (fee: bigint) => {
    return {
      ...standardERC20,
      functionName: 'mint',
      value: fee,
      account: address
    }
  }

  const checkFeeGas = async (fee: bigint) => {
    try {
      const balance = balanceData?.value ?? BigInt(0)
      const balanceDecimal = new Decimal(balance.toString())
      if (balanceDecimal.lessThanOrEqualTo(new Decimal(0))) {
        toast.error(`Not enough ${NATIVE_SYMBOL}`)
        return false
      }
      const gasPrice = (await publicClient?.getGasPrice()) ?? BigInt(0)
      const gasEstimated = (await publicClient?.estimateContractGas(getStandardERC20(fee))) ?? BigInt(0)

      const gasPriceDecimal = new Decimal(gasPrice.toString())
      const gasEstimatedDecimal = new Decimal(gasEstimated.toString())
      const feeGasDecimal = gasPriceDecimal.times(gasEstimatedDecimal)

      const minFeeDecimal = new Decimal(fee.toString())
      const totalGasDecimal = feeGasDecimal.plus(minFeeDecimal)
      const totalGas = BigInt(totalGasDecimal.toFixed(0))

      if (balanceDecimal.lessThan(feeGasDecimal.times(minFeeDecimal))) {
        toast.error(
          `Not enough ${NATIVE_SYMBOL}. You need ${formatEther(totalGas)}, but only have ${formatEther(balance)}`
        )
        return false
      }
      return true
    } catch (error) {
      console.error('Error estimating gas:', error)
      return false
    }
  }

  const handleMint = async () => {
    if (
      typeof totalSupply === 'bigint' &&
      typeof tokenInfo?.maxSupply === 'bigint' &&
      typeof tokenInfo.amountPerMint === 'bigint' &&
      typeof tokenInfo.mintFee === 'bigint' &&
      checkNetwork()
    ) {
      const fee = BigInt(tokenInfo.mintFee)
      const isValid = await checkFeeGas(fee)
      if (!isValid) return

      const total = BigInt(totalSupply)
      const amount = BigInt(tokenInfo.amountPerMint)
      const max = BigInt(tokenInfo.maxSupply)

      const totalDecimal = new Decimal(total.toString())
      const amountDecimal = new Decimal(amount.toString())
      const maxDecimal = new Decimal(max.toString())

      if (totalDecimal.plus(amountDecimal).greaterThan(maxDecimal)) {
        toast.error('Total supply exceeded max supply')
        return
      }

      try {
        setIsLoading(true)
        const hash = await writeContractAsync({
          ...standardERC20,
          functionName: 'mint',
          value: fee
        })

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: hash
        })

        if (receipt.status === 'success') {
          toast.success('Mint transaction sent successfully!')
          await refetchTotalSupply()
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
            {tokenInfo && tokenInfo.name}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Symbol:</span>
          <Tag bordered={false} color='cyan'>
            {tokenInfo && tokenInfo.symbol}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Decimals:</span>
          <Tag bordered={false} color='cyan'>
            {tokenInfo && tokenInfo.decimals}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Total Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((totalSupply as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Max Supply:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.maxSupply as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Amount Per Mint:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.amountPerMint as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
        <FlexCustom justify='space-between' align='center' gap={10}>
          <span>Mint Fee:</span>
          <Tag bordered={false} color='cyan'>
            {formatUnits((tokenInfo?.mintFee as bigint) ?? BigInt(0), (tokenInfo?.decimals as number) ?? 18)}
          </Tag>
        </FlexCustom>
      </Card>
    </>
  )
}

export default Mint
