import Header from './pages/Header'
import { Outlet } from 'react-router-dom'
function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <div>Footer</div>  o

    </>

  )
}

export default Layout