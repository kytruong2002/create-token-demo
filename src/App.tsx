import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './config/wagmi'
import { useGlobalDataContext } from './contexts/globalData'
import { Spin } from 'antd'
import { Provider } from 'urql'
import graphQLClient from './config/graphQL'

function App() {
  const { isLoading } = useGlobalDataContext()
  return (
    <Provider value={graphQLClient}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <BrowserRouter>
            <AppRouter />
            <ToastContainer
              position='top-left'
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme='light'
            />
          </BrowserRouter>
        </WagmiProvider>
      </QueryClientProvider>
      <Spin fullscreen size='large' spinning={isLoading} />
    </Provider>
  )
}

export default App
