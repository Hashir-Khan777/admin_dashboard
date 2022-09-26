import ProjectContext from 'context/ProjectContext'
import { useContext } from 'react'

function useProject() {
  return useContext(ProjectContext)
}

export default useProject
