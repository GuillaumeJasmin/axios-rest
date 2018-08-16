// @flow

/**
  import replaceURLWithData from 'replaceURLWithData'
  replaceURLWithData(:id/xxx/:itemId, { id: '1', itemId: 2 });
*/

type DataType = {
  [key: string]: string | number,
}

type Output = {
  url: string,
  data: Object,
}

export default (
  url: string,
  data: DataType,
  removeUsedKey: boolean = false,
): Output => {
  const re = /:([a-zA-Z]*)/gi
  let match
  let outputURL = url
  const keys = Object.keys(data)
  do {
    match = re.exec(url)
    if (match) {
      const strToReplace = match[0]
      const dataKey = match[1]
      const value = data[dataKey]
      if (value === undefined || value === null) {
        throw new Error(
          `${dataKey} is not defined in\n${JSON.stringify(data, null, 4)}`,
        )
      }
      if (removeUsedKey) {
        const keyIndex = keys.findIndex(key => key === dataKey)
        keys.splice(keyIndex, 1)
      }

      outputURL = outputURL.replace(strToReplace, String(value))
    }
  } while (match)

  const outputData = {}
  keys.forEach(key => {
    outputData[key] = data[key]
  })

  return {
    url: outputURL,
    data: outputData,
  }
}
