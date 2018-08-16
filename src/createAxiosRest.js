// @flow
import createResource from './createResource'
import createAction from './createAction'
import type { Config } from './types'

type Output = {
  [resourceAPI: string]: (
    resource: string | Object | Array<Object> | void,
  ) => {
    [methodName: string]: (param?: Object) => any, // not realy any, it can only be Promise or Function
  },
}

export const createAxiosRest = (axiosInst: Object, config: Config): Output => {
  const finalConfig = {
    idKey: 'id',
    ...config,
  }

  const { resources, actions } = finalConfig

  const api = {}

  if (resources) {
    Object.keys(resources).forEach(resourceName => {
      const resource = resources[resourceName]
      api[resourceName] = createResource(axiosInst, resource, finalConfig)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(actionName => {
      const action = actions[actionName]
      api[actionName] = createAction(axiosInst, action)
    })
  }

  return api
}
