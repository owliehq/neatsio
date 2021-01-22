import { Service } from '../../../../src'
import Customer from './Customer'

@Service()
export class CustomerService {
  async findByEmail(email: string) {
    return Customer.findOne({ where: { email } })
  }

  isJohn(customer: Customer) {
    return customer.firstname === 'John'
  }
}
