import React, { useState } from 'react';
import {
  ESTIMATE_SECTIONS,
  PHASE1_SCOPE_ITEMS,
  PHASE2_FUTURE_ITEMS
} from '../data/proposalData';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface EstimateAndScopeViewProps {
  onLaunchMockup: () => void;
}

export const EstimateAndScopeView: React.FC<EstimateAndScopeViewProps> = ({
  onLaunchMockup
}) => {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('ALL');

  const filteredSections =
    selectedCategoryCode === 'ALL'
      ? ESTIMATE_SECTIONS
      : (ESTIMATE_SECTIONS ?? []).filter((s) => s?.code === selectedCategoryCode);

  const totalInitialCost = (ESTIMATE_SECTIONS ?? []).reduce(
    (acc, s) => acc + (s?.subtotal ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Summary Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs text-teal-800 font-medium">
              ご提案書 第3章〜第17章・第20章「概算見積まとめ・導入範囲」
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              初期構築費内訳・2年間総投資シミュレーション・導入フェーズ計画
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              初期段階では必要以上に大規模なCRMを構築せず、LINE公式アカウント・LIFF・Cloudflare・旅行DB(D1)・AI/RAGに集中投資することで、初期投資および月額固定費を抑えます。
            </p>
          </div>

          <button
            type="button"
            onClick={onLaunchMockup}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap self-start lg:self-auto cursor-pointer"
          >
            <span>Webモックアップ画面へ戻る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Year Investment Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">初期構築費（A〜G合計）</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              3,370,000円
            </div>
            <div className="text-[11px] text-slate-500 mt-1">税別 · 全7区分35明細項目</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">システム利用料（2年間概算）</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              約240,000円
            </div>
            <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
              月額目安 3,000〜15,000円程度
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">基本保守（2年間・24ヶ月）</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              360,000円
            </div>
            <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
              月額 15,000円（稼働確認・月次レポート）
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">軽微な改善・追加対応予算</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              約200,000円
            </div>
            <div className="text-[11px] text-slate-500 mt-1">2年間のプロンプト・導線微調整枠</div>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-300">
            <div className="text-xs font-semibold text-teal-900">2年間総投資額目安（税別）</div>
            <div className="text-xl font-bold text-teal-950 font-mono tabular-nums mt-1">
              約4,170,000円
            </div>
            <div className="text-[11px] text-teal-800 mt-1">通常保守と追加開発を分離し固定費抑制</div>
          </div>
        </div>
      </section>

      {/* Detailed Estimate Table A-G */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              初期構築費 区分別明細（A〜G 合計 {totalInitialCost.toLocaleString()}円 税別）
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              区分ボタンでフィルタリングして各項目の内訳を確認できます
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedCategoryCode('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategoryCode === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全区分 (A〜G)
            </button>
            {(ESTIMATE_SECTIONS ?? []).map((sec) => (
              <button
                type="button"
                key={sec?.code ?? ''}
                onClick={() => setSelectedCategoryCode(sec.code)}
                className={`px-2.5 py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                  selectedCategoryCode === sec?.code
                    ? 'bg-white text-teal-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sec?.code ?? ''}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {(filteredSections ?? []).map((sec) => (
            <div key={sec?.code ?? ''} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">
                  区分 {sec?.code ?? ''}. {sec?.category ?? ''}
                </div>
                <div className="text-sm font-mono font-bold text-teal-900 tabular-nums">
                  小計：{(sec?.subtotal ?? 0).toLocaleString()}円
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500 bg-white">
                    <th className="py-2.5 px-5 font-semibold w-1/3">項目</th>
                    <th className="py-2.5 px-5 font-semibold">内容</th>
                    <th className="py-2.5 px-5 font-semibold text-right w-40">金額（税別）</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {(sec?.items ?? []).map((item) => (
                    <tr key={item?.name ?? ''} className="hover:bg-slate-50/70">
                      <td className="py-3 px-5 font-semibold text-slate-900">{item?.name ?? ''}</td>
                      <td className="py-3 px-5 text-slate-600">{item?.desc ?? ''}</td>
                      <td className="py-3 px-5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {(item?.cost ?? 0).toLocaleString()}円
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      {/* Section 14, 15, 16: Phase 1 Scope vs Phase 2 Intentional Exclusions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <div className="text-xs text-teal-800 font-medium">第14章 初期導入範囲</div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              本プロジェクト（Phase 1）で構築するもの（全15項目）
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(PHASE1_SCOPE_ITEMS ?? []).map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <div className="text-xs text-slate-500 font-medium">
              第15章・第16章 段階的拡張（Phase 2以降候補）
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              今回あえて初期構築しないもの（将来拡張オプション）
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            初期投資を抑え、実際のLINE診断利用数や顧客反応データを確認しながら段階的に成長させるため、以下は利用規模拡大時のPhase 2候補として設計します。
          </p>
          <ul className="space-y-2">
            {(PHASE2_FUTURE_ITEMS ?? []).map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
