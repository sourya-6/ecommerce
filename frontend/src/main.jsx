import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Layout from './Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { createBrowserRouter, Route } from 'react-router-dom'
import { createRoutesFromElements,  RouterProvider } from 'react-router-dom'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path='dashboard' element={<Dashboard />} />


        </Route>
    )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
