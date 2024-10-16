import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppBar, Typography } from '@mui/material';
import './index.css';
import App from './App';
import Login from './Login';
import Projects from './ProjectList';
import reportWebVitals from './reportWebVitals';
import Avatar from '@mui/material/Avatar';
import { lime, purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import Register from './Register';
import ProjectDetail from './ProjectDetails';
import TopicList from './TopicList'
import TopicView from './TopicView';


const theme = createTheme({
  palette: {
    primary: {
      main: '#303030'
    },
    secondary: purple,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "register",
    element: <Register />
  },
  {
    path: "projects",
    element: <Projects />
  },
  {
    path: "projects/:id",
    element: <ProjectDetail />
  },
  {
    path:"projects/:id/:cid",
    element:<TopicList />
  },
  {
    path:"projects/:id/:cid/:tid",
    element:<TopicView />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='Main'>
      <ThemeProvider theme={theme}>
      <AppBar position='static' color='primary' >
        <div className='AppBar'>
        <Typography variant='h4' className='Title'>
          Abhyasika
        </Typography>
        <Avatar className='right'>H</Avatar>
        </div>
      </AppBar>
      </ThemeProvider>
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
