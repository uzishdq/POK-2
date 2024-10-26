import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      sub: string | null | undefined;
      id: string | null | undefined;
      name: string | null | undefined;
      email: string | null | undefined;
      role: string;
      statusUser: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
    statusUser: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string | undefined;
    role: string;
    statusUser: string;
  }
}
