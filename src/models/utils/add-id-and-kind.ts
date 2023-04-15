import type { Schema, Document, Types } from "mongoose";
import { Kind, Node } from "../../graphql/codegen-server/schema-types";

export type NodeWithMongoId = Node & { _id?: Types.ObjectId | string };

export type SchemaWithOptions = Schema & {
  options: {
    toJSON: { transform: (doc: Document, ret: NodeWithMongoId) => void };
  };
};

const addIdAndKind = (schema: SchemaWithOptions, kind: Kind) => {
  const previousTransform = schema.options.toJSON.transform;

  schema.options.toJSON.transform = (doc: Document, ret: NodeWithMongoId) => {
    if (ret && !ret?.kind) {
      ret.kind = kind;
    }

    if (ret && !ret?.id && ret?._id) {
      ret.id = ret._id.toString();
    }
    previousTransform(doc, ret);
  };
};

export default addIdAndKind;
