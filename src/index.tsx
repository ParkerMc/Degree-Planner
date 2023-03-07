import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Dev from './pages/Dev'
import reportWebVitals from './reportWebVitals'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AdditionalInformation from './pages/AdditionalInformation'
import Home from './pages/Home'
import Print from './pages/Print'
import DegreePlan from './pages/DegreePlan'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/additionalInfo',
        element: <AdditionalInformation />,
    },
    {
        path: '/dev',
        element: <Dev />,
    },
    {
        path: '/print',
        element: <Print />,
    },
    {
        path: '/degreePlan',
        element: <DegreePlan />,
    },
])

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
