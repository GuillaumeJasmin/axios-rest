import { AxiosInstance } from 'axios'
import { createResource } from './createResource'
import { createAction } from './createAction'
import { AxiosRestConfig, AxiosRestInst } from './types'

export const createAxiosRest = (
  axiosInst: AxiosInstance,
  config: AxiosRestConfig,
): AxiosRestInst => {
  const finalConfig = {
    idKey: 'id',
    ...config,
  }

  const { resources: resourcesConfig, actions: actionsConfig } = finalConfig

  const api: AxiosRestInst = {}

  if (resourcesConfig) {
    Object.keys(resourcesConfig).forEach(resourceName => {
      const resource = resourcesConfig[resourceName]
      api[resourceName] = createResource(axiosInst, resource, finalConfig)
    })
  }

  if (actionsConfig) {
    Object.keys(actionsConfig).forEach(actionName => {
      const action = actionsConfig[actionName]
      api[actionName] = createAction(axiosInst, action)
    })
  }

  return api
}
