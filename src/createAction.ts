import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Action, ActionInst, DataType } from './types'

export const createAction = (
  axiosInst: AxiosInstance,
  action: Action,
  id?: string | number,
  rootURI: string = '',
): ActionInst => (
  data?: DataType,
  localAxiosRequestConfig?: AxiosRequestConfig,
) => {
  const uri =
    typeof action.uri === 'function' ? action.uri(id, data) : action.uri

  const baseURL = uri ? `${rootURI}/${uri}` : rootURI

  const requestConfig: AxiosRequestConfig = {
    method: action.method,
    url: baseURL,
    ...action.axiosRequestConfig,
    ...localAxiosRequestConfig,
  }

  if (data && Object.keys(data).length) {
    requestConfig.data = data
  }

  return axiosInst.request(requestConfig)
}
