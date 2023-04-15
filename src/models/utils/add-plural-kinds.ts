import type { Schema } from "mongoose";
import mongoose from "mongoose";
import { Kind } from "../../graphql/codegen-server/schema-types";
import pluralize from "pluralize";
import { DeveloperError } from "../../utils/api-error";

const addPluralKinds = (schema: Schema, kind: Kind) => {
  schema.post("find", function (res) {
    const originalResult = res;
    const pluralKind = pluralize(kind.toString());

    res = {
      result: res,
    };

    if (Object.values(Kind).includes(pluralKind as Kind)) {
      res.kind = pluralKind as Kind;
    } else {
      throw new DeveloperError(
        `Schema pluralization for kind ${kind} failed (tried using '${pluralKind}'). Define plural exception for ${kind} with 'pluralize' that results in compatible pluralization.`
      );
    }

    // TODO find alternative for use of 'any' here
    return (mongoose as any).overwriteMiddlewareResult(res);
  });
};

export default addPluralKinds;
