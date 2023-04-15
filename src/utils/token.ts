import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let options: SignOptions;

try {
  options = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../keys/jwt-options.json"), "utf8")
  );
} catch (err: any) {
  if (err.code === "ENOENT") {
    throw new Error("JWT options file not found");
  } else {
    throw err;
  }
}

export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

export interface TokenPayload {
  userId: string;
  email: string;
  type: TokenType;
  roles: string[];
}

export const generateToken = (payload: TokenPayload) => {
  if (!(payload?.userId && payload?.email && payload?.type && payload?.roles)) {
    throw new Error("Invalid token payload.");
  }

  let keyFile;

  if (payload.type === TokenType.ACCESS) {
    keyFile = process.env.JWT_ACCESS_PRIVATE_KEYFILE;
  } else if (payload.type === TokenType.REFRESH) {
    keyFile = process.env.JWT_REFRESH_PRIVATE_KEYFILE;
  } else {
    throw new Error("Invalid token type.");
  }

  try {
    const key = fs.readFileSync(path.join(__dirname, `../../keys/${keyFile}`));

    return jwt.sign(payload, key, options);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error("JWT access private key file not found");
    }
    throw err;
  }
};

export const verifyToken = (token: string, payload: TokenPayload) => {
  return true;
};
