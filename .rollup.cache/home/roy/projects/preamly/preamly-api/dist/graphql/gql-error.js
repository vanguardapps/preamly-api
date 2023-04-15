// Converts an APIError into the Error type expected to by the
// GraphQL queries in schema.graphql
class GQLError {
    constructor(error) {
        var _a;
        this.message =
            process.env.PREAMLY_DEBUG_MODE === "true"
                ? (_a = error.stack) !== null && _a !== void 0 ? _a : error.message
                : `${error.kind}: ${error.message}`;
        this.kind = error.kind;
    }
}
export default GQLError;
//# sourceMappingURL=gql-error.js.map