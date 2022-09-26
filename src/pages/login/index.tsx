import { Authentication } from 'components'
import useAuth from 'hooks/useAuth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface input {
  placeholder: string
  type: string
  required: boolean
  disabled: boolean
  value?: string | null
  key: string
}

const inputFields: input[] = [
  {
    disabled: false,
    key: 'username',
    placeholder: 'Username',
    required: true,
    type: 'text',
    value: ''
  },
  {
    disabled: false,
    key: 'password',
    placeholder: 'Password',
    required: true,
    type: 'password',
    value: ''
  }
]

function Login() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <Authentication
      heading="Login"
      buttonText="Login"
      haveAccount
      inputFields={inputFields}
      submit={loginUser}
    />
  )
}

export default Login
