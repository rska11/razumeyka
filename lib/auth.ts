import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import CredentialsProvider from "next-auth/providers/credentials";
import YandexProvider from "next-auth/providers/yandex";
import { prisma } from "@/lib/prisma";
import { verifyEmailLoginCode } from "@/lib/email-code";
import { isAuthDisabled } from "@/lib/settings";
import { isAdminEmail } from "@/lib/admin";
import { isTeacherEmail } from "@/lib/staff";
import { isRussianEmail } from "@/lib/ru-email";

// Согласие на обработку ПД (152-ФЗ). Галочка на /login обязательна для входа;
// факт ПЕРВОГО согласия фиксируем в User.pdConsentAt (повторные входы дату не перезаписывают).
// Для входа через Яндекс согласие передаётся короткоживущей cookie (ставится кликом по кнопке).
export const PD_CONSENT_COOKIE = "rzm_pd_consent";

/** Проставить дату согласия на обработку ПД, если её ещё нет (первое согласие). */
async function stampPdConsent(userId: string) {
  await prisma.user.updateMany({
    where: { id: userId, pdConsentAt: null },
    data: { pdConsentAt: new Date() },
  });
}

/** Есть ли consent-cookie в текущем запросе (вход через Яндекс). */
async function hasPdConsentCookie(): Promise<boolean> {
  try {
    const jar = await cookies();
    return jar.get(PD_CONSENT_COOKIE)?.value === "1";
  } catch {
    // вне request-контекста cookie недоступны — считаем, что согласия нет
    return false;
  }
}

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
        consent: { label: "Consent", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const code = credentials?.code?.trim() ?? "";
        if (!email || !code) return null;

        // Без согласия на обработку ПД вход невозможен (галочка на /login)
        if (credentials?.consent !== "true") return null;

        // Рубильник: при выключенной авторизации вход разрешён только персоналу (админ/препод)
        if (await isAuthDisabled()) {
          const staff = isAdminEmail(email) || (await isTeacherEmail(email));
          if (!staff) return null;
        }

        // Закон РФ: вход только с российской почты (исключение — админ)
        if (!isRussianEmail(email) && !isAdminEmail(email)) return null;

        const result = await verifyEmailLoginCode(email, code);
        if (!result.ok) return null;

        const user = await prisma.user.findUnique({
          where: { id: result.userId },
          select: { id: true, email: true, name: true, image: true, isBlocked: true },
        });
        if (!user || user.isBlocked) return null;

        // Фиксируем первое согласие на обработку ПД
        await stampPdConsent(user.id);

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID ?? "",
      clientSecret: process.env.YANDEX_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "login:email login:info" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Яндекс ID: не пускаем заблокированных и не пускаем без согласия на обработку ПД
      if (account?.provider === "yandex") {
        const email = user.email?.toLowerCase();
        if (!email) return false;
        // Согласие ставится cookie кликом по кнопке «Войти через Яндекс» на /login
        if (!(await hasPdConsentCookie())) return false;
        // Рубильник: при выключенной авторизации пускаем только персонал
        if (await isAuthDisabled()) {
          const staff = isAdminEmail(email) || (await isTeacherEmail(email));
          if (!staff) return false;
        }
        const existing = await prisma.user.findUnique({
          where: { email },
          select: { isBlocked: true },
        });
        if (existing?.isBlocked) return false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture ?? null;
      }
      // Яндекс ID: находим/создаём пользователя в нашей БД и ставим НАШ id
      if (account?.provider === "yandex" && token.email) {
        const email = token.email.toLowerCase();
        const dbUser = await prisma.user.upsert({
          where: { email },
          update: { name: token.name ?? undefined, provider: "yandex" },
          create: { email, name: token.name ?? null, provider: "yandex" },
        });
        token.id = dbUser.id;
        // Согласие подтверждено cookie (без неё signIn-callback вход не пропустил бы)
        await stampPdConsent(dbUser.id);
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
