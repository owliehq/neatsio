export function Controller<T extends { new(...args: any[]): {} }>(constructor: T, controllerName: string) {
  return class extends constructor {
    name = controllerName
  }
}
