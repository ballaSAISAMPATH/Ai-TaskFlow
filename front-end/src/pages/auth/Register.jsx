import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const navigate = useNavigate()
  return (
    <div>
      This is Register Page
    <Button onClick={()=>{navigate('/auth/login')}}>Signin</Button>

    </div>
  )
}

export default Register
