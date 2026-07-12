import Image from "next/image";
import { readDrawingArtworks, weekLabel, type DrawingArtworkStatus, type DrawingArtworkWeek } from "@/lib/drawing-artworks";
import { moderateDrawingArtwork } from "./actions";

const STATUSES: Record<DrawingArtworkStatus, string> = {
  pending: "На модерации",
  approved: "Опубликовано",
  rejected: "Отклонено",
};

const STATUS_TONE: Record<DrawingArtworkStatus, string> = {
  pending: "bg-brand-orange/12 text-brand-orange",
  approved: "bg-brand-green/12 text-brand-green",
  rejected: "bg-ink/8 text-ink/48",
};

const WEEKS: DrawingArtworkWeek[] = ["week-1", "week-2", "week-3", "week-4", "final"];

function fmtDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminDrawingArtworksPage() {
  const artworks = await readDrawingArtworks();
  const pending = artworks.filter((item) => item.status === "pending").length;
  const approved = artworks.filter((item) => item.status === "approved").length;
  const rejected = artworks.filter((item) => item.status === "rejected").length;

  return (
    <div className="grid gap-6">
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-pink">Рисование</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Модерация работ учеников</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-ink/58">
              Одобренные работы автоматически появляются в публичной галерее. Топ недели строится по лайкам посетителей.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-brand-orange/10 px-4 py-3"><b className="block text-xl text-brand-orange">{pending}</b><span className="text-xs font-bold text-ink/52">ждут</span></div>
            <div className="rounded-2xl bg-brand-green/10 px-4 py-3"><b className="block text-xl text-brand-green">{approved}</b><span className="text-xs font-bold text-ink/52">в галерее</span></div>
            <div className="rounded-2xl bg-ink/5 px-4 py-3"><b className="block text-xl text-ink/58">{rejected}</b><span className="text-xs font-bold text-ink/52">отклонено</span></div>
          </div>
        </div>
      </section>

      {artworks.length === 0 && (
        <section className="rounded-[24px] border border-white/80 bg-white/85 p-8 text-center shadow-card">
          <h2 className="font-display text-2xl font-extrabold text-ink">Пока нет загруженных работ</h2>
          <p className="mt-2 text-sm font-semibold text-ink/54">Когда родитель отправит рисунок, он появится здесь в нужной неделе.</p>
        </section>
      )}

      {WEEKS.map((week) => {
        const items = artworks.filter((item) => item.week === week);
        if (items.length === 0) return null;

        return (
          <section key={week} className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-ink">{weekLabel(week)}</h2>
              <span className="rounded-full bg-ink/7 px-3 py-1 text-xs font-extrabold text-ink/58">{items.length} работ</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[20px] border border-ink/8 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-cream">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-extrabold text-ink">{item.title}</h3>
                        <p className="mt-1 text-xs font-bold text-ink/54">{item.child}, {item.city}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${STATUS_TONE[item.status]}`}>{STATUSES[item.status]}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-ink/48">
                      <span>{fmtDate(item.createdAt)}</span>
                      <span>{item.likes} лайков</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <form action={moderateDrawingArtwork}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className="rounded-full bg-brand-green px-4 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5">Одобрить</button>
                      </form>
                      <form action={moderateDrawingArtwork}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="rounded-full bg-ink/8 px-4 py-2 text-xs font-extrabold text-ink/62 transition hover:-translate-y-0.5">Отклонить</button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
