import { useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

interface input {
  placeholder: string
  type: string
  required: boolean
  disabled: boolean
  value?: string | null
  key: string
}

interface AuthenticationProps {
  heading: string
  buttonText: string
  haveAccount: boolean
  inputFields: input[]
  submit?: CallableFunction
}

interface form {
  [key: string]: string
}

function Authentication({
  heading,
  buttonText,
  haveAccount,
  inputFields,
  submit
}: AuthenticationProps) {
  const [form, setForm] = useState<form>({
    password: '',
    username: ''
  })

  return (
    <div className="h-screen flex flex-col justify-center items-center xs:px-3 tablet:px-0 login overflow-hidden bg-gray-50">
      <div className="large:w-3/8 desktop:w-2/10 xs:w-full phone:w-2/3 tablet:w-2/4 flex flex-col justify-center items-center xs:px-7 p-10 shadow-4xl rounded-lg relative bg-white z-20">
        <h1 className="text-5xl font-semibold from-neutral-800 pb-8 text-gray-600">
          {heading}
        </h1>
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault()
            if (submit) {
              submit(form)
            }
          }}
        >
          {inputFields.map((input: input) => (
            <div key={input.key} className="pb-2 text-gray-500">
              <input
                className="border border-gray-300 rounded p-3 mt-0.5 mb-3 h-12 w-full focus-visible:outline-none focus:border-blue-500 focus:border"
                type={input.type}
                placeholder={input.placeholder}
                required={input.required}
                onChange={(e) => {
                  setForm({
                    ...form,
                    [input.key]: e.target.value
                  })
                }}
                disabled={input.disabled}
                value={
                  (form && form[input.key] !== undefined
                    ? form[input.key]
                    : input.value?.toString()) ?? ''
                }
              />
            </div>
          ))}
          <div className="flex justify-center items-center mt-5">
            <button
              type="submit"
              className="bg-blue-500 text-white font-medium rounded-md py-2.5 px-7 w-full"
            >
              {buttonText}
            </button>
          </div>
          {haveAccount ? (
            <div className="flex justify-center w-full pt-8">
              <span>Don&apos;t have an Account?</span>
              <Link
                to="/signup"
                className="text-blue-500 font-semibold px-2 hover:underline cursor-pointer"
              >
                SIGNUP
              </Link>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full pt-8">
              <span>Already have an Account?</span>
              <Link
                to="/login"
                className="text-blue-500 font-semibold px-2 hover:underline cursor-pointer"
              >
                LOGIN
              </Link>
            </div>
          )}
        </form>
      </div>
      <div className="shape-bottom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L60,213.3C120,203,240,181,360,165.3C480,149,600,139,720,149.3C840,160,960,192,1080,202.7C1200,213,1320,203,1380,197.3L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>
    </div>
  )
}

export default Authentication
