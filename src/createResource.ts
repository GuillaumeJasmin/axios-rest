import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { createAction } from './createAction'
import { Resource, Actions, AxiosRestConfig, ResourceInst } from './types'
import { getDataType } from './helpers'
import { getDefaultResourcesActions } from './getDefaultResourcesActions'

export const createResource = (
  axiosInst: AxiosInstance,
  resource: Resource,
  actionRestConfig: AxiosRestConfig,
  rootURI: string = '',
): ResourceInst => {
  const fullResourceURI = `${rootURI}/${resource.uri}`

  const resourcesActions: Actions = {
    ...getDefaultResourcesActions(actionRestConfig),
    ...actionRestConfig.defaultResourcesActions,
    ...resource.actions,
  }

  // eslint-disable-next-line
  return (data: any) => {
    const dataType = getDataType(data)

    const invalidAction = (actionName: string): Function => (): never => {
      throw new Error(
        `axios-rest: ${actionName}(data) is not available with the following data: ${JSON.stringify(
          data,
        )}`,
      )
    }

    // eslint-disable-next-line
    const output: any = {}

    Object.entries(resourcesActions).forEach(([actionName, action]) => {
      output[actionName] = invalidAction(actionName)

      const { allowDataType } = action

      if (!allowDataType || allowDataType.indexOf(dataType) !== -1) {
        output[actionName] = (localAxiosRequestConfig?: AxiosRequestConfig) =>
          createAction(axiosInst, action, fullResourceURI)(
            data,
            localAxiosRequestConfig,
          )
      }
    })

    if (
      resource.resources &&
      (dataType === 'string' || dataType === 'number')
    ) {
      Object.entries(resource.resources).forEach(
        ([resourceName, subResource]) => {
          output[resourceName] = createResource(
            axiosInst,
            subResource,
            actionRestConfig,
            `${fullResourceURI}/${data}`,
          )
        },
      )
    }

    return output
  }
}
