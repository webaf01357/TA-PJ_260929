import React, { useState } from 'react';
import {
  DiagnosisInput,
  GeneratedPlanTier,
  FeedbackEntry,
  generateThreeTierPlans
} from '../data/proposalData';
import {
  Sparkles,
  CheckCircle2,
  Send,
  Star,
  Compass,
  Crown,
  HeartHandshake,
  Feather
} from 'lucide-react';

interface LiffAiProposalMockupProps {
  initialStep?: 'line' | 'diagnosis' | 'results';
  feedbackLogs: FeedbackEntry[];
  onAddFeedbackLog: (entry: FeedbackEntry) => void;
}

const PERSONA_PRESETS: {
  id: string;
  label: string;
  userName: string;
  lineUserId: string;
  segmentTag: string;
  richMenuTitle: string;
  richMenuBanner: string;
  defaultInput: DiagnosisInput;
}[] = [
  {
    id: 'couple_onsen',
    label: '顧客A：60代ご夫婦（温泉・美食リピーター）',
    userName: '佐藤 健一 様',
    lineUserId: 'U89a1c4f0e2b7',
    segmentTag: '夫婦旅 · 温泉美食 · 過去参加2回',
    richMenuTitle: '【プレミアム会員様向け】夫婦で愉しむ季節の名湯・懐石特集',
    richMenuBanner: '前回の箱根旅から1年が経ちました。秋の露天風呂付き客室プランをAIで診断しませんか？',
    defaultInput: {
      area: '箱根・伊豆',
      companion: '夫婦・パートナー',
      purpose: '温泉・美食',
      duration: '1泊2日',
      pax: 2,
      budgetPerPerson: 60000,
      freeText: '静かな露天風呂付き客室か個室食で、移動が楽なプランを希望します。',
      lineSegmentTag: '夫婦旅 · 温泉美食'
    }
  },
  {
    id: 'family_hokuriku',
    label: '顧客B：50代・三世代家族（北陸・文化体験）',
    userName: '高橋 美咲 様',
    lineUserId: 'U34f9d2a1c8e5',
    segmentTag: '三世代家族 · 伝統文化 · 初回診断',
    richMenuTitle: '【ご家族・三世代旅向け】移動も安心！貸切タクシー＆個室食特集',
    richMenuBanner: 'ご両親との三世代旅行に人気！金沢・加賀温泉の無理のない行程を3段階で比較できます。',
    defaultInput: {
      area: '金沢・北陸',
      companion: '家族・三世代',
      purpose: '歴史・伝統文化',
      duration: '2泊3日',
      pax: 5,
      budgetPerPerson: 65000,
      freeText: '70代の両親も一緒なので、タクシー移動と個室での食事があると安心です。',
      lineSegmentTag: '三世代家族 · 北陸関心'
    }
  },
  {
    id: 'friends_setouchi',
    label: '顧客C：40代友人グループ（瀬戸内・絶景アート）',
    userName: '山本 彩香 様',
    lineUserId: 'U71b8e3c9a4d2',
    segmentTag: '友人グループ · 自然絶景 · アート旅',
    richMenuTitle: '【絶景・アート旅特集】瀬戸内の島々とオーシャンビュー宿診断',
    richMenuBanner: '直島・尾道エリアの最新ツアー実績を追加！予算に合わせた松・竹・梅プランを即時提案。',
    defaultInput: {
      area: '瀬戸内・四国',
      companion: '友人グループ',
      purpose: '自然・絶景',
      duration: '2泊3日',
      pax: 3,
      budgetPerPerson: 55000,
      freeText: '海が見えるホテルと、島のアート巡りを効率よく楽しみたいです。',
      lineSegmentTag: '友人旅 · 瀬戸内絶景'
    }
  }
];

