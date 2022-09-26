import { ApplicationContextProvider } from 'context/ApplicationContext'
import { CatalogContextProvider } from 'context/CatalogContext'
import { ComponentContextProvider } from 'context/ComponentContext'
import { ProjectContextProvider } from 'context/ProjectContext'
import { Route, Routes } from 'react-router-dom'
import {
  ApplicationDetails,
  Catalog,
  CatalogApplication,
  ComponentDetails,
  Configuration, Groups, Home,
  Login, Permissions,
  ProjectDetails,
  Projects,
  Reports,
  SignUp,
  Users
} from '../pages'
import PrivateRoute from './privateRoute'

function AppRouter() {
  return (
    <Routes>
      <Route
        caseSensitive
        path="/"
        element={(
          <PrivateRoute>
            <ProjectContextProvider>
              <Home />
            </ProjectContextProvider>
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/reports"
        element={(
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/projects/:projectId"
        element={(
          <PrivateRoute>
            <ApplicationContextProvider>
              <ProjectContextProvider>
                <ProjectDetails />
              </ProjectContextProvider>
            </ApplicationContextProvider>
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/projects/:projectId/applications/:applicationId"
        element={(
          <PrivateRoute>
            <ProjectContextProvider>
              <ApplicationContextProvider>
                <ComponentContextProvider>
                  <ApplicationDetails />
                </ComponentContextProvider>
              </ApplicationContextProvider>
            </ProjectContextProvider>
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/projects/:projectId/applications/:applicationId/components/:componentId"
        element={(
          <PrivateRoute>
            <ProjectContextProvider>
              <ApplicationContextProvider>
                <ComponentContextProvider>
                  <ComponentDetails />
                </ComponentContextProvider>
              </ApplicationContextProvider>
            </ProjectContextProvider>
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/catalog/:catalogId"
        element={(
          <CatalogContextProvider>
            <PrivateRoute>
              <Catalog />
            </PrivateRoute>
          </CatalogContextProvider>
        )}
      />
      <Route
        caseSensitive
        path="/catalog/:catalogId/packages/:packageName/:version"
        element={(
          <CatalogContextProvider>
            <PrivateRoute>
              <CatalogApplication />
            </PrivateRoute>
          </CatalogContextProvider>
        )}
      />
      <Route
        caseSensitive
        path="/projects"
        element={(
          <PrivateRoute>
            <ProjectContextProvider>
              <Projects />
            </ProjectContextProvider>
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/users"
        element={(
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/groups"
        element={(
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/permissions"
        element={(
          <PrivateRoute>
            <Permissions />
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/configuration"
        element={(
          <PrivateRoute>
            <Configuration />
          </PrivateRoute>
        )}
      />
      <Route
        caseSensitive
        path="/login"
        element={<Login />}
      />
      <Route
        caseSensitive
        path="/signup"
        element={<SignUp />}
      />
    </Routes>
  )
}

export default AppRouter
