import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { isTeacherEmail } from "@/lib/staff";
import { isAuthDisabled } from "@/lib/settings";
import { CabinetNav } from "@/components/cabinet/CabinetNav.jsx";

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/cabinet");
  }

  // Преподаватель — в свой кабинет
  if (await isTeacherEmail(session.user.email)) {
    redirect("/teacher");
  }

  const admin = isAdminEmail(session.user.email);
  // На время доработок (рубильник): кабинет доступен только админам
  if ((await isAuthDisabled()) && !admin) {
    redirect("/");
  }

  const displayName = session.user.name || session.user.email || "Родитель";

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[268px_1fr] lg:py-10">
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-color backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold text-ink">Разумейка</span>
            </Link>
            <p className="mt-1 text-xs font-bold text-ink/46">Личный кабинет</p>

            <div className="mt-5 flex items-center gap-3 rounded-[16px] bg-ink/[0.03] px-3 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-base font-black text-white">
                {displayName.slice(0, 1).toUpperCase()}
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
