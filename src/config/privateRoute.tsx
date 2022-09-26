import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRoute({
  children
}: {
  children: ReactElement
}) {
  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" />
  }
  return children
}

export default PrivateRoute
