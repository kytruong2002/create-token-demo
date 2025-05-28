/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'urql'
import { Card, Table } from 'antd'
import { TOP_POOLS_QUERY } from '@/queries/tokens'
import { useGlobalDataContext } from '@/contexts/globalData'
import { useEffect } from 'react'

const ListPool = () => {
  const [result] = useQuery({ query: TOP_POOLS_QUERY })
  const { data, fetching } = result
  const { setIsLoading, title, setTitle } = useGlobalDataContext()

  useEffect(() => {
    setIsLoading(fetching)
    document.title = 'List Pool'
    setTitle(document.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, setTitle])

  const columns = [
    {
      title: 'First Token',
      render: (_: any, r: any) => r.token0.symbol
    },
    {
      title: 'Second Token',
      render: (_: any, r: any) => r.token1.symbol
    },
    {
      title: 'Volume (USD)',
      dataIndex: 'volumeUSD',
      render: (v: string) =>
        (+v).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
    },
    {
      title: 'TVL (USD)',
      dataIndex: 'totalValueLockedUSD',
      render: (v: string) =>
        (+v).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
    }
  ]

  return (
    <Card title={title.toLocaleUpperCase()} variant='borderless'>
      <Table dataSource={data?.pools || []} columns={columns} rowKey='id' pagination={false} />
    </Card>
  )
}

export default ListPool
