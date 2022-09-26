import Editor from '@monaco-editor/react'
import useApplication from 'hooks/useApplication'
import useComponent from 'hooks/useComponent'
import useProject from 'hooks/useProject'
import {
    ChangeEvent, FormEvent, useEffect, useState
} from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'
import YAML from 'yaml'
import './style.css'

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
interface ComponentModalProps {
  setIsOpen: CallableFunction
  isOpen: boolean
  buttonText: string
  heading: string
  fieldSets: fieldSet[]
  type: string
  id: string | undefined
  isYaml?: boolean
}
interface form {
  [key: string]: any
}

function ComponentModal({
  heading,
  setIsOpen,
  isOpen,
  buttonText,
  fieldSets,
  type,
  id,
  isYaml = false
}: ComponentModalProps) {
  const [form, setForm] = useState<form>({})

  const { getComponentById } = useComponent()
  const { getApplicationById, application } = useApplication()
  const { getProjectById } = useProject()

  // const getUpdatedObject = (appData: form = {}) => {
  //   let obj: any = {}
  //   fieldSets.reduce((acc, curr) => {
  //     const updatedFields = curr.inputs.reduce((inpAcc: any, inpCurr) => {
  //       const inpCurrArr = inpCurr.key.split('/')
  //       if (inpCurrArr.length === 1) {
  //         for (let i = 0; i < inpCurrArr.length; i++) {
  //           if (form[inpCurrArr[i]]) {
  //             obj = {
  //               ...obj,
  //               [inpCurrArr[i]]: form[inpCurrArr[i]]
  //             }
  //           }
  //         }
  //       } else {
  //         for (let i = 0; i < inpCurrArr.length - 1; i++) {
  //           if (inpCurrArr[i] && inpCurrArr[i - 1] && inpCurrArr[inpCurrArr.length - 1]) {
  //             if (form[inpCurr.key]) {
  //               obj = {
  //                 ...obj,
  //                 [inpCurrArr[i - 1]]: {
  //                   ...appData[inpCurrArr[i - 1]],
  //                   ...obj[inpCurrArr[i - 1]],
  //                   [inpCurrArr[i]]: {
  //                     ...(appData[inpCurrArr[i - 1]] || {})[inpCurrArr[i]],
  //                     ...(obj[inpCurrArr[i - 1]] || {})[inpCurrArr[i]],
  //                     [inpCurrArr[inpCurrArr.length - 1]]: form[inpCurr.key]
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       if (JSON.stringify(obj) !== '{}') {
  //         inpAcc = obj;
  //       }
  //       return inpAcc
  //     }, {})
  //     if (JSON.stringify(updatedFields) !== '{}') {
  //       acc = updatedFields;
  //     }
  //     return acc
  //   }, {})
  //   return obj
  // }

  const changeYaml = () => {
    // const proj = data.find((x) => x.name === projectName)
    // const app = proj?.applications.find((x) => x.uid === applicationId)
    // const appIndex = proj?.applications.indexOf(app as any)
    // const doc = YAML.parse(e)
    // proj?.applications.splice(appIndex as number, 1, doc as any)
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (type.toLowerCase() === 'component') {
      // data.map((curr: Project) => {
      //   const app: application | undefined = curr.applications.find(
      //     (x) => x.uid === applicationId
      //   )
      //   app?.components?.push({
      //     name: form.name,
      //     type: form.type,
      //     properties: {
      //       domain: form.domain,
      //       http: form.http,
      //       port: form.port as any,
      //       properties: form.properties,
      //       replicas: form.replicas as any,
      //       image: '',
      //       type: ''
      //     }
      //   })
      //   return app
      // })
    } else if (type.toLowerCase() === 'update component') {
      // const project = data.find((x) => x.applications.find((x) => x.components))
      // const application = project?.applications.find((x) => x.components)
      // const comp = application?.components.find((x) => x.name === id)
      // const compIndex = application?.components.indexOf(comp as any)
      // application?.components.splice(compIndex as number, 1, {
      //   ...comp, ...getUpdatedObject(comp)
      // } as any)
    } else if (type.toLowerCase() === 'project') {
      // data.push({
      //   id: 2,
      //   name: form.name,
      //   cluster: form.cluster,
      //   description: form.description,
      //   applications: []
      // })
    } else if (type.toLowerCase() === 'update project') {
      // const project = data.find((x) => x.name === id)
      // const projIndex = data.indexOf(project as any)
      // data.splice(projIndex as number, 1, { ...project, ...getUpdatedObject(project) } as any)
    } else if (type.toLowerCase() === 'application') {
      // const proj = data.find((x) => x.name === projectName)
      // proj?.applications.push({
      //   id: '2',
      //   name: form.name,
      //   color: '',
      //   namespace: form.namespace,
      //   resourceVersion: form.resourceVersion,
      //   metadata: {
      //     annotations: {
      //       description: form.description,
      //       version: form.version,
      //       'oam.dev/kubevela-version': ''
      //     },
      //     creationTimestamp: new Date().toISOString(),
      //     labels: {
      //       'kustomize.toolkit.fluxcd.io/name': '',
      //       'kustomize.toolkit.fluxcd.io/namespace': ''
      //     }
      //   },
      //   components: [],
      //   status: {
      //     action: '',
      //     healthy: false,
      //     message: '',
      //     status: ''
      //   },
      //   uid: uuidv4()
      // })
    } else if (type.toLowerCase() === 'update application') {
      // const proj = data.find((x) => x.name === projectName)
      // const app = proj?.applications.find((x) => x.uid === id)
      // const appIndex = proj?.applications.indexOf(app as any)
      // proj?.applications.splice(appIndex as number, 1, {
      // ...app, ...getUpdatedObject(app)
      // } as any)
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (type.toLowerCase() === 'update component') {
      getComponentById(id)
    } else if (type.toLowerCase() === 'update project') {
      getProjectById(id)
    } else if (type.toLowerCase() === 'update application') {
      getApplicationById(id)
    }
  }, [type, getComponentById, getProjectById, getApplicationById, id])

  return (
    <div>
      <div
        className={`sidebar-modal bg-white fixed top-0 z-10 -right-full xs:w-full tablet:w-98 ${
          isOpen ? 'active' : ''
        }`}
      >
        <div className="flex justify-between items-center p-3">
          <p className="text-lg font-medium">{heading}</p>
          <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <RiCloseCircleLine size={24} className="text-blue-500" />
          </div>
        </div>
        <form
          onSubmit={submit}
          className="flex flex-wrap justify-between w-full px-3 py-5"
        >
          {fieldSets.map((fieldset: fieldSet, index: number) => (
            <div
              key={fieldset.heading}
              className={`border border-gray-400 rounded flex flex-col justify-between w-full p-3 ${
                (index + 1) % 2 === 0 && 'my-5'
              }`}
            >
              <p className="text-base text-gray-600 font-medium pb-2">
                {fieldset.heading}
              </p>
              <div className="flex justify-between flex-wrap">
                {fieldset.inputs.map((input: input) => (
                  <div
                    key={input.label}
                    className="flex flex-col xs:w-full tablet:w-2/7"
                  >
                    <label
                      className="text-gray-500 font-normal"
                      htmlFor={input.label}
                    >
                      {input.label}
                      :
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setForm({
                            ...form,
                            [input.key]: e.target.value
                          })
                        }}
                        id={`${input.label}-${id}`}
                        type={input.type}
                        value={
                          (form && form[input.key] !== undefined
                            ? form[input.key]
                            : input.value?.toString()) ?? ''
                        }
                        className="border border-gray-300 rounded p-3 mt-0.5 mb-3 h-12 w-full focus-visible:outline-none focus:border-blue-500 focus:border"
                        placeholder={input.placeholder}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {
          isYaml && (
          <Editor
            defaultLanguage="yaml"
            height="500px"
            language="yaml"
            theme="vs-dark"
            defaultValue={YAML.stringify(application)}
            onChange={changeYaml}
          />
          )
          }
          <div className="flex flex-col items-end w-full pt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md py-2.5 px-7"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
      <div
        className={`sidebar-overlay fixed top-0 right-0 w-full h-full opacity-0 ${
          isOpen ? 'active' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  )
}

export default ComponentModal
