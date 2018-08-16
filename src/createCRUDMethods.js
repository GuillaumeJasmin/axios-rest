// @flow
import { isPlainObject } from 'lodash'

export const CRUDActions = ['fetch', 'create', 'update', 'delete']

type CRUDFunctions = {
  fetchOne: Function,
  fetchAll: Function,
  create: Function,
  update: Function,
  delete: Function,
}

export const createCRUDMethods = ({
  fetchAll,
  fetchOne,
  create,
  update,
  delete: deleteAction,
}: CRUDFunctions) => {
  const resourceFactory = (data: any) => {
    let output = {}

    const invalidAction = actionName => () => {
      throw new Error(
        `axios-rest: ${actionName}(params) is not available with the following params: ${JSON.stringify(
          data,
        )}`,
      )
    }

    // first, we define all methods as invalid, and they will be overrided if they are valid
    CRUDActions.forEach((actionName: string) => {
      output[actionName] = invalidAction(actionName)
    })

    if ([undefined, null].includes(data)) {
      output = {
        ...output,
        fetch: (...config: any) => fetchAll(data, ...config),
      }
    } else if (['string', 'number'].includes(typeof data)) {
      output = {
        ...output,
        delete: (...config: any) => deleteAction(data, ...config),
        fetch: (...config: any) => fetchOne(data, ...config),
      }
    } else if (isPlainObject(data)) {
      output = {
        ...output,
        create: (...config: any) => create(data, ...config),
        update: (...config: any) => update(data, ...config),
      }
    } else if (Array.isArray(data)) {
      output = {
        ...output,
        create: (...config: any) => create(data, ...config),
        update: (...config: any) => update(data, ...config),
        delete: (...config: any) => deleteAction(data, ...config),
      }
    } else {
      // data has a bad type
      throw new Error(
        `axios-rest: error, param is invalid\n\n${JSON.stringify(
          data,
          null,
          4,
        )}`,
      )
    }

    return output
  }

  return resourceFactory
}
