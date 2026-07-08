'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { METRIKA_ID as COUNTER_ID } from '@/lib/metrika';

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

export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}','ym');ym(${COUNTER_ID},'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <Suspense fallback={null}>
        <MetrikaHits />
      </Suspense>
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${COUNTER_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  );
}
