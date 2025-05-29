/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'urql'
import { Card, Table } from 'antd'
import { TOP_TRENDING_QUERY } from '@/queries/tokens'
import { useGlobalDataContext } from '@/contexts/globalData'
import { useEffect } from 'react'

const TopTrending = () => {
  const [result] = useQuery({ query: TOP_TRENDING_QUERY })
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
      dataIndex: 'name'
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol'
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
      title: 'TX Count',
      dataIndex: 'txCount'
    }
  ]

  return (
    <Card title={title.toLocaleUpperCase()} variant='borderless'>
      <Table
        dataSource={data?.tokens || []}
        columns={columns}
        rowKey='id'
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  )
}

export default TopTrending
