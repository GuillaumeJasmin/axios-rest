import { getDataType } from '../../src/helpers'

describe('getDataType', () => {
  it('should return string', () => {
    expect(getDataType('hey')).toEqual('string')
  })

  it('should return number', () => {
    expect(getDataType(2)).toEqual('number')
  })

  it('should return object', () => {
    expect(getDataType({})).toEqual('object')
  })

  it('should return array', () => {
    expect(getDataType([])).toEqual('array')
  })

  it('should return undefined', () => {
    let data
    expect(getDataType(data)).toEqual('undefined')
  })

  it('should throw', () => {
    expect(() => getDataType(Symbol('') as any)).toThrow('type not supported')
  })
})
