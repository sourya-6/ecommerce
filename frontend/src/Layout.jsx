import Header from './pages/Header'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Layout() {
  const { loadingAuth } = useSelector((state) => state.user);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
      <div>Footer</div>  
    </>
  )
}

export default Layout;
