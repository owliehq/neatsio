import { Service } from '../../../../src/decorators/service.decorator'
import { Inject } from '../../../../src/di/Injector'
import { RegistrationService } from './RegistrationService'

@Service()
export class CarsService {
  @Inject private registrationService: RegistrationService

  private myCars: any[] = []

  addCars() {
    const registrations = this.registrationService.getAvailableRegistration()

    const cars = [
      { registration: registrations[0], name: 'Renault Mégane', userId: 1 },
      { registration: registrations[1], name: 'Land Rover Evoque', userId: 2 }
    ]

    this.myCars.push(...cars)
  }

  getCars() {
    return this.myCars
  }
}
