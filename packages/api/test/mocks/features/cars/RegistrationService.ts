import { Service } from '../../../../src'

@Service()
export class RegistrationService {
  getAvailableRegistration() {
    return ['AA-000-BB', 'CC-111-DD']
  }
}
