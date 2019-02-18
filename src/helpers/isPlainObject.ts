// eslint-disable-next-line
export const isPlainObject = (o: any): boolean => {
  return typeof o === 'object' && o.constructor === Object
}
