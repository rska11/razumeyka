import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyEmailLoginCode } from "@/lib/email-code";
import { isAuthDisabled } from "@/lib/settings";
import { isAdminEmail } from "@/lib/admin";
import { isTeacherEmail } from "@/lib/staff";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      id: "email-code",
      name: "Email Code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const code = credentials?.code?.trim() ?? "";
        if (!email || !code) return null;

        // Рубильник: при выключенной авторизации вход разрешён только персоналу (админ/препод)
        if (await isAuthDisabled()) {
          const staff = isAdminEmail(email) || (await isTeacherEmail(email));
          if (!staff) return null;
        }

        const result = await verifyEmailLoginCode(email, code);
        if (!result.ok) return null;

        const user = await prisma.user.findUnique({
          where: { id: result.userId },
          select: { id: true, email: true, name: true, image: true, isBlocked: true },
        });
        if (!user || user.isBlocked) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id ?? token.sub ?? "",
        email: token.email ?? session.user?.email ?? null,
        name: token.name ?? session.user?.name ?? null,
        image: token.picture ?? session.user?.image ?? null,
      };
      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuthSession() {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;
  return session;
}

/** Сессия, если пользователь — админ (по ADMIN_EMAILS); иначе null. */
export async function getAdminSession() {
  const session = await getAuthSession();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) return null;
  return session;
}

/** Сессия, если пользователь — действующий преподаватель; иначе null. */
export async function getTeacherSession() {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;
  if (!(await isTeacherEmail(session.user.email))) return null;
  return session;
}
