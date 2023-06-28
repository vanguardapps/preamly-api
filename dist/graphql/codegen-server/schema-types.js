var Kind;
(function (Kind) {
    Kind["APIError"] = "APIError";
    Kind["AuthenticationError"] = "AuthenticationError";
    Kind["AuthorizationError"] = "AuthorizationError";
    Kind["DatabaseError"] = "DatabaseError";
    Kind["DeveloperError"] = "DeveloperError";
    Kind["SchemaError"] = "SchemaError";
    Kind["SignInResultSuccess"] = "SignInResultSuccess";
    Kind["User"] = "User";
    Kind["Users"] = "Users";
    Kind["ValidationError"] = "ValidationError";
})(Kind || (Kind = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (Role = {}));

export { Kind, Role };
//# sourceMappingURL=schema-types.js.map
