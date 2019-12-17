export default function isPlainObject(obj: any) {
  return obj && obj.constructor === {}.constructor
}
