import { startServer } from './server'

console.log('==================')
console.log('Start debugging...')
console.log('==================')

startServer(3000).then(server => {
  console.log('==================')
  console.log('Server started on port 3000')
  console.log('==================')
})
