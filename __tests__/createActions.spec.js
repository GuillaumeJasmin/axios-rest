/* global describe, it, expect, global */

import createAction from '../src/createAction'

const createAxiosInst = () => ({
  request: jest.fn(data => data),
})

describe('createAction', () => {
  it('should throw an error if action is undefined', () => {
    const action = createAction({}, { method: 'foo' })
    expect(() => action({})).toThrowError()
  })

  it('should return correct data', () => {
    const action = createAction(createAxiosInst(), {
      method: 'GET',
      uri: 'foo',
    })

    expect(action()).toEqual({
      data: {},
      method: 'get',
      url: '/foo',
    })
  })
})
