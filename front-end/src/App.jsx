import React from 'react'
import {Button} from './components/ui/button'
import { Routes } from 'react-router-dom'
import AuthLayout from './components/Auth/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
        <Routes>
            <Route path='/auth' element={<AuthLayout/>}>
                <Route path='login' element={<Login/>} />
                <Route path='register' element={<Register/>}/>
            </Route>

        </Routes>
    </div>
  )
}

export default App
