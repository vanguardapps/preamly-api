import { Document } from "mongoose";
import { Kind } from "../../graphql/codegen-server/schema-types";

interface DocumentArray<DocType> {
  result: Document<DocType>[];
}

export interface DocumentArrayResult<DocType> extends DocumentArray<DocType> {
  kind: Kind;
}
