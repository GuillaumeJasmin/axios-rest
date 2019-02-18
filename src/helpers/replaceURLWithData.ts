/**
 * demo:
 * replaceURLWithData(:id/xxx/:itemId, { id: '1', itemId: 2 });
 */

interface DataType {
  [key: string]: string | number
}

interface Output {
  url: string
  data: {
    [key: string]: string | number | object
  }
}

export const replaceURLWithData = (
  url: string,
  data: DataType,
  removeUsedKey: boolean = false,
): Output => {
  const re = /:\??([a-zA-Z_]*)/gi
  let match
  let outputURL = url
  const keys = Object.keys(data)
  do {
    match = re.exec(url)
    if (match) {
      const strToReplace = match[0]
      const dataKey = match[1]
      const isOptionnal = strToReplace[1] === '?'
      let value = data[dataKey]
      if (value === undefined) {
        if (!isOptionnal) {
          throw new Error(
            `${dataKey} is not defined in\n${JSON.stringify(data, null, 4)}`,
          )
        }

        value = ''
      }

      if (removeUsedKey) {
        // @ts-ignore
        const keyIndex = keys.findIndex(key => key === dataKey)
        keys.splice(keyIndex, 1)
      }

      outputURL = outputURL.replace(strToReplace, String(value))
    }
  } while (match)

  const outputData: Output['data'] = {}

  keys.forEach(key => {
    outputData[key] = data[key]
  })

  if (outputURL[outputURL.length - 1] === '/') {
    outputURL = outputURL.slice(0, outputURL.length - 1)
  }

  return {
    url: outputURL,
    data: outputData,
  }
}
