import { cost, status } from './application.interface'

export type componentProperties = {
  image?: string
  port?: number
}

export type traitPropertiesHTTP = {
  '/': number
}

export type traitProperties = {
  replicas?: number
  domain?: string
  http?: traitPropertiesHTTP
}

export type trait = {
  properties: traitProperties
  type: string
}

export type component = {
  _type: string
  componentType: string
  id: string
  name: string
  properties: componentProperties
  traits?: trait[]
  status: status
  cost?: cost
}
