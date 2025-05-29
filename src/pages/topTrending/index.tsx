/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'urql'
import { Card, Table } from 'antd'
import { TOP_TRENDING_QUERY } from '@/queries/tokens'
import { useGlobalDataContext } from '@/contexts/globalData'
import { useEffect } from 'react'

const TopTrending = () => {
  const [result] = useQuery({
    query: TOP_TRENDING_QUERY,
    variables: {
      networkId: ['bsc', 'base'],
      rankings: [
        {
          attribute: 'trendingScore24',
          direction: 'DESC'
        }
      ],
      limit: 10
    }
  })
  const { data, fetching } = result
  const { setIsLoading, title, setTitle } = useGlobalDataContext()

  useEffect(() => {
    setIsLoading(fetching)
    document.title = 'Top Trending Tokens'
    setTitle(document.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, setTitle])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Name',
      render: (_: any, data: any) => data?.token?.name
    },
    {
      title: 'Symbol',
      render: (_: any, data: any) => data?.token?.symbol
    },
    {
      title: 'Volume 24h',
      dataIndex: 'volume24',
      render: (v: string) =>
        (+v).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
    },
    {
      title: 'Price USD',
      dataIndex: 'priceUSD',
      render: (v: string) =>
        (+v).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
    }
  ]

  return (
    <Card title={title.toLocaleUpperCase()} variant='borderless'>
      <Table
        dataSource={data?.filterTokens?.results || []}
        columns={columns}
        rowKey={(record) => `${record.token.address}:${record.token.networkId}`}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  )
}

export default TopTrending
