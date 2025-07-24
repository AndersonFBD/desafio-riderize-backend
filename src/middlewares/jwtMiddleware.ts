import jwt, { SignOptions } from "jsonwebtoken";
import { user } from "@prisma/client";

interface jwtProperties {
  payload: object;
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
