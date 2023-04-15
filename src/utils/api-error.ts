// APIError class - used for all errors thrown in proprietary codebase

import httpStatusCodes from "./http-codes";
import { Kind } from "../graphql/codegen-server/schema-types";

type ErrorDetails = object & { message?: string };

/** APIError - Base class for all API errors. Can be used on its own for non-HTTP situations. */
export class APIError extends Error {
  kind: Kind;

  constructor(error: string | Error, details: ErrorDetails = {}) {
    if (typeof error === "string") {
      super(error);
    } else {
      super(error.message, { cause: error });
    }

    // Prevent overwriting of message after call to super()
    if (details?.message) delete details.message;

    // Assign all properties from details to this error object
    Object.assign(this, details);

    this.kind = Kind.APIError;
    this.name = Kind.APIError.toString();
  }
}

// USAGE: Derive a class for each individual error type as needed and provide 'status'
//        and any other relevant details. See existing types for examples.

export class TestingError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.name = "TestingError";
    // Not assigning this.kind because TestingError is of kind APIError
  }
}

export class AuthenticationError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.kind = Kind.AuthenticationError;
    this.name = Kind.AuthenticationError.toString();
  }

  get status() {
    return httpStatusCodes.UNAUTHORIZED;
  }
}

export class ValidationError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.kind = Kind.ValidationError;
    this.name = Kind.ValidationError.toString();
  }

  get status() {
    return httpStatusCodes.BAD_REQUEST;
  }
}

export class SchemaError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.kind = Kind.SchemaError;
    this.name = Kind.SchemaError.toString();
  }
}

export class DatabaseError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.kind = Kind.DatabaseError;
    this.name = Kind.DatabaseError.toString();
  }

  get status() {
    return httpStatusCodes.INTERNAL_SERVER;
  }
}

export class DeveloperError extends APIError {
  constructor(error: string | Error, details: ErrorDetails = {}) {
    super(error, details);
    this.kind = Kind.DeveloperError;
    this.name = Kind.DeveloperError.toString();
  }
}

export const convertToValidError = (
  error: Error & { kind?: Kind }
): APIError => {
  if (error?.kind && Object.values(Kind).includes(error.kind)) {
    return error as APIError;
  } else {
    return new APIError(error);
  }
};
