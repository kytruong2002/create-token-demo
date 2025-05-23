import { useGlobalDataContext } from '@/contexts/globalData'
import Standard_ERC20_ABI from '@/contracts/abi/standardERC20'
import tokenService from '@/services/tokenService'
import type { PaginationType } from '@/types/api'
import { BE_URL, LIMIT, PATH } from '@/utils/const'
import { Avatar, Card, Table, type TablePaginationConfig, type TableProps } from 'antd'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePublicClient } from 'wagmi'

interface TokenTableType {
  key: string
  name: string
  image: string
  supply: string
  mintProgress: string
  tokenAddress: string
}

const LinkCustom = styled(Link)`
  color: #13c2c2;
  :hover {
    color: #13c2c2;
  }
`

const ListToken = () => {
  const [paginationData, setPaginationData] = useState<PaginationType>()
  const [listToken, setListToken] = useState<TokenTableType[]>([])
  const { setIsLoading } = useGlobalDataContext()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const publicClient = usePublicClient()
  const getAllTokens = async (page?: number) => {
    try {
      setIsLoading(true)
      const { data, pagination } = await tokenService.getAll({ page, limit: LIMIT })
      setPaginationData(pagination)
      const list: TokenTableType[] = []
      for (const token of data) {
        const balance = (await publicClient?.getBalance({ address: token.tokenAddress as `0x${string}` })) ?? BigInt(0)
        const balanceDecimal = new Decimal(balance?.toString())
        const maxSupplyDecimal = new Decimal(token.maxSupply)
        const totalSupply =
          ((await publicClient?.readContract({
            address: token.tokenAddress as `0x${string}`,
            abi: Standard_ERC20_ABI,
            functionName: 'totalSupply'
          })) as bigint) ?? BigInt(0)
        const totalSupplyDecimal = new Decimal(totalSupply.toString())
        const tokenData: TokenTableType = {
          key: token._id as string,
          image: BE_URL + token.image,
          name: token.name,
          tokenAddress: token.tokenAddress,
          mintProgress: totalSupplyDecimal.div(maxSupplyDecimal).mul(100).toFixed(2) + ' %',
          supply: balanceDecimal.div(maxSupplyDecimal).mul(100).toFixed(2) + ' %'
        }
        list.push(tokenData)
      }
      setListToken(list)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const columns: TableProps<TokenTableType>['columns'] = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <Avatar size={64} src={text} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '% of Supply',
      dataIndex: 'supply',
      key: 'supply'
    },
    {
      title: 'Mint Progress',
      dataIndex: 'mintProgress',
      key: 'mintProgress'
    },
    {
      title: 'Detail',
      key: 'action',
      render: (_, record) => <LinkCustom to={PATH.MINT.replace(':contract', record.tokenAddress)}>View</LinkCustom>
    }
  ]

  useEffect(() => {
    document.title = 'List Token'
    getAllTokens(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current ?? 1)
  }
  return (
    <Card title={'List Token'.toLocaleUpperCase()} variant='borderless' style={{ marginBottom: 20 }}>
      <Table<TokenTableType>
        columns={columns}
        dataSource={listToken}
        pagination={{ pageSize: paginationData?.total, current: currentPage }}
        onChange={handleTableChange}
      />
    </Card>
  )
}

export default ListToken
