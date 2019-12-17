/**
 *
 * @param paths
 */
export function deconstructPath(paths: Array<string>) {
  const _paths: Array<string> = []

  paths.forEach(path => {
    let currentPath: string | null = null
    path.split('.').forEach(function(subpath) {
      currentPath = (currentPath ? currentPath + '.' : '') + subpath.trim()
      _paths.push(currentPath)
    })
  })

  return _paths
}

/**
 *
 * @param paths
 */
export function normalizePath(paths: Array<string>) {
  return paths
    .map(function(path) {
      return path.trim()
    })
    .filter(function(path) {
      return path !== ''
    })
    .filter(function(path, index, self) {
      return self.indexOf(path) === index
    }) // removes duplicates
}
