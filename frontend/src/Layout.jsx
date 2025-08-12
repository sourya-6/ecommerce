import Header from './pages/Header'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Footer from './pages/Footer/Footer';

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
      <Footer />
    </>
  )
}

export default Layout;
