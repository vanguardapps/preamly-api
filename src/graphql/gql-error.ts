import { Kind, Error } from "./codegen-server/schema-types";
import { APIError } from "../utils/api-error";

// Converts an APIError into the Error type expected to by the
// GraphQL queries in schema.graphql

class GQLError implements Error {
  message: string;
  kind: Kind;

  constructor(error: APIError) {
    this.message =
      process.env.PREAMLY_DEBUG_MODE === "true"
        ? error.stack ?? error.message
        : `${error.kind}: ${error.message}`;
    this.kind = error.kind;
  }
}

export default GQLError;
