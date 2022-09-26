import { Authentication } from 'components'

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
    key: 'firstName',
    placeholder: 'First Name',
    required: true,
    type: 'text',
    value: ''
  },
  {
    disabled: false,
    key: 'lastName',
    placeholder: 'Last Name',
    required: true,
    type: 'text',
    value: ''
  },
  {
    disabled: false,
    key: 'email',
    placeholder: 'Email',
    required: true,
    type: 'email',
    value: ''
  },
  {
    disabled: false,
    key: 'password',
    placeholder: 'Password',
    required: true,
    type: 'password',
    value: ''
  },
  {
    disabled: false,
    key: 'confirmPassword',
    placeholder: 'Confirm Password',
    required: true,
    type: 'password',
    value: ''
  }
]

function SignUp() {
  return (
    <Authentication
      heading="Signup"
      buttonText="Signup"
      haveAccount={false}
      inputFields={inputFields}
    />
  )
}

export default SignUp
