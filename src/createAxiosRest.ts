import { AxiosInstance } from 'axios'
import { createResource } from './createResource'
import { createAction } from './createAction'
import { AxiosRestConfig, AxiosRestInst } from './types'

export const createAxiosRest = <T extends AxiosRestConfig>(
  axiosInst: AxiosInstance,
  config: T,
): AxiosRestInst<T> => {
  const finalConfig = {
    idKey: 'id',
    ...config,
  }

  const { resources: resourcesConfig, actions: actionsConfig } = finalConfig

  // eslint-disable-next-line
  const api: AxiosRestInst<T> = {} as any

  if (resourcesConfig) {
    Object.keys(resourcesConfig).forEach(resourceName => {
      const resource = resourcesConfig[resourceName]
      // @ts-ignore
      api[resourceName] = createResource(axiosInst, resource, finalConfig)
    })
  }

  if (actionsConfig) {
    Object.keys(actionsConfig).forEach(actionName => {
      const action = actionsConfig[actionName]
      // @ts-ignore
      api[actionName] = createAction(axiosInst, action)
    })
  }

  return api
}
