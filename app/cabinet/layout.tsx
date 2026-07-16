import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { isAuthDisabled } from "@/lib/settings";
import { CabinetNav } from "@/components/cabinet/CabinetNav.jsx";

export const metadata = { robots: { index: false, follow: false } };

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/cabinet");
  }

  const admin = isAdminEmail(session.user.email);
  // На время доработок (рубильник): кабинет доступен только админам
  if ((await isAuthDisabled()) && !admin) {
    redirect("/");
  }

  const displayName = session.user.name?.trim() || "Родитель";
  const avatarLetter = (session.user.name || session.user.email || "Р").slice(0, 1).toUpperCase();

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[268px_1fr] lg:py-10">
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-[26px] border border-white/80 bg-white/88 p-5 shadow-color backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-gradient-to-br from-brand-blue via-brand-purple to-brand-pink text-sm font-black text-white shadow-sm">Р</span>
              <span className="font-display text-xl font-extrabold tracking-[-0.025em] text-ink">Разумейка</span>
            </Link>
            <p className="mt-1 text-xs font-bold text-ink/46">Личный кабинет</p>

            <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-ink/5 bg-gradient-to-br from-white to-brand-blue/[0.04] px-3 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-brand-blue text-base font-black text-white shadow-sm">
                {avatarLetter}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold text-ink">{displayName}</span>
                <span className="block truncate text-xs font-bold text-ink/46">{session.user.email}</span>
              </span>
            </div>

            <CabinetNav isAdmin={admin} />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
