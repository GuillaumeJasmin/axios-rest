import { createAction } from '../src/createAction'

const createAxiosInst = () => ({
  request: (data: any) => data,
})

describe('createAction', () => {
  it('should throw an error if action is undefined', () => {
    // @ts-ignore
    const action = createAction({}, { method: 'foo' })
    expect(() => action({})).toThrow()
  })

  it('should return correct data', () => {
    const action = createAction(createAxiosInst() as any, {
      method: 'get',
      uri: 'foo',
    })

    expect(action()).toEqual({
      method: 'get',
      url: '/foo',
    })
  })
})
