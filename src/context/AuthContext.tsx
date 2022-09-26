import {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface form {
  username: string
  password: string
}

interface AuthContextType {
  user: form
  loginUser: CallableFunction
  authenticated: boolean
  logout: CallableFunction
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthContextProvider({ children }: { children: ReactElement }) {
  const [user, setUser] = useState<any>()
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  const loginUser = useCallback(
    async (form: form) => {
      try {
        // const { data } = await Axios.post(
        //   `${process.env.REACT_APP_AUTH_BASE_URL}/auth/login`,
        //   form
        // )
        navigate('/', { replace: true })
        localStorage.setItem('user', JSON.stringify(form))
        toast.success('Logged In!')
        setUser(form)
        setAuthenticated(true)
      } catch (err: any) {
        const error = err?.response && err?.response?.data?.Message
          ? err?.response?.data?.Message
          : err.message
        toast.error(`${error}`)
      }
    },
    [setUser, navigate, setAuthenticated]
  )

  const logout = useCallback(() => {
    localStorage.clear()
    setAuthenticated(false)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setAuthenticated(true)
    }
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      authenticated,
      loginUser,
      logout
    }),
    [user, loginUser, authenticated, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  )
}

export default AuthContext
