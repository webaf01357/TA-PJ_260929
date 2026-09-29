import React, { useState } from 'react';
import { PhoneMockupPrototype } from './components/PhoneMockupPrototype';
import { ArchitectureDiagramView } from './components/ArchitectureDiagramView';
import { TravelDatabaseExplorer } from './components/TravelDatabaseExplorer';
import { EstimateAndScopeView } from './components/EstimateAndScopeView';
import { FeedbackEntry } from './data/proposalData';

const INITIAL_FEEDBACK_LOGS: FeedbackEntry[] = [
  {
    id: 'init-1',
    timestamp: '14:18:05',
    lineUserId: 'U89a1c4f0e2b7',
    userSegment: '箱根・伊豆 · 夫婦・パートナー · 温泉・美食',
    selectedTier: '竹',
    planTitle: '【竹】芦ノ湖畔・仙石原高原 名宿ステイと温泉・美食満喫ゴールデンルート',
    actionType: '評価・感想送信',
    rating: 5,
    comment: '予算6万円前後で芦ノ湖ビューと海賊船特別船室が入っている竹プランが一番魅力的でした。',
    syncedToSheets: true
  },
  {
    id: 'init-2',
    timestamp: '13:42:19',
    lineUserId: 'U34f9d2a1c8e5',
    userSegment: '金沢・北陸 · 家族・三世代 · 歴史・伝統文化',
    selectedTier: '松',
    planTitle: '【松】金沢・ひがし茶屋街＆山代温泉で愉しむ 歴史・伝統文化・特別誂えの旅',
    actionType: '相談・見積リクエスト',
    rating: 5,
    comment: '両親の古希祝いのため、松プランの町家貸切と専用ハイヤー送迎で空室確認をお願いします。',
    syncedToSheets: true
  },
  {
    id: 'init-3',
    timestamp: '11:09:44',
    lineUserId: 'U71b8e3c9a4d2',
    userSegment: '瀬戸内・四国 · 友人グループ · 自然・絶景',
    selectedTier: '梅',
    planTitle: '【梅】倉敷美観地区・高松瀬戸内めぐり 気軽に楽しむ自然・絶景スマート旅',
    actionType: 'プラン詳細閲覧',
    rating: 4,
    comment: '週末1泊〜2泊で気軽に行ける梅プランと竹プランを比較検討中です。',
    syncedToSheets: true
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'phone_proto' | 'architecture' | 'database' | 'estimate'>(
    'phone_proto'
  );
  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK_LOGS);

  const handleAddFeedbackLog = (entry: FeedbackEntry) => {
    if (!entry) return;
    setFeedbackLogs((prev) => [entry, ...(prev ?? [])]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-4">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#prototype"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('phone_proto');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
          >
            旅行顧客DX・AI旅行提案システム
          </a>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('phone_proto')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeTab === 'phone_proto'
                  ? 'border-[#0F766E] text-slate-900 font-bold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              【A】スマホ・LINE実機プロトタイプ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeTab === 'architecture'
                  ? 'border-[#0F766E] text-slate-900 font-bold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              【B】システム全体構成図
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeTab === 'database'
                  ? 'border-[#0F766E] text-slate-900 font-bold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              【B】旅行DB・データ資産基盤
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('estimate')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeTab === 'estimate'
                  ? 'border-[#0F766E] text-slate-900 font-bold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              【B】概算見積・導入範囲
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === 'phone_proto' ? 'architecture' : 'phone_proto')
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {activeTab === 'phone_proto' ? '【B】システム構成図を見る' : '【A】スマホ実機モックを操作'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'phone_proto', label: '【A】スマホ実機モック' },
          { id: 'architecture', label: '【B】全体構成図' },
          { id: 'database', label: '【B】旅行DB基盤' },
          { id: 'estimate', label: '【B】概算見積' }
        ].map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#0F766E] text-white'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Container (1440px desktop baseline with max-w-[1360px]) */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'phone_proto' && (
          <PhoneMockupPrototype
            feedbackLogs={feedbackLogs ?? []}
            onAddFeedbackLog={handleAddFeedbackLog}
            onNavigateToArchitecture={() => setActiveTab('architecture')}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDiagramView
            onLaunchMockup={() => setActiveTab('phone_proto')}
            onNavigateTab={(tab) => {
              if (tab === 'mockup') setActiveTab('phone_proto');
              else setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'database' && (
          <TravelDatabaseExplorer
            feedbackLogs={feedbackLogs ?? []}
            onNavigateMockup={() => setActiveTab('phone_proto')}
          />
        )}

        {activeTab === 'estimate' && (
          <EstimateAndScopeView
            onLaunchMockup={() => setActiveTab('phone_proto')}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            【A】LINE・LIFF向けプロトタイプ（スマートフォン実機モックアップ）＆ 【B】旅行顧客DX・AI旅行提案システム
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('phone_proto')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              スマホ実機モック
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              システム全体構成図
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              旅行DB基盤
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('estimate')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              概算見積内訳
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
