"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot?: string;
  label?: string;
  className?: string;
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * 구글 애드센스 광고 단위 자리.
 * NEXT_PUBLIC_ADSENSE_CLIENT / slot 값이 없으면(심사 전) 자리 표시용 박스만 보여주고,
 * 값이 채워지면 실제 <ins class="adsbygoogle"> 광고를 렌더링합니다.
 */
export default function AdSlot({ slot, label = "광고", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("adsbygoogle push failed", err);
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-brand-300 bg-brand-50 py-8 text-sm text-brand-500 ${className}`}
        aria-hidden
      >
        {label} 영역 (애드센스 승인 후 자동 표시)
      </div>
    );
  }

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
