import { RequestHandler } from 'express'

export enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface RouteMetadata {
  path: string
  method: RouteMethod
  requestHandler?: boolean
  handler: RequestHandler
}

export interface MiddlewareMetadata {
  middleware: RequestHandler
}
