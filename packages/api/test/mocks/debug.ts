import { startServer } from './server'

console.log('==================')
console.log('Start debugging...')
console.log('==================')

startServer().then(server => {
  server.listen(3000, () => {
    console.log('==================')
    console.log('Server started on port 3000')
    console.log('==================')
  })
})
