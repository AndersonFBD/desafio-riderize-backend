import jwt, { SignOptions } from "jsonwebtoken";
import { user } from "@prisma/client";

export interface tokenPayload {
  id: string;
  email: string;
}

interface jwtProperties {
  payload: tokenPayload;
  secret: string;
  options: SignOptions;
}

export function tokenGeneration(user: user): string {
  const secret = process.env.SECRET;
  const expiry = process.env.EXPIRY;
  if (!secret || !expiry)
    throw new Error("variáveis de ambiente não encontradas");
  const tokenprops: jwtProperties = {
    payload: {
      id: user.id,
      email: user.email,
    },
    secret: secret,
    options: { expiresIn: expiry as jwt.SignOptions["expiresIn"] },
  };

  return jwt.sign(tokenprops.payload, tokenprops.secret, tokenprops.options);
}

export function tokenReading(token: string) {
  const secret = process.env.SECRET;
  if (!secret) throw new Error("Variáveis de ambiente não encontradas");
  const decoded = jwt.verify(token, secret);
  if (typeof decoded !== "object" || !("id" in decoded))
    throw new Error("Token irregular");
  return decoded as tokenPayload;
}
