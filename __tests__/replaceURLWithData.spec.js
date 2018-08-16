/* global describe, it, expect, global */

import replaceURLWithData from '../src/replaceURLWithData'

describe('replaceURLWithData', () => {
  it('should have correct URL', () => {
    const dataInput = {
      id: '2',
      name: 'Bob',
    }

    const { url } = replaceURLWithData('foo/:id/bar', dataInput)
    expect(url).toBe('foo/2/bar')
  })

  it('should have correct data when removeUsedKey = false', () => {
    const dataInput = {
      id: '2',
      name: 'Bob',
    }

    const { data } = replaceURLWithData('foo/:id/bar', dataInput)
    expect(data).toEqual(dataInput)
  })

  it('should have correct data when removeUsedKey = true', () => {
    const dataInput = {
      id: '2',
      name: 'Bob',
    }

    const { data } = replaceURLWithData('foo/:id/bar', dataInput, true)
    expect(data).toEqual({ name: 'Bob' })
  })

  it('should throw an error if data key is undefined', () => {
    const dataInput = {
      id: '2',
      name: 'Bob',
    }

    expect(() =>
      replaceURLWithData('foo/:badIdKey/bar', dataInput),
    ).toThrowError(
      `badIdKey is not defined in\n${JSON.stringify(dataInput, null, 4)}`,
    )
  })
})
