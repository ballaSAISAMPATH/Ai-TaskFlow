import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
const Login = () => {
    const navigate = useNavigate()
  return (
    <div>
     this is a login Page
     <Button onClick={()=>{navigate('/auth/register')}}>Sigup</Button>
    </div>
  )
}

export default Login
