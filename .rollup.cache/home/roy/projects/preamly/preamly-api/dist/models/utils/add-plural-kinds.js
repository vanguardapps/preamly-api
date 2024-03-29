import mongoose from "mongoose";
import { Kind } from "../../graphql/codegen-server/schema-types";
import pluralize from "pluralize";
import { DeveloperError } from "../../utils/api-error";
const addPluralKinds = (schema, kind) => {
    schema.post("find", function (res) {
        const originalResult = res;
        const pluralKind = pluralize(kind.toString());
        res = {
            result: res,
        };
        if (Object.values(Kind).includes(pluralKind)) {
            res.kind = pluralKind;
        }
        else {
            throw new DeveloperError(`Schema pluralization for kind ${kind} failed (tried using '${pluralKind}'). Define plural exception for ${kind} with 'pluralize' that results in compatible pluralization.`);
        }
        // TODO find alternative for use of 'any' here
        return mongoose.overwriteMiddlewareResult(res);
    });
};
export default addPluralKinds;
//# sourceMappingURL=add-plural-kinds.js.map