import { projectLinks } from './project.interface'

export type annotations = {
  'kubectl.kubernetes.io/last-applied-configuration': string
  'oam.dev/kubevela-version': string
  version: string
}

export type labels = {
  'kustomize.toolkit.fluxcd.io/name'?: string
  'kustomize.toolkit.fluxcd.io/namespace'?: string
}

export type metadata = {
  creationTimestamp: string
  annotations: annotations
  labels: labels
}

export type status = {
  status: string
  healthy: boolean
  message: string
  event: string
}

export type window = {
  start: string
  end: string
}

export type costProperties = {
  cluster: string
  container: string
  controller: string
  controllerKind: string
  namespace: string
  node: string
  pod?: string
  providerID: string
}

export type cost = {
  [key: string]: any
}

export type application = {
  _type: string
  id: string
  name: string
  namespace: string
  description: string
  environment: string
  metadata: metadata
  cost?: cost
  status: status
  links: projectLinks[]
}
