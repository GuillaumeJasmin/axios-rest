import { DataTypeStr, DataType } from '../types'
import { isPlainObject } from './isPlainObject'

export const getDataType = (data: DataType): DataTypeStr => {
  const dataType = typeof data

  if (
    dataType === 'string' ||
    dataType === 'number' ||
    dataType === 'undefined'
  ) {
    return dataType
  }

  if (Array.isArray(data)) {
    return 'array'
  }

  if (isPlainObject(data)) {
    return 'object'
  }

  throw new Error('type not supported')
}
