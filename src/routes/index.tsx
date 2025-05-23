import { Home, ListToken, Login, Mint, NotFound } from '@/pages'
import Default from '@/templates/default'
import Form from '@/templates/form'
import { PATH } from '@/utils/const'
import { Route, Routes } from 'react-router-dom'

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path={PATH.HOME} element={<Default />}>
          <Route index element={<Home />} />
          <Route path={PATH.MINT} element={<Mint />} />
          <Route path={PATH.LIST_TOKEN} element={<ListToken />} />
        </Route>
        <Route path={PATH.HOME} element={<Form />}>
          <Route path={PATH.LOGIN} element={<Login />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default AppRouter
