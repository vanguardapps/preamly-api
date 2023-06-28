import httpStatusCodes from './http-codes.js';
import { Kind } from '../graphql/codegen-server/schema-types.js';

// APIError class - used for all errors thrown in proprietary codebase
/** APIError - Base class for all API errors. Can be used on its own for non-HTTP situations. */
class APIError extends Error {
    constructor(error, details = {}) {
        if (typeof error === "string") {
            super(error);
        }
        else {
            super(error.message, { cause: error });
        }
        // Prevent overwriting of message after call to super()
        if (details === null || details === void 0 ? void 0 : details.message)
            delete details.message;
        // Assign all properties from details to this error object
        Object.assign(this, details);
        this.kind = Kind.APIError;
        this.name = Kind.APIError.toString();
    }
}
class AuthenticationError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.AuthenticationError;
        this.name = Kind.AuthenticationError.toString();
    }
    get status() {
        return httpStatusCodes.UNAUTHORIZED;
    }
}
class DatabaseError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.DatabaseError;
        this.name = Kind.DatabaseError.toString();
    }
    get status() {
        return httpStatusCodes.INTERNAL_SERVER;
    }
}
class DeveloperError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.DeveloperError;
        this.name = Kind.DeveloperError.toString();
    }
}
const convertToValidError = (error) => {
    if ((error === null || error === void 0 ? void 0 : error.kind) && Object.values(Kind).includes(error.kind)) {
        return error;
    }
    else {
        return new APIError(error);
    }
};

export { APIError, AuthenticationError, DatabaseError, DeveloperError, convertToValidError };
//# sourceMappingURL=api-error.js.map
