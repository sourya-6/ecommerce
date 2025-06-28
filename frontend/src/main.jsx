// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import {store} from './store/store.js'
// // import App from './App.jsx'
// import './index.css'

// import Home from './pages/Home.jsx'
// import Login from './pages/Login.jsx'
// import Layout from './Layout.jsx'
// import Dashboard from './pages/Dashboard.jsx'
// import { createBrowserRouter, Route } from 'react-router-dom'
// import { createRoutesFromElements,  RouterProvider } from 'react-router-dom'

// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route path='/' element={<Layout />}>
//           <Route path='' element={<Home />} />
//           <Route path="login" element={<Login />} />
//           <Route path='dashboard' element={<Dashboard />} />


//         </Route>
//     )
// )

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
   
//   </StrictMode>,
// )

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import {store} from './store/store.js'
// // import App from './App.jsx'
// import './index.css'

// import Home from './pages/Home.jsx'
// import Login from './pages/Login.jsx'
// import Layout from './Layout.jsx'
// import Dashboard from './pages/Dashboard.jsx'
// import { createBrowserRouter, Route } from 'react-router-dom'
// import { createRoutesFromElements,  RouterProvider } from 'react-router-dom'
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import { StrictMode } from 'react'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { createRoot } from 'react-dom/client'
import { ProtectedRoute, PublicRoute, AppRoutes } from "./AppRoutes.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      
      {/* Public routes (e.g. Login) */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoutes /> {/* dispatches fetchCurrentUser on mount */}
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
