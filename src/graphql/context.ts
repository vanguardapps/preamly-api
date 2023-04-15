import { Error } from "./codegen-server/schema-types";

export interface GQLContext {
  userId: string | null;
  roles: string[] | null;
  error: Error | null;
}
