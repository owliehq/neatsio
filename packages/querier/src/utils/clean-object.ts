export const cleanObject = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') return cleanObject(obj[key])

    if (obj[key] === undefined) {
      delete obj[key]
      return
    }

    if (typeof obj[key] === 'string' && !obj[key].length) {
      delete obj[key]
      return
    }
  })

  return obj
}