export const LiffAiProposalMockup: React.FC<LiffAiProposalMockupProps> = ({
  initialStep = 'diagnosis',
  feedbackLogs = [],
  onAddFeedbackLog
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('couple_onsen');
  const [activeStep, setActiveStep] = useState<'line' | 'diagnosis' | 'results'>(initialStep);
  const [diagnosisInput, setDiagnosisInput] = useState<DiagnosisInput>(
    PERSONA_PRESETS[0]?.defaultInput
  );
  const [selectedTierTab, setSelectedTierTab] = useState<'松' | '竹' | '梅'>('竹');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>(
    '竹プランの予算感と芦ノ湖レイクビューの宿がちょうど希望通りです！夫婦で検討します。'
  );
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  const currentPersona =
    PERSONA_PRESETS.find((p) => p.id === selectedPersonaId) ?? PERSONA_PRESETS[0];

  const generatedPlans: GeneratedPlanTier[] = generateThreeTierPlans(diagnosisInput);
  const activePlan =
    generatedPlans.find((p) => p?.tier === selectedTierTab) ?? generatedPlans[1] ?? generatedPlans[0];

  const handleSelectPersona = (personaId: string) => {
    const found = PERSONA_PRESETS.find((p) => p.id === personaId);
    if (!found) return;
    setSelectedPersonaId(personaId);
    setDiagnosisInput(found.defaultInput);
    setActionBanner(
      `LINE顧客プロファイルを「${found.userName}」に切り替え、リッチメニュー出し分けと初期条件を同期しました。`
    );
  };

  const handleRunAiDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setActionBanner(null);

    setTimeout(() => {
      setIsGenerating(false);
      setActiveStep('results');
      setSelectedTierTab('竹');

      const newEntry: FeedbackEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lineUserId: currentPersona?.lineUserId ?? 'U0000000',
        userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''} · ${diagnosisInput?.purpose ?? ''}`,
        selectedTier: '竹',
        planTitle: `${diagnosisInput?.area ?? ''} AI松・竹・梅3プラン診断実行`,
        actionType: 'プラン詳細閲覧',
        rating: 5,
        comment: `予算${(diagnosisInput?.budgetPerPerson ?? 0).toLocaleString()}円/名・${diagnosisInput?.pax ?? 2}名でAI旅行診断を実行`,
        syncedToSheets: true
      };
      onAddFeedbackLog?.(newEntry);
    }, 350);
  };

  const handleLineConsultationRequest = (plan: GeneratedPlanTier) => {
    if (!plan) return;
    const newEntry: FeedbackEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lineUserId: currentPersona?.lineUserId ?? 'U0000000',
      userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''}`,
      selectedTier: plan.tier,
      planTitle: plan.title,
      actionType: '相談・見積リクエスト',
      rating: feedbackRating,
      comment: `LINEトークへ【${plan.tier}プラン】（${plan.pricePerPerson.toLocaleString()}円/名）の正式見積・空室確認リクエストを送信`,
      syncedToSheets: true
    };
    onAddFeedbackLog?.(newEntry);
    setActionBanner(
      `【LINE通知＆GAS連携完了】「${plan.tierName}」の見積相談をLINEトークへ送信し、Googleスプレッドシート台帳と旅行DBに記録しました。`
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;
    const newEntry: FeedbackEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lineUserId: currentPersona?.lineUserId ?? 'U0000000',
      userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''} · ${diagnosisInput?.purpose ?? ''}`,
      selectedTier: activePlan.tier,
      planTitle: activePlan.title,
      actionType: '評価・感想送信',
      rating: feedbackRating,
      comment: feedbackComment?.trim() || '提案内容に満足しました。',
      syncedToSheets: true
    };
    onAddFeedbackLog?.(newEntry);
    setActionBanner(
      `【データ循環完了】★${feedbackRating}の評価と感想を旅行DB（根拠実績: ${activePlan.sourceRecordCode}）へ蓄積しました。次回のAI推薦スコアに自動反映されます。`
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Context & Persona Selector Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-teal-800 font-medium">
              <span>Webモックアップ実演</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>ご提案書 第5章（AI旅行提案機能 C）＆ 第6章（LINE・LIFF連携 D）実装</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              LINE・LIFF 旅行診断 ＆ AI「松・竹・梅」3段階プラン提案モックアップ
            </h1>
          </div>

          {/* Step Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            <button
              type="button"
              onClick={() => setActiveStep('line')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 'line'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. LINE公式＆リッチメニュー
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('diagnosis')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 'diagnosis'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. LIFF 旅行条件入力
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('results')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeStep === 'results'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. AI松・竹・梅プラン提案＆評価
            </button>
          </div>
        </div>

        {/* Customer Persona Switcher */}
        <div className="pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">テスト顧客ペルソナ切替（リッチメニュー出し分け・セグメント連動）：</span>
            顧客属性を切り替えると、LINE画面のメニュー表示とLIFF初期条件が自動で変化します。
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PERSONA_PRESETS.map((persona) => (
              <button
                type="button"
                key={persona.id}
                onClick={() => handleSelectPersona(persona.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedPersonaId === persona.id
                    ? 'border-[#0F766E] bg-teal-50/70 text-teal-950 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {persona.label}
              </button>
            ))}
          </div>
        </div>

        {actionBanner && (
          <div className="mt-4 p-3.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between gap-3 text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{actionBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionBanner(null)}
              className="text-teal-700 hover:text-teal-950 font-semibold whitespace-nowrap cursor-pointer"
            >
              閉じる
            </button>
          </div>
        )}
      </section>

      {/* Main Split Workspace: Left = Interactive Customer LIFF/LINE Mockup, Right = Live Cloudflare/DB/RAG Backend Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Customer-Facing LINE & LIFF Web App Container */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Simulated LINE / LIFF Header Bar */}
          <div className="bg-[#1E293B] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div>
                <div className="text-sm font-bold tracking-tight">
                  {activeStep === 'line'
                    ? 'LINE公式アカウント：四季旅コンシェルジュDX'
                    : 'LIFF Web App：AI旅行プラン診断＆松竹梅シミュレーター'}
                </div>
                <div className="text-[11px] text-slate-300 font-mono tabular-nums">
                  連携ユーザー: {currentPersona?.userName ?? 'ゲスト'} ({currentPersona?.lineUserId ?? ''}) · 属性: {currentPersona?.segmentTag ?? ''}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-300 font-mono whitespace-nowrap">
              {activeStep === 'line' ? 'Messaging API' : 'LIFF v2.24'}
            </span>
          </div>

          {/* STEP 1 VIEW: LINE Official Account & Dynamic Rich Menu */}
          {activeStep === 'line' && (
            <div className="p-6 space-y-6 bg-slate-100/70">
              {/* Chat History Bubble */}
              <div className="space-y-4">
                <div className="text-center text-xs text-slate-400">
                  セグメント自動配信メッセージ（顧客タグ：{currentPersona?.segmentTag ?? ''}）
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 max-w-xl shadow-xs space-y-3">
                  <div className="text-xs font-semibold text-teal-800">
                    {currentPersona?.richMenuTitle ?? ''}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {currentPersona?.userName ?? ''}、いつもご利用ありがとうございます。{currentPersona?.richMenuBanner ?? ''}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>過去の旅行実績DBから最適な3プランを即時作成</span>
                    <button
                      type="button"
                      onClick={() => setActiveStep('diagnosis')}
                      className="font-semibold text-teal-800 hover:underline cursor-pointer"
                    >
                      旅行診断を開く →
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Rich Menu Simulation */}
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
                  <span className="font-semibold">
                    リッチメニュー出し分け表示中（{currentPersona?.segmentTag ?? ''}専用メニュー）
                  </span>
                  <span className="text-slate-300 font-mono">Dynamic RichMenu API</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveStep('diagnosis')}
                    className="p-5 text-left hover:bg-teal-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-semibold text-teal-800">旅行プラン入口（LIFF）</div>
                    <div className="text-sm font-bold text-slate-900 mt-1 group-hover:text-teal-900">
                      AIで「松・竹・梅」旅行診断
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      エリア・予算・目的を入れるだけで3段階プランを即時提案
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep('results')}
                    className="p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-500">セグメント特集</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {diagnosisInput?.area ?? '箱根・伊豆'} 高評価ツアー実績
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      満足度4.8以上の人気モデルコースを閲覧
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep('results');
                      setActionBanner('感想・評価フォームへ移動しました。下部よりフィードバック蓄積を試せます。');
                    }}
                    className="p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-500">フィードバック蓄積</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      旅の感想・リクエスト送信
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      いただいた評価が次回の旅行提案へ活かされます
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 VIEW: LIFF Travel Condition Diagnosis Input Form */}
          {activeStep === 'diagnosis' && (
            <form onSubmit={handleRunAiDiagnosis} className="p-6 lg:p-8 space-y-6">
              <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    ご希望の旅行条件・こだわりを入力してください
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    入力条件をもとに【旅行DB】から類似実績を抽出し、AIが「松・竹・梅」の3プランを編成します
                  </p>
                </div>
                <span className="text-xs text-teal-800 font-medium whitespace-nowrap">
                  所要時間：約30秒
                </span>
              </div>

              {/* 1. Area Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  01. ご希望の旅行エリア
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['箱根・伊豆', '金沢・北陸', '瀬戸内・四国', '京都・奈良'] as const).map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => setDiagnosisInput({ ...diagnosisInput, area })}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                        diagnosisInput?.area === area
                          ? 'border-[#0F766E] bg-[#0F766E] text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Companion & Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    02. 同行者タイプ（顧客属性タグ連動）
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['夫婦・パートナー', '家族・三世代', '友人グループ', 'ひとり旅'] as const).map(
                      (comp) => (
                        <button
                          type="button"
                          key={comp}
                          onClick={() => setDiagnosisInput({ ...diagnosisInput, companion: comp })}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                            diagnosisInput?.companion === comp
                              ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {comp}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    03. 旅の一番の目的・テーマ
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['温泉・美食', '歴史・伝統文化', '自然・絶景', '記念日・特別体験'] as const).map(
                      (purp) => (
                        <button
                          type="button"
                          key={purp}
                          onClick={() => setDiagnosisInput({ ...diagnosisInput, purpose: purp })}
                          className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                            diagnosisInput?.purpose === purp
                              ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {purp}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Duration, Headcount, and Budget Slider */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900">04. ご希望日程</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['1泊2日', '2泊3日', '3泊4日'] as const).map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => setDiagnosisInput({ ...diagnosisInput, duration: dur })}
                        className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                          diagnosisInput?.duration === dur
                            ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-semibold'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pax-select" className="block text-xs font-bold text-slate-900">
                    05. ご参加人数
                  </label>
                  <select
                    id="pax-select"
                    value={diagnosisInput?.pax ?? 2}
                    onChange={(e) =>
                      setDiagnosisInput({ ...diagnosisInput, pax: Number(e.target.value) })
                    }
                    className="w-full py-2 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}名様
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="budget-range" className="text-xs font-bold text-slate-900">
                      06. 1名あたりご予算目安
                    </label>
                    <span className="text-xs font-mono font-bold text-teal-800 tabular-nums">
                      {(diagnosisInput?.budgetPerPerson ?? 60000).toLocaleString()}円/名
                    </span>
                  </div>
                  <input
                    id="budget-range"
                    type="range"
                    min={30000}
                    max={120000}
                    step={5000}
                    value={diagnosisInput?.budgetPerPerson ?? 60000}
                    onChange={(e) =>
                      setDiagnosisInput({
                        ...diagnosisInput,
                        budgetPerPerson: Number(e.target.value)
                      })
                    }
                    className="w-full accent-[#0F766E] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                    <span>30,000円</span>
                    <span>総額 {((diagnosisInput?.budgetPerPerson ?? 60000) * (diagnosisInput?.pax ?? 2)).toLocaleString()}円</span>
                    <span>120,000円</span>
                  </div>
                </div>
              </div>

              {/* 4. Free Text Request for RAG Semantic Search */}
              <div className="space-y-2">
                <label htmlFor="free-request" className="block text-xs font-bold text-slate-900">
                  07. こだわり・配慮事項（AI/RAGベクトル検索に反映されます）
                </label>
                <textarea
                  id="free-request"
                  rows={2}
                  value={diagnosisInput?.freeText ?? ''}
                  onChange={(e) =>
                    setDiagnosisInput({ ...diagnosisInput, freeText: e.target.value })
                  }
                  placeholder="例：部屋の露天風呂があると嬉しい、足腰に優しいタクシー移動希望、記念日のサプライズなど"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:bg-white focus:border-[#0F766E]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 text-sm font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isGenerating
                      ? '旅行DBの過去実績をRAG検索し、松・竹・梅プランを生成中...'
                      : '過去旅行DB × AIで「松・竹・梅」3段階プランを生成する'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 VIEW: AI Generated Pine / Bamboo / Plum 3-Tier Proposal & Feedback */}
          {activeStep === 'results' && (
            <div className="p-6 lg:p-8 space-y-6">
              {/* Summary Bar of Input Conditions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">
                    <span>診断条件：{diagnosisInput?.area ?? ''}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{diagnosisInput?.companion ?? ''}（{diagnosisInput?.pax ?? 2}名）</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{diagnosisInput?.duration ?? ''}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="tabular-nums">基準予算 {(diagnosisInput?.budgetPerPerson ?? 60000).toLocaleString()}円/名</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    AI旅行プランご提案（松・竹・梅 3段階比較）
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep('diagnosis')}
                  className="text-xs font-semibold text-teal-800 hover:underline self-start sm:self-auto whitespace-nowrap cursor-pointer"
                >
                  ← 条件を変更して再診断
                </button>
              </div>

              {/* 3-Tier Interactive Selector Cards (松 / 竹 / 梅) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(generatedPlans ?? []).map((plan) => {
                  const isSelected = plan?.tier === selectedTierTab;
                  return (
                    <button
                      type="button"
                      key={plan?.tier ?? '竹'}
                      onClick={() => setSelectedTierTab(plan.tier)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          【{plan?.tier}】{plan?.tier === '松' ? '特選・極上' : plan?.tier === '竹' ? '王道・人気No.1' : 'スマート良質'}
                        </span>
                        <span className="font-mono text-teal-800 tabular-nums">
                          一致度 {plan?.ragMatchScore ?? 90}%
                        </span>
                      </div>
                      <div className="mt-2 text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {(plan?.pricePerPerson ?? 0).toLocaleString()}円
                        <span className="text-xs font-normal text-slate-500"> / 1名</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        根拠実績: {plan?.sourceRecordCode ?? ''}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Plan Detailed Card */}
              {activePlan && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {/* Rich Thematic Gradient Showcase Banner */}
                  <div
                    className={`relative p-6 sm:p-8 bg-gradient-to-br ${activePlan.themeGradient} text-white space-y-3 overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {activePlan.tier === '松' && <Crown className="w-5 h-5 text-amber-300" />}
                        {activePlan.tier === '竹' && <HeartHandshake className="w-5 h-5 text-emerald-300" />}
                        {activePlan.tier === '梅' && <Feather className="w-5 h-5 text-indigo-300" />}
                        <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
                          {activePlan.tierName}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-300 tabular-nums">
                        旅行DB根拠: {activePlan.sourceRecordCode}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                      {activePlan.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                      {activePlan.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
                      {(activePlan.includedTags ?? []).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-white/10 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Plan Thumbnail Image (Between Plan Title and Price) */}
                  <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={activePlan.imageUrl}
                      alt={activePlan.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span className="px-2.5 py-1 rounded-sm bg-black/60 font-semibold backdrop-blur-xs">
                        {activePlan.tier === '松'
                          ? '【松】特選離れ・極上露天'
                          : activePlan.tier === '竹'
                          ? '【竹】展望リゾート・王道'
                          : '【梅】街歩き・スマート旅'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-200">
                        旅行DB根拠実績: {activePlan.sourceRecordCode}
                      </span>
                    </div>
                  </div>

                  {/* Plan Details Body */}
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Price & RAG Citation Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <div className="text-xs text-slate-500">AI推薦根拠（旅行DB・RAG検索結果）</div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5">
                          {activePlan.sourceRecordTitle}
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xs text-slate-500">概算旅行代金（税込）</div>
                        <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                          {activePlan.pricePerPerson.toLocaleString()}円/名
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            （{diagnosisInput?.pax ?? 2}名合計 {activePlan.totalPrice.toLocaleString()}円）
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation Reason */}
                    <div className="p-4 rounded-lg bg-teal-50/50 border border-teal-200/80 space-y-1">
                      <div className="text-xs font-bold text-teal-950">
                        AIコンシェルジュからの推薦理由
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {activePlan.recommendReason}
                      </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="font-bold text-slate-900">ご宿泊施設・客室</div>
                        <div className="text-slate-600 mt-1 leading-relaxed">
                          {activePlan.accommodation}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="font-bold text-slate-900">お食事条件</div>
                        <div className="text-slate-600 mt-1 leading-relaxed">{activePlan.meals}</div>
                      </div>
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="font-bold text-slate-900">移動・交通手配</div>
                        <div className="text-slate-600 mt-1 leading-relaxed">
                          {activePlan.transport}
                        </div>
                      </div>
                    </div>

                    {/* Itinerary */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">モデル行程表（過去催行実績ベース）</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(activePlan.itinerary ?? []).map((dayItem) => (
                          <div
                            key={dayItem?.day ?? ''}
                            className="p-4 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2"
                          >
                            <div className="text-xs font-bold text-teal-900">{dayItem?.day ?? ''}</div>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {(dayItem?.schedule ?? []).map((line, i) => (
                                <li key={i} className="leading-relaxed">
                                  {line}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA: Send to LINE / Consultation */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleLineConsultationRequest(activePlan)}
                        className="w-full sm:flex-1 py-3 px-4 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>この【{activePlan.tier}プラン】でLINE相談・正式見積を依頼する</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Feedback & Rating Loop Form */}
              {activePlan && (
                <form
                  onSubmit={handleSubmitFeedback}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        顧客の反応・評価・感想の蓄積（旅行DBへのフィードバック還流）
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ここで送信された評価・コメントは【旅行DB】へ記録され、次回のAI提案精度向上とGoogleスプレッドシート集計に直結します
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            star <= feedbackRating ? 'text-amber-500' : 'text-slate-300'
                          }`}
                          aria-label={`${star}つ星評価`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                      <span className="ml-1 text-xs font-mono font-bold text-slate-800 tabular-nums">
                        {feedbackRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="プランへのご感想・ご希望を入力..."
                      className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0F766E]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      評価を旅行DBへ保存
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right 5 Columns: Live Cloudflare / Travel DB / RAG / GAS Backend Synchronization Inspector */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="pb-4 border-b border-slate-200">
              <div className="text-xs text-teal-800 font-medium">
                裏側システムのリアルタイム連動状態
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Cloudflare API · 旅行DB(D1) · RAG検索 · GAS連携モニター
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                左のLIFF画面で操作した内容が、どのようにデータ資産として処理・蓄積されるかをリアルタイム表示しています
              </p>
            </div>

            {/* 1. LINE User & Segment Tagging State */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">1. LINEユーザー紐付け＆自動付与タグ</span>
                <span className="font-mono text-slate-500 tabular-nums">{currentPersona?.lineUserId ?? ''}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span>保持セグメント：</span>
                <span className="font-semibold text-teal-900">
                  {diagnosisInput?.area ?? ''}関心 · {diagnosisInput?.companion ?? ''} · {diagnosisInput?.purpose ?? ''} · 予算{(diagnosisInput?.budgetPerPerson ?? 60000).toLocaleString()}円帯
                </span>
              </div>
            </div>

            {/* 2. D1 SQL Filtering & RAG Vector Retrieval */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">2. 旅行DB(D1) 条件フィルタ＆RAG検索クエリ</span>
                <span className="font-mono text-teal-800 tabular-nums">3件抽出済み</span>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto">
{`SELECT code, tier, title, satisfaction_score
FROM travel_records
WHERE area = '${diagnosisInput?.area ?? '箱根・伊豆'}'
  AND companion = '${diagnosisInput?.companion ?? '夫婦・パートナー'}'
-- RAG Vector Query: "${diagnosisInput?.purpose ?? ''} ${(diagnosisInput?.freeText ?? '').slice(0, 18)}..."
-- 抽出実績: 松(${generatedPlans?.[0]?.sourceRecordCode ?? ''}) / 竹(${generatedPlans?.[1]?.sourceRecordCode ?? ''}) / 梅(${generatedPlans?.[2]?.sourceRecordCode ?? ''})`}
              </pre>
            </div>

            {/* 3. Live Action & Feedback Log */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  3. 顧客行動・フィードバック蓄積＆Googleスプレッドシート連携ログ
                </span>
                <span className="font-mono text-slate-500 tabular-nums">
                  全{(feedbackLogs ?? []).length}件
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                      <th className="py-2 px-3 font-semibold">時刻 / 区分</th>
                      <th className="py-2 px-3 font-semibold">対象プラン・顧客反応内容</th>
                      <th className="py-2 px-3 font-semibold text-right">評価 / 連携</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {(feedbackLogs ?? []).slice(0, 5).map((log) => (
                      <tr key={log?.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                            {log?.timestamp ?? ''}
                          </div>
                          <div className="font-semibold text-slate-800 text-[11px] mt-0.5">
                            {log?.actionType ?? ''}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="font-semibold text-slate-900">
                            【{log?.selectedTier ?? ''}】{log?.userSegment ?? ''}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                            {log?.comment ?? ''}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top text-right whitespace-nowrap font-mono tabular-nums">
                          <div className="text-amber-600 font-semibold">★{log?.rating ?? 5}.0</div>
                          <div className="text-[10px] text-teal-800 mt-0.5">GAS出力済</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
