import { getUserbyEmail, getUserbyId } from "@/lib/data/user";
import { LoginSchema } from "@/lib/schema/auth-shema";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);

        if (!validateFields.success) {
          return null;
        }

        const { email, password } = validateFields.data;

        const user = await getUserbyEmail(email);
        if (!user || !password || !user.password) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          const { password, ...userWithoutPass } = user;
          return userWithoutPass;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const exstingUser = await getUserbyId(token.sub);
      if (!exstingUser) {
        return token;
      }
      token.id = exstingUser.Anggota?.noAnggota;
      token.role = exstingUser.role;
      token.name = exstingUser.Anggota?.nama;
      token.statusUser = exstingUser.statusUser;
      return token;
    },
    async session({ token, session }) {
      if (session?.user) {
        session.user.sub = token.sub;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.statusUser = token.statusUser;
      }
      return session;
    },
  },
};
