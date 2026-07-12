import '../drawing.css';
import { Header } from '@/components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';
import { DrawingGallery } from '@/components/drawing/DrawingGallery.jsx';

export const metadata = {
  title: 'Галерея работ учеников по рисованию — Разумейка',
  description: 'Одобренные рисунки учеников, недельные итоги, лайки посетителей и загрузка свободной работы на модерацию.',
  alternates: { canonical: '/risovanie/galereya' },
};

export default function DrawingGalleryPage() {
  return (
    <>
      <Header />
      <main className="drawing-page min-h-screen">
        <DrawingGallery />
      </main>
      <Footer />
    </>
  );
}
