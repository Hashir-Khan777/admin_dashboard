import { AuthContextProvider } from 'context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './config/router'
import Layout from './layout'

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthContextProvider>
    </Router>
  )
}

export default App
