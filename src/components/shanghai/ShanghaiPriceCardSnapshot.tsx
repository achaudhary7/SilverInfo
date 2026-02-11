"use client";

import { ChinaFlag } from "@/components/Flags";
import type { ShanghaiSnapshotPrice } from "@/lib/shanghaiSnapshot";

interface ShanghaiPriceCardSnapshotProps {
  price: ShanghaiSnapshotPrice;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ShanghaiPriceCardSnapshot({ price }: ShanghaiPriceCardSnapshotProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-md border border-slate-200 h-full">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)" }}
      >
        <div className="flex items-center gap-2">
          <ChinaFlag className="w-6 h-4 rounded shadow-sm" />
          <div>
            <h2 className="text-sm font-bold text-white">Shanghai Silver Price</h2>
            <p className="text-[11px] text-white/70">SGE Ag(T+D) • Snapshot</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/25 text-white">SNAPSHOT</span>
      </div>

      <div className="px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">Shanghai Silver Spot Price (CNY/kg)</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">¥{price.pricePerKgCny.toLocaleString()}</span>
          <span className="px-1 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">Snapshot</span>
        </div>
        <p className="text-[11px] text-slate-500">¥{price.pricePerGramCny.toFixed(2)}/gram • ${price.pricePerOzUsd.toFixed(2)}/oz</p>

        <div className="grid grid-cols-4 gap-1.5 mb-2 mt-2 text-center">
          <div className="p-1.5 rounded bg-cyan-50">
            <p className="text-[9px] text-cyan-600">COMEX</p>
            <p className="text-xs font-bold text-cyan-800">${price.comexUsd.toFixed(2)}</p>
          </div>
          <div className="p-1.5 rounded bg-emerald-50">
            <p className="text-[9px] text-emerald-600">Premium</p>
            <p className="text-xs font-bold text-emerald-700">+{price.premiumPercent.toFixed(1)}%</p>
          </div>
          <div className="p-1.5 rounded bg-blue-50">
            <p className="text-[9px] text-blue-600">USD/CNY</p>
            <p className="text-xs font-bold text-blue-700">{price.usdCny.toFixed(2)}</p>
          </div>
          <div className="p-1.5 rounded bg-amber-50">
            <p className="text-[9px] text-amber-600">USD/g</p>
            <p className="text-xs font-bold text-amber-700">${price.pricePerGramUsd.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] mb-2 px-1 py-1.5 bg-slate-50 rounded">
          <span className="text-slate-500">Spot:</span>
          <span className="font-medium text-slate-700">¥{price.pricePerKgCny.toLocaleString()}/kg</span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">${price.pricePerOzUsd.toFixed(2)}/oz</span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">₹{price.pricePerGramInr.toFixed(0)}/g</span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-amber-700">
            Snapshot: COMEX×(1+{price.premiumPercent.toFixed(1)}%)×FX •{" "}
            <a href={price.officialSgeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">
              SGE →
            </a>
          </p>
        </div>
      </div>

      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div>
            <p className="text-slate-400">10 gram</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 10).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-slate-400">1 tola (11.66g)</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 11.66).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-slate-400">100 gram</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 100).toFixed(0)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-1.5 flex items-center justify-between text-[10px] bg-slate-100 border-t border-slate-200">
        <span className="text-slate-500">Updated {formatTime(price.timestamp)}</span>
        <span className="text-slate-400">{price.source}</span>
      </div>
    </div>
  );
}
