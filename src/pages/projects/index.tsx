import { ComponentModal, Table } from 'components'
import useProject from 'hooks/useProject'
import { useEffect, useState } from 'react'
import { BsTable } from 'react-icons/bs'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom'
import { Project } from 'services/project.interface'

interface input {
  label: string
  placeholder: string
  type: string
  required: boolean
  disabled: boolean
  value?: string | null
  key: string
}
interface fieldSet {
  heading: string
  inputs: input[]
}
interface modalData {
  heading: string
  buttonText: string
  fieldSets: fieldSet[]
  type: string
}
const projectFieldSets: fieldSet[] = [
  {
    heading: 'Basic Configuration',
    inputs: [
      {
        disabled: false,
        label: 'Name',
        placeholder: 'Name',
        required: true,
        type: 'text',
        key: 'name'
      },
      {
        disabled: false,
        label: 'Cluster',
        placeholder: 'Cluster',
        required: true,
        type: 'text',
        key: 'cluster'
      },
      {
        disabled: false,
        label: 'Description',
        placeholder: 'Description',
        required: true,
        type: 'text',
        key: 'description'
      }
    ]
  }
]

const tableHead = ['Name', 'Application', 'Cost', 'Efficiency', 'Budget', '']
const tableKeys: string[] = ['name', 'apps', 'cost', 'effeciency', 'budget', 'link']

function Projects() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [tableBody, setTableBody] = useState<any[]>([])
  const [modalData, setModalData] = useState<modalData>({
    heading: '',
    buttonText: '',
    fieldSets: [
      {
        heading: '',
        inputs: [
          {
            disabled: false,
            label: '',
            placeholder: '',
            required: false,
            type: '',
            value: '',
            key: ''
          }
        ]
      }
    ],
    type: ''
  })
  const {
    getAllProjects,
    projects,
    loading,
    getProjectCumulativeCost,
  } = useProject()

  useEffect(() => {
    getAllProjects()
  }, [getAllProjects])
  useEffect(() => {
    getProjectCumulativeCost().then((data: any) => {
      if (projects) {
        const table = projects.reduce((acc: any[], curr: Project) => {
          const obj = {
            name: curr.name,
            apps: 3,
            cost: `$${data[curr.name].totalCost.toFixed(2)}`,
            effeciency: `${data[curr.name].totalEfficiency.toFixed(2)}%`,
            budget: '',
            link: <Link className="bg-blue-500 text-white px-4 py-2 rounded-sm" to={`/projects/${curr.id}`}>Details</Link>
          }
          acc.push(obj)
          return acc;
        }, [])
        setTableBody(table)
      }
    })
  }, [projects, getProjectCumulativeCost])

  return (
    <div className="main xs:p-4 tablet:p-10">
      {loading ? (
        <Skeleton
          count={2}
          inline
          className="w-48 h-7"
          containerClassName="flex justify-between my-3 text-xl font-medium"
        />
      ) : (
        <div className="flex items-center justify-between mb-5">
          <span className="text-xl font-medium">Projects</span>
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen)
              setModalData({
                heading: 'Create New Project',
                buttonText: 'Save',
                fieldSets: projectFieldSets,
                type: 'Project'
              })
            }}
            className="bg-blue-500 text-white rounded-md py-2.5 px-7"
          >
            Create Project
          </button>
        </div>
      )}
      {loading ? (
        <Skeleton height={340} />
      ) : (
        <div className="flex justify-between items-center xs:flex-col tablet:flex-row w-full py-3">
          <div className="flex w-full">
            <div className="w-full border border-gray-300 rounded-md my-2 px-4 py-3">
              <div className="w-full flex items-center pb-3">
                <BsTable size={24} />
                <span className="text-lg font-medium text-gray-800 px-4">
                  Projects
                </span>
              </div>
              <div>
                <div className="border-b border-gray-200 my-3 overflow-auto">
                  <Table tableHead={tableHead} tableBody={tableBody} tableKeys={tableKeys} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ComponentModal
        heading={modalData.heading}
        buttonText={modalData.buttonText}
        fieldSets={modalData.fieldSets}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        type={modalData.type}
        id=""
      />
    </div>
  )
}

export default Projects
