import { AxiosRequestConfig, AxiosPromise } from 'axios'

export type DataTypeStr = 'string' | 'number' | 'undefined' | 'object' | 'array'
export type DataType =
  | string
  | number
  | undefined
  | object
  | string[]
  | number[]
  | object[]

export type ResourceID = string | number

// type URI = string | ((id?: ID, data?: DataType) => string)

export type ActionConfig =
  | ((id: ResourceID, data?: AxiosRequestConfig['data']) => AxiosRequestConfig)
  | AxiosRequestConfig

export interface ListActionsConfig {
  [actionName: string]: ActionConfig
}

export interface ResourceConfig {
  url: string
  resources?: ListResourcesConfig
  actions?: ListActionsConfig
}

export interface ListResourcesConfig {
  [resourceName: string]: ResourceConfig
}

export interface AxiosRestConfig {
  resources?: ListResourcesConfig
  actions?: ListActionsConfig
  globalResourceActions?: ListActionsConfig
  idKey?: string
}

export interface ActionInst {
  (axiosRequestConfig?: AxiosRequestConfig): AxiosPromise
}

export type ResourceInst<
  R extends ResourceConfig,
  C extends AxiosRestConfig
> = (
  id?: ResourceID,
) => ListResourcesInst<R['resources'], C> &
  ListActionsInst<R['actions']> &
  ListActionsInst<C['globalResourceActions']>

export type ListResourcesInst<
  R extends ListResourcesConfig,
  C extends AxiosRestConfig
> = { [X in keyof R]: ResourceInst<R[X], C> }

export type ListActionsInst<A extends ListActionsConfig> = {
  [X in keyof A]: ActionInst
}

export type AxiosRestInst<Config extends AxiosRestConfig> = ListResourcesInst<
  Config['resources'],
  Config
> &
  ListActionsInst<Config['actions']>
