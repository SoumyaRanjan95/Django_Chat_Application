import React, { useContext } from 'react';
import {createRoot} from "react-dom/client"
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router';


import App from './App';


import GlobalProvider from './store';
import { GlobalContext } from './store';

const root = createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path:"chat/",
    element:<App/>,
  }
])


root.render(
  <GlobalProvider>
    <RouterProvider router={router}/>
  </GlobalProvider>
);

