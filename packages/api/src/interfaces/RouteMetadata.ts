import { RequestHandler } from 'express'

export enum RouteMethod {
  GET,
  POST,
  PUT,
  DELETE
}

export interface RouteMetadata {
  path: string
  method: RouteMethod
  handler: RequestHandler
}
