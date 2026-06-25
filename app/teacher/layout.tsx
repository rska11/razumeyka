import { redirect } from "next/navigation";
import { getTeacherSession } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton.jsx";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getTeacherSession();
  if (!session) {
    redirect("/login?callbackUrl=/teacher");
  }

  const name = session.user.name || session.user.email || "Преподаватель";

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold text-ink">Разумейка</span>
            <span className="rounded-full bg-brand-blue px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white">
              Преподаватель
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-bold text-ink/56 sm:inline">{name}</span>
            <LogoutButton className="rounded-full border border-ink/12 bg-white/78 px-4 py-2 text-sm font-extrabold text-ink/60 transition hover:border-brand-red/30 hover:text-brand-red" />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
