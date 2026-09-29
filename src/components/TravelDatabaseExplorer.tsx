import React, { useState } from 'react';
import { INITIAL_TRAVEL_DB, TravelRecord, FeedbackEntry } from '../data/proposalData';
import { Search, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

interface TravelDatabaseExplorerProps {
  feedbackLogs: FeedbackEntry[];
  onNavigateMockup: () => void;
}

export const TravelDatabaseExplorer: React.FC<TravelDatabaseExplorerProps> = ({
  feedbackLogs = [],
  onNavigateMockup
}) => {
  const [records, setRecords] = useState<TravelRecord[]>(INITIAL_TRAVEL_DB ?? []);
  const [areaFilter, setAreaFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [conversionNotice, setConversionNotice] = useState<string | null>(null);

  const filteredRecords = (records ?? []).filter((rec) => {
    if (!rec) return false;
    if (areaFilter !== 'ALL' && rec.area !== areaFilter) return false;
    if (tierFilter !== 'ALL' && rec.tier !== tierFilter) return false;
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (rec.title ?? '').toLowerCase().includes(q);
      const codeMatch = (rec.code ?? '').toLowerCase().includes(q);
      const voiceMatch = (rec.customerVoice ?? '').toLowerCase().includes(q);
      if (!titleMatch && !codeMatch && !voiceMatch) return false;
    }
    return true;
  });

  const handleSimulateWordImport = () => {
    const newCode = `TRV-2026-10${(records?.length ?? 0) + 1}`;
    const importedRecord: TravelRecord = {
      id: `rec-${Date.now()}`,
      code: newCode,
      title: '伊豆・修善寺竹林の小径と源泉掛け流し離れ宿で味わう伊勢海老懐石旅',
      area: '箱根・伊豆',
      companion: '夫婦・パートナー',
      purpose: '記念日・特別体験',
      duration: '1泊2日',
      tier: '松',
      pricePerPerson: 84000,
      satisfactionScore: 4.9,
      repeatCount: 12,
      sourceDoc: '2025冬_修善寺特別企画書_AI変換済.docx',
      highlights: [
        '修善寺温泉 伝統数寄屋造り露天風呂付客室',
        '駿河湾産伊勢海老と伊豆牛の記念日懐石',
        '三島駅からの専用ハイヤー送迎つき'
      ],
      customerVoice: '結婚記念日で利用。竹林の散策と部屋食の伊勢海老が最高でした。（60代ご夫婦）',
      tags: ['修善寺温泉', '記念日', '露天風呂付客室', 'AI一次変換済']
    };

    setRecords([importedRecord, ...(records ?? [])]);
    setConversionNotice(
      `Word過去資料「${importedRecord.sourceDoc}」をAI一次変換し、旅行DB（D1）およびRAG検索インデックスへ登録しました（コード: ${newCode}）。`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Word-to-DB Pipeline Banner */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-xs text-teal-800 font-medium">
              <span>ご提案書 第4章（旅行データ資産化 B：750,000円）＆ 第7章（管理・業務支援 E：380,000円）</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              旅行DB（D1データ基盤）＆ Word過去資料データ資産化コンソール
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              これまでWordファイル等で個別に保管されていた過去の旅行企画書・ツアー実績・顧客の反応をAI一次変換によってデータベース化。RAG検索の根拠データとして活用します。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSimulateWordImport}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-800" />
              <span>Word過去資料のAI一次変換デモを追加</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateMockup?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>LIFFモックアップで検索を試す</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Visualization from Section 4.B */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '01', name: 'Wordデータ解析・整理', cost: '150,000円', desc: '過去旅行資料・行程表の構造解析' },
            { step: '02', name: 'AIによるデータ一次変換', cost: '100,000円', desc: 'エリア・予算・宿・特徴をDB項目化' },
            { step: '03', name: '旅行DB構築 (D1等)', cost: '250,000円', desc: '高速SQL検索可能なエッジDB構築' },
            { step: '04', name: 'データ品質確認', cost: '100,000円', desc: '重複・欠損・異常値のクレンジング' },
            { step: '05', name: 'RAG検索基盤構築', cost: '150,000円', desc: '類似旅行・条件ハイブリッド検索' }
          ].map((item) => (
            <div key={item.step} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                <span>STEP {item.step}</span>
                <span>{item.cost}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">{item.name}</div>
              <div className="text-[11px] text-slate-600 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        {conversionNotice && (
          <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between gap-3 text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{conversionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setConversionNotice(null)}
              className="text-teal-800 font-semibold cursor-pointer"
            >
              閉じる
            </button>
          </div>
        )}
      </section>

      {/* Filter Bar & Structured Travel DB Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Area Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['ALL', '箱根・伊豆', '金沢・北陸', '瀬戸内・四国', '京都・奈良'] as const).map((area) => (
                <button
                  type="button"
                  key={area}
                  onClick={() => setAreaFilter(area)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    areaFilter === area
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {area === 'ALL' ? '全エリア' : area}
                </button>
              ))}
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['ALL', '松', '竹', '梅'] as const).map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    tierFilter === tier
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tier === 'ALL' ? '全ランク' : `${tier}ランク`}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ツアー名・実績コード・口コミで検索..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:border-[#0F766E]"
            />
          </div>
        </div>

        {/* High-Density Data Grid */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                <th className="py-3 px-4 font-semibold">実績コード / 元Word資料</th>
                <th className="py-3 px-4 font-semibold">区分 / エリア</th>
                <th className="py-3 px-4 font-semibold">構造化ツアー名・主な行程特徴</th>
                <th className="py-3 px-4 font-semibold">顧客の反応・口コミ資産</th>
                <th className="py-3 px-4 font-semibold text-right">単価目安 / 満足度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {(filteredRecords ?? []).map((rec) => (
                <tr key={rec?.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900 tabular-nums">{rec?.code ?? ''}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{rec?.sourceDoc ?? ''}</div>
                  </td>
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="font-bold text-teal-900">
                      【{rec?.tier ?? ''}】{rec?.area ?? ''}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {rec?.companion ?? ''} · {rec?.duration ?? ''}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top max-w-md">
                    <div className="font-bold text-slate-900 leading-snug">{rec?.title ?? ''}</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {(rec?.highlights ?? []).join(' ／ ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <div className="text-[11px] text-slate-700 leading-relaxed">
                      「{rec?.customerVoice ?? ''}」
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
                      過去催行・再利用実績：{rec?.repeatCount ?? 0}回
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap font-mono tabular-nums">
                    <div className="text-sm font-bold text-slate-900">
                      {(rec?.pricePerPerson ?? 0).toLocaleString()}円/名
                    </div>
                    <div className="text-xs text-amber-600 font-semibold mt-0.5">
                      ★ {(rec?.satisfactionScore ?? 0).toFixed(1)} / 5.0
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
