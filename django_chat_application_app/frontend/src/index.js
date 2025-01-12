import React from 'react';
import {createRoot} from "react-dom/client"
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';


import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

const root = createRoot(document.getElementById('root'));

const isAuthenticated = true;



const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
  },
  {
    path:"login/",
    element:<Login/>,
  },
  {
    path:"register/",
    element:<Register/>,
  },
  {
    path:"chat/",
    element:isAuthenticated ?(<Chat/>):(<p>This is a protected route</p>),
  }
])


root.render(
    <RouterProvider router={router}/>
);

