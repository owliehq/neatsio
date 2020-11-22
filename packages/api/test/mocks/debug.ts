import { startServer } from './server'

console.log('==================')
console.log('Start debugging...')
console.log('==================')

import CarsController from './features/cars/CarsController'

startServer().then(server => {
  server.listen(3000, () => {
    console.log('Server started on port 3000')
  })
})
