import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { APIError } from "../utils/api-error";

export type Request = ExpressRequest;

export type Response = ExpressResponse;

export type RequestHandler = (
  req?: Request,
  res?: Response,
  next?: NextFunction,
  err?: APIError
) => any;

export type Middleware = (handler: RequestHandler) => RequestHandler;
