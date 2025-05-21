import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store, { persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import { GlobalDataProvider } from './contexts/globalData.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalDataProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GlobalDataProvider>
  </StrictMode>
)
