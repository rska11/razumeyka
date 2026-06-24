import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold text-ink">Разумейка</span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white">Админ</span>
          </div>
          <nav className="flex items-center gap-2 text-sm font-extrabold">
            <Link href="/cabinet" className="rounded-full border border-ink/12 bg-white/78 px-4 py-2 text-ink transition hover:bg-white">Кабинет</Link>
            <Link href="/" className="rounded-full border border-ink/12 bg-white/78 px-4 py-2 text-ink transition hover:bg-white">На сайт</Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
