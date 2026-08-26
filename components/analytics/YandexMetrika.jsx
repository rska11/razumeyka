'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { METRIKA_ID as COUNTER_ID } from '@/lib/metrika';
import { CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/consent';

// Отслеживание переходов внутри SPA (клиентская навигация Next.js).
function MetrikaHits() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false; // первый хит уже отправлен в init
      return;
    }
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      window.ym(COUNTER_ID, 'hit', window.location.href);
    }
  }, [pathname, searchParams]);
  return null;
}

/**
 * Счётчик подключается ТОЛЬКО после явного согласия (см. lib/consent.ts).
 * До согласия в DOM нет ни тега Метрики, ни запроса к mc.yandex.ru —
 * именно это проверяют при контроле соблюдения 152-ФЗ.
 *
 * noscript-пикселя здесь сознательно нет: без JS согласие получить нечем,
 * а пиксель отправил бы визит в обход решения пользователя.
 */
export function YandexMetrika() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync(); // решение могло быть принято в прошлый визит
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}','ym');ym(${COUNTER_ID},'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <Suspense fallback={null}>
        <MetrikaHits />
      </Suspense>
    </>
  );
}
