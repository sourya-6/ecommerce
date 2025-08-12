import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { ProtectedRoute, PublicRoute, AppRoutes } from "./AppRoutes.jsx";
import {Home,Login,Dashboard,Account,ResetPassword,Cart,ProductDetails,Order} from "./pages"

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Layout />}>
// //       <Route index element={<Home />} />
// //       <Route path="product/:id" element={<ProductDetails />} />
      
// //       {/* Public routes (e.g. Login) */}
// //       <Route element={<PublicRoute />}>
// //         <Route path="login" element={<Login />} />
        

// //       </Route>
      
// //       {/* Protected routes */}
// //       <Route element={<ProtectedRoute />}>
// //         <Route path="dashboard" element={<Dashboard />} />
// //         <Route path="account" element={<Account />} />
// //         <Route path="/reset-password" element={<ResetPassword />} />
// //         <Route path="/cart" element={<Cart />} />
        

// //         {/* <Route path="products" element={<ProductList />} />
// //         <Route path="products/add" element={<AddProduct />} /> */}
// //       </Route>
// //     </Route>
// //   )
// // );
// // createRoot(document.getElementById("root")).render(
// //   // <StrictMode>
// //     <Provider store={store}>
// //       <AppRoutes /> {/* dispatches fetchCurrentUser on mount */}
// //       <RouterProvider router={router} />
// //     </Provider>
// //   //</StrictMode>
// // );

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/product/:id",
        element: <ProductDetails />
      },
      {
        path: "/orders",
        element: <Order />
      }
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <Provider store={store}>
    <AppRoutes /> {/* dispatches fetchCurrentUser on mount */}
    <RouterProvider router={router} />
  </Provider>
</React.StrictMode>

)
