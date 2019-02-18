import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Action, ActionInst, DataType } from './types'
import { getDataType } from './helpers'
import { replaceURLWithData } from './helpers/replaceURLWithData'

export const createAction = (
  axiosInst: AxiosInstance,
  action: Action,
  rootURI: string = '',
): ActionInst => (
  data?: DataType,
  localAxiosRequestConfig?: AxiosRequestConfig,
) => {
  const baseURL = action.uri ? `${rootURI}/${action.uri}` : rootURI

  const dataType = getDataType(data)

  let replacedData: {
    data: {
      // eslint-disable-next-line
      [key: string]: any
    }
    url: string
  }

  if (dataType === 'object') {
    const dataAsObject = data as {}
    replacedData = replaceURLWithData(baseURL, dataAsObject, true)
  } else if (['string', 'number', 'undefined'].indexOf(dataType) !== -1) {
    const dataAsStringNumberUndefined = data as string | number
    replacedData = replaceURLWithData(
      baseURL,
      { __DATA__: dataAsStringNumberUndefined },
      true,
    )
    if ('__DATA__' in replacedData.data) {
      // eslint-disable-next-line
      delete replacedData.data.__DATA__
    }
  }

  const requestConfig: AxiosRequestConfig = {
    method: action.method,
    url: replacedData.url,
    ...action.axiosRequestConfig,
    ...localAxiosRequestConfig,
  }

  if (Object.keys(replacedData.data).length) {
    requestConfig.data = replacedData.data
  }

  return axiosInst.request(requestConfig)
}
