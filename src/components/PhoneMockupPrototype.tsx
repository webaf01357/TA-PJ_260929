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
  Feather,
  ArrowLeft,
  Search,
  Menu,
  X,
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Calendar,
  Users,
  MapPin,
  Clock,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface PhoneMockupPrototypeProps {
  feedbackLogs: FeedbackEntry[];
  onAddFeedbackLog: (entry: FeedbackEntry) => void;
  onNavigateToArchitecture: () => void;
}

const PERSONA_PRESETS = [
  {
    id: 'couple_onsen',
    label: '顧客A：60代ご夫婦（温泉・美食）',
    userName: '佐藤 健一 様',
    lineUserId: 'U89a1c4f0e2b7',
    segmentTag: '夫婦旅 · 温泉美食 · 過去参加2回',
    welcomeMsg: '佐藤 健一 様、いつもご利用ありがとうございます！秋の行楽シーズンに向け、過去の満足度4.9実績をもとにした「松・竹・梅」3段階プランをご用意しました。下のメニューからすぐにAI旅行診断をお試しいただけます。',
    defaultInput: {
      area: '箱根・伊豆' as const,
      companion: '夫婦・パートナー' as const,
      purpose: '温泉・美食' as const,
      duration: '1泊2日' as const,
      pax: 2,
      budgetPerPerson: 60000,
      freeText: '静かな露天風呂付き客室で、移動に負担のないプランを希望します。',
      lineSegmentTag: '夫婦旅 · 温泉美食'
    }
  },
  {
    id: 'family_hokuriku',
    label: '顧客B：50代・三世代家族（北陸・伝統）',
    userName: '高橋 美咲 様',
    lineUserId: 'U34f9d2a1c8e5',
    segmentTag: '三世代家族 · 伝統文化 · 初回診断',
    welcomeMsg: '高橋 美咲 様、LINE公式アカウントへようこそ！ご両親との三世代旅行に人気の金沢・加賀エリアを、タクシー移動や個室食の有無を含めて3つのグレードで比較・提案いたします。',
    defaultInput: {
      area: '金沢・北陸' as const,
      companion: '家族・三世代' as const,
      purpose: '歴史・伝統文化' as const,
      duration: '2泊3日' as const,
      pax: 5,
      budgetPerPerson: 65000,
      freeText: '高齢の両親が一緒なので、階段が少なく車移動中心の行程を希望。',
      lineSegmentTag: '三世代家族 · 北陸関心'
    }
  },
  {
    id: 'friends_setouchi',
    label: '顧客C：40代友人旅（瀬戸内・絶景）',
    userName: '山本 彩香 様',
    lineUserId: 'U71b8e3c9a4d2',
    segmentTag: '友人グループ · 自然絶景 · アート旅',
    welcomeMsg: '山本 彩香 様、こんにちは！直島・尾道などの瀬戸内アート＆絶景ホテルプランをAIが即時編成。ご予算や希望日数に合わせて松・竹・梅プランを比較できます。',
    defaultInput: {
      area: '瀬戸内・四国' as const,
      companion: '友人グループ' as const,
      purpose: '自然・絶景' as const,
      duration: '2泊3日' as const,
      pax: 3,
      budgetPerPerson: 55000,
      freeText: '海が見えるテラス宿と、島のアート巡りを効率よく回りたいです。',
      lineSegmentTag: '友人旅 · 瀬戸内絶景'
    }
  }
];

export const PhoneMockupPrototype: React.FC<PhoneMockupPrototypeProps> = ({
  feedbackLogs = [],
  onAddFeedbackLog,
  onNavigateToArchitecture
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('couple_onsen');
  // 'talk' = LINEトーク画面 & リッチメニュー, 'liff_form' = LIFF旅行条件入力, 'liff_results' = AI松竹梅プラン提案結果
  const [phoneScreen, setPhoneScreen] = useState<'talk' | 'liff_form' | 'liff_results'>('talk');
  const [isLiffOpen, setIsLiffOpen] = useState<boolean>(false);
  const [diagnosisInput, setDiagnosisInput] = useState<DiagnosisInput>(
    PERSONA_PRESETS[0]?.defaultInput
  );
  const [selectedTierTab, setSelectedTierTab] = useState<'松' | '竹' | '梅'>('竹');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>(
    '竹プランの芦ノ湖ビュー宿とご当地グルメのバランスが希望にぴったりでした！'
  );
  const [chatConsultationSent, setChatConsultationSent] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

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
    setChatConsultationSent(false);
    setActionAlert(`顧客ペルソナを「${found.userName}」に変更し、リッチメニューと初期条件を同期しました。`);
  };

  const handleOpenLiff = (screen: 'liff_form' | 'liff_results' = 'liff_form') => {
    setIsLiffOpen(true);
    setPhoneScreen(screen);
  };

  const handleCloseLiff = () => {
    setIsLiffOpen(false);
    setPhoneScreen('talk');
  };

  const handleRunAiDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setActionAlert(null);

    setTimeout(() => {
      setIsGenerating(false);
      setPhoneScreen('liff_results');
      setSelectedTierTab('竹');

      const newEntry: FeedbackEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lineUserId: currentPersona?.lineUserId ?? 'U0000000',
        userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''}`,
        selectedTier: '竹',
        planTitle: `${diagnosisInput?.area ?? ''} 【松・竹・梅】3プランAI診断実行`,
        actionType: 'プラン詳細閲覧',
        rating: 5,
        comment: `予算${(diagnosisInput?.budgetPerPerson ?? 60000).toLocaleString()}円/名・${diagnosisInput?.pax ?? 2}名で旅行診断を実行`,
        syncedToSheets: true
      };
      onAddFeedbackLog?.(newEntry);
    }, 400);
  };

  const handleSendToChat = () => {
    if (!activePlan) return;
    setChatConsultationSent(true);
    setIsLiffOpen(false);
    setPhoneScreen('talk');

    const newEntry: FeedbackEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lineUserId: currentPersona?.lineUserId ?? 'U0000000',
      userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''}`,
      selectedTier: activePlan.tier,
      planTitle: activePlan.title,
      actionType: '相談・見積リクエスト',
      rating: feedbackRating,
      comment: `LINEトークへ【${activePlan.tier}プラン】（${activePlan.pricePerPerson.toLocaleString()}円/名）の見積相談メッセージを自動投稿`,
      syncedToSheets: true
    };
    onAddFeedbackLog?.(newEntry);
    setActionAlert(`【LINE送信＆GAS自動記録完了】「${activePlan.tierName}」の相談をトークに送信しました。`);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;
    const newEntry: FeedbackEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lineUserId: currentPersona?.lineUserId ?? 'U0000000',
      userSegment: `${diagnosisInput?.area ?? ''} · ${diagnosisInput?.companion ?? ''}`,
      selectedTier: activePlan.tier,
      planTitle: activePlan.title,
      actionType: '評価・感想送信',
      rating: feedbackRating,
      comment: feedbackComment?.trim() || '満足しました。',
      syncedToSheets: true
    };
    onAddFeedbackLog?.(newEntry);
    setActionAlert(`【データ循環完了】★${feedbackRating}の評価を旅行DB（根拠コード: ${activePlan.sourceRecordCode}）へ保存しました。`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Mode Information */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs text-teal-800 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>A：LINE・LIFF向けプロトタイプ（スマートフォン実機モックアップ画面）</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              スマートフォン実機画面で体感するLINE旅行診断＆AI松竹梅提案
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              お客様が日常で操作するスマートフォン実機フレームの中で、LINEトーク・リッチメニュー・LIFF Web画面がどのように連動するかを完全再現しています。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToArchitecture}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>【B】システム全体構成図を見る</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Customer Persona Switcher */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            <span className="font-semibold text-slate-900">顧客属性（ペルソナ）切替：</span>
            属性を切り替えると、スマホ内のLINEリッチメニューやおすすめ配信が変化します。
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PERSONA_PRESETS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => handleSelectPersona(p.id)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  selectedPersonaId === p.id
                    ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {actionAlert && (
          <div className="mt-4 p-3 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between gap-2 text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{actionAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionAlert(null)}
              className="text-teal-800 font-semibold hover:underline cursor-pointer"
            >
              閉じる
            </button>
          </div>
        )}
      </section>

      {/* Main Workbench: Left = Smartphone Device Mockup, Right = Screen Quick Controls & Live Backend Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Smartphone Device Mockup Canvas */}
        <div className="lg:col-span-6 flex justify-center">
          {/* Smartphone Frame (iPhone 16 Pro Style) */}
          <div className="w-[375px] sm:w-[400px] h-[780px] bg-slate-900 border-[10px] border-slate-800 rounded-[50px] shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700/50">
            {/* Top Speaker / Dynamic Island */}
            <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none">
              <div className="w-28 h-6 bg-black rounded-full flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Native Mobile Status Bar */}
            <div className="bg-slate-900 text-white px-7 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono select-none z-20">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* In-Phone Screen Area */}
            <div className="flex-1 bg-[#849EB5] flex flex-col overflow-hidden relative">
              {/* SCREEN 1: LINE TALK CHAT SCREEN (when not in full LIFF view) */}
              {phoneScreen === 'talk' && (
                <div className="flex-1 flex flex-col h-full bg-[#849EB5]">
                  {/* LINE Talk Header */}
                  <div className="bg-[#2B3B4C] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs z-10">
                    <div className="flex items-center gap-2">
                      <button type="button" className="text-white hover:opacity-80">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
                        四季
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight flex items-center gap-1">
                          <span>四季旅コンシェルジュ</span>
                          <span className="text-[10px] text-emerald-400 font-normal">●公式</span>
                        </div>
                        <div className="text-[10px] text-slate-300">応答時間：数秒以内</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-200">
                      <Search className="w-4 h-4" />
                      <Menu className="w-4 h-4" />
                    </div>
                  </div>

                  {/* LINE Chat Messages Scrollable Feed */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px]">
                        今日 10:40
                      </span>
                    </div>

                    {/* Official Welcome Message */}
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-7 h-7 rounded-full bg-teal-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-1">
                        四季
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-slate-800 leading-relaxed space-y-1.5">
                        <p>{currentPersona?.welcomeMsg}</p>
                        <p className="text-[11px] text-teal-800 font-semibold">
                          希望エリア・ご予算・目的を入力するだけで、AIが「松・竹・梅」3段階プランを即時作成します。
                        </p>
                      </div>
                    </div>

                    {/* Segment Broadcast Card */}
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <div className="w-7 h-7 rounded-full bg-teal-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-1">
                        四季
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none overflow-hidden shadow-xs text-xs w-full">
                        <div className="bg-gradient-to-r from-teal-900 to-slate-800 p-3 text-white space-y-1">
                          <div className="text-[10px] font-mono text-teal-300">
                            セグメント配信 · {currentPersona?.segmentTag}
                          </div>
                          <div className="text-xs font-bold">
                            【秋の特選】{diagnosisInput?.area} AI旅行プラン診断
                          </div>
                          <div className="text-[11px] text-slate-200">
                            過去成約率No.1の竹プラン＆極上離れ松プラン
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-[11px] text-slate-600">
                            わずか30秒で旅の条件を入力し、自社データベースの実績に基づいた3プランを無料診断。
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenLiff('liff_form')}
                            className="w-full py-2 px-3 text-center text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI旅行診断を開始する（LIFF起動）</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* User Consultation Bubble (if user tapped "LINEで相談") */}
                    {chatConsultationSent && (
                      <div className="flex justify-end">
                        <div className="bg-[#60D382] text-slate-900 rounded-2xl rounded-tr-none p-3 shadow-xs text-xs leading-relaxed max-w-[85%] space-y-1">
                          <div className="font-bold">
                            【プラン相談】{activePlan?.tierName}
                          </div>
                          <p className="text-[11px]">
                            {activePlan?.title}（1名あたり {(activePlan?.pricePerPerson ?? 0).toLocaleString()}円）について、正式な空室状況と見積もりをお願いします。
                          </p>
                          <div className="text-right text-[10px] text-slate-700">10:42 既読</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Rich Menu Container (at bottom of LINE chat) */}
                  <div className="bg-white border-t border-slate-300 shrink-0">
                    <div className="bg-slate-800 text-white px-3 py-1 flex items-center justify-between text-[10px]">
                      <span className="font-semibold">リッチメニュー：{currentPersona?.segmentTag}向け</span>
                      <span className="text-teal-300 font-mono text-[9px]">Tap to Launch</span>
                    </div>

                    {/* 6-Grid LINE Rich Menu */}
                    <div className="grid grid-cols-3 divide-x divide-y divide-slate-200 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenLiff('liff_form')}
                        className="p-3 bg-teal-50 hover:bg-teal-100/70 transition-colors cursor-pointer group"
                      >
                        <Sparkles className="w-4 h-4 mx-auto text-[#0F766E] group-hover:scale-110 transition-transform" />
                        <div className="text-[11px] font-bold text-teal-950 mt-0.5">AI旅行診断</div>
                        <div className="text-[9px] text-teal-700">松・竹・梅 即時生成</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenLiff('liff_results')}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Crown className="w-4 h-4 mx-auto text-amber-600" />
                        <div className="text-[11px] font-bold text-slate-800 mt-0.5">松竹梅実績</div>
                        <div className="text-[9px] text-slate-500">過去高評価ツアー</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActionAlert('「スタッフ相談窓口」が開かれました。営業時間内（10:00〜18:00）に専任担当者が返信します。');
                        }}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4 mx-auto text-blue-600" />
                        <div className="text-[11px] font-bold text-slate-800 mt-0.5">スタッフ相談</div>
                        <div className="text-[9px] text-slate-500">チャットで個別対応</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDiagnosisInput((prev) => ({ ...prev, area: '箱根・伊豆' }));
                          handleOpenLiff('liff_form');
                        }}
                        className="p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-slate-800">箱根・伊豆</div>
                        <div className="text-[9px] text-slate-500">名湯・美食特集</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDiagnosisInput((prev) => ({ ...prev, area: '金沢・北陸' }));
                          handleOpenLiff('liff_form');
                        }}
                        className="p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-slate-800">金沢・北陸</div>
                        <div className="text-[9px] text-slate-500">文化・工芸体験</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDiagnosisInput((prev) => ({ ...prev, area: '瀬戸内・四国' }));
                          handleOpenLiff('liff_form');
                        }}
                        className="p-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-slate-800">瀬戸内・四国</div>
                        <div className="text-[9px] text-slate-500">絶景・アート旅</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2 & 3: IN-PHONE LIFF APP MODAL / SHEET */}
              {isLiffOpen && (
                <div className="absolute inset-0 bg-white flex flex-col z-30 animate-in slide-in-from-bottom duration-200">
                  {/* LIFF In-App Browser Header */}
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloseLiff}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                        aria-label="LIFFを閉じる"
                      >
                        <X className="w-4 h-4 text-slate-300" />
                      </button>
                      <div className="text-[11px] font-mono text-slate-300 truncate max-w-[170px]">
                        liff.line.me/travel-dx
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </div>

                  {/* LIFF Sub Navigation Tabs */}
                  <div className="bg-slate-100 px-3 py-1.5 flex items-center justify-between border-b border-slate-200 text-xs shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPhoneScreen('liff_form')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          phoneScreen === 'liff_form'
                            ? 'bg-[#0F766E] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        旅行条件入力
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneScreen('liff_results')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          phoneScreen === 'liff_results'
                            ? 'bg-[#0F766E] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        松竹梅3プラン結果
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseLiff}
                      className="text-[11px] text-teal-800 font-semibold cursor-pointer"
                    >
                      トークへ戻る
                    </button>
                  </div>

                  {/* LIFF FORM VIEW */}
                  {phoneScreen === 'liff_form' && (
                    <form
                      onSubmit={handleRunAiDiagnosis}
                      className="flex-1 overflow-y-auto p-4 space-y-4 text-xs"
                    >
                      <div className="text-center pb-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900">
                          AI旅行診断：ご希望の条件を選択
                        </div>
                        <div className="text-[10px] text-slate-500">
                          旅行DBの過去催行実績（Wordデータ変換済）から最適選定
                        </div>
                      </div>

                      {/* Area */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-800">1. ご希望エリア</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['箱根・伊豆', '金沢・北陸', '瀬戸内・四国', '京都・奈良'] as const).map((area) => (
                            <button
                              type="button"
                              key={area}
                              onClick={() => setDiagnosisInput({ ...diagnosisInput, area })}
                              className={`py-2 px-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                                diagnosisInput?.area === area
                                  ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Companion & Purpose */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-800">2. 同行者タイプ</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['夫婦・パートナー', '家族・三世代', '友人グループ', 'ひとり旅'] as const).map((comp) => (
                            <button
                              type="button"
                              key={comp}
                              onClick={() => setDiagnosisInput({ ...diagnosisInput, companion: comp })}
                              className={`py-1.5 px-2 rounded-lg border text-center text-[11px] font-medium transition-colors cursor-pointer ${
                                diagnosisInput?.companion === comp
                                  ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              {comp}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-800">3. 旅のテーマ・目的</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['温泉・美食', '歴史・伝統文化', '自然・絶景', '記念日・特別体験'] as const).map((purp) => (
                            <button
                              type="button"
                              key={purp}
                              onClick={() => setDiagnosisInput({ ...diagnosisInput, purpose: purp })}
                              className={`py-1.5 px-2 rounded-lg border text-center text-[11px] font-medium transition-colors cursor-pointer ${
                                diagnosisInput?.purpose === purp
                                  ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              {purp}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Duration & Budget */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-800">4. 日程</label>
                          <div className="grid grid-cols-3 gap-1">
                            {(['1泊2日', '2泊3日', '3泊4日'] as const).map((dur) => (
                              <button
                                type="button"
                                key={dur}
                                onClick={() => setDiagnosisInput({ ...diagnosisInput, duration: dur })}
                                className={`py-1 text-[10px] font-medium rounded border transition-colors cursor-pointer ${
                                  diagnosisInput?.duration === dur
                                    ? 'border-[#0F766E] bg-teal-50 text-teal-950 font-bold'
                                    : 'border-slate-200 bg-white text-slate-600'
                                }`}
                              >
                                {dur}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="phone-pax" className="font-bold text-slate-800">5. 人数</label>
                          <select
                            id="phone-pax"
                            value={diagnosisInput?.pax ?? 2}
                            onChange={(e) => setDiagnosisInput({ ...diagnosisInput, pax: Number(e.target.value) })}
                            className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800"
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>
                                {n}名
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Budget Slider */}
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">1名あたりご予算目安</span>
                          <span className="font-mono font-bold text-teal-800 tabular-nums">
                            {(diagnosisInput?.budgetPerPerson ?? 60000).toLocaleString()}円
                          </span>
                        </div>
                        <input
                          type="range"
                          min={30000}
                          max={120000}
                          step={5000}
                          value={diagnosisInput?.budgetPerPerson ?? 60000}
                          onChange={(e) => setDiagnosisInput({ ...diagnosisInput, budgetPerPerson: Number(e.target.value) })}
                          className="w-full accent-[#0F766E] cursor-pointer"
                        />
                        <div className="text-[10px] text-slate-500 text-right tabular-nums">
                          {diagnosisInput?.pax ?? 2}名合計：{((diagnosisInput?.budgetPerPerson ?? 60000) * (diagnosisInput?.pax ?? 2)).toLocaleString()}円
                        </div>
                      </div>

                      {/* Free Request */}
                      <div className="space-y-1">
                        <label htmlFor="phone-free" className="font-bold text-slate-800">こだわり自由入力</label>
                        <textarea
                          id="phone-free"
                          rows={2}
                          value={diagnosisInput?.freeText ?? ''}
                          onChange={(e) => setDiagnosisInput({ ...diagnosisInput, freeText: e.target.value })}
                          placeholder="例：露天風呂付き客室、個室食、足腰に優しい移動..."
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full py-3 px-4 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isGenerating ? 'AI検索＆松竹梅プランを生成中...' : '松・竹・梅 3プランを生成'}</span>
                      </button>
                    </form>
                  )}

                  {/* LIFF RESULTS VIEW */}
                  {phoneScreen === 'liff_results' && activePlan && (
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                      {/* Tier Switcher Tabs */}
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                        {(generatedPlans ?? []).map((p) => (
                          <button
                            type="button"
                            key={p.tier}
                            onClick={() => setSelectedTierTab(p.tier)}
                            className={`py-1.5 text-center text-xs font-bold rounded transition-colors cursor-pointer ${
                              selectedTierTab === p.tier
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            【{p.tier}プラン】
                          </button>
                        ))}
                      </div>

                      {/* Plan Card */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs space-y-3">
                        <div className={`p-4 bg-gradient-to-br ${activePlan.themeGradient} text-white space-y-1.5`}>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-teal-200">{activePlan.tierName}</span>
                            <span className="font-mono text-slate-300 tabular-nums">一致度: {activePlan.ragMatchScore}%</span>
                          </div>
                          <div className="text-sm font-bold leading-snug">{activePlan.title}</div>
                          <div className="text-[11px] text-slate-200">{activePlan.subtitle}</div>
                        </div>

                        {/* Plan Thumbnail Image (Reinstalled between Plan Name and Price) */}
                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                          <img
                            src={activePlan.imageUrl}
                            alt={activePlan.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white">
                            <span className="px-2 py-0.5 rounded-sm bg-black/60 font-semibold backdrop-blur-xs">
                              {activePlan.tier === '松'
                                ? '【松】特選離れ・極上露天'
                                : activePlan.tier === '竹'
                                ? '【竹】展望リゾート・王道'
                                : '【梅】街歩き・スマート旅'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-200">
                              実績コード: {activePlan.sourceRecordCode}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 space-y-3">
                          {/* Price & Reference */}
                          <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                            <span className="text-[11px] text-slate-500">1名あたり目安</span>
                            <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                              {activePlan.pricePerPerson.toLocaleString()}円
                              <span className="text-[10px] font-normal text-slate-500">（税込）</span>
                            </span>
                          </div>

                          {/* Recommendation reason */}
                          <div className="p-2.5 bg-teal-50/70 border border-teal-200/80 rounded-lg text-[11px] text-slate-700 leading-relaxed">
                            <span className="font-bold text-teal-950">AI推薦理由：</span>
                            {activePlan.recommendReason}
                          </div>

                          {/* Specs */}
                          <div className="space-y-1 text-[11px]">
                            <div className="text-slate-600"><span className="font-bold text-slate-800">宿：</span>{activePlan.accommodation}</div>
                            <div className="text-slate-600"><span className="font-bold text-slate-800">食：</span>{activePlan.meals}</div>
                            <div className="text-slate-600"><span className="font-bold text-slate-800">交：</span>{activePlan.transport}</div>
                          </div>

                          {/* Action Button: Send to LINE Chat */}
                          <button
                            type="button"
                            onClick={handleSendToChat}
                            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>LINEトークへ送信して相談する</span>
                          </button>
                        </div>
                      </div>

                      {/* In-Phone Feedback Form */}
                      <form
                        onSubmit={handleSubmitFeedback}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">プラン評価・口コミ</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setFeedbackRating(star)}
                                className={`p-0.5 cursor-pointer ${star <= feedbackRating ? 'text-amber-500' : 'text-slate-300'}`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="感想やご要望を入力..."
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs text-slate-800"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 text-[11px] font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          旅行DBへ評価を送信
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="bg-slate-900 py-1.5 shrink-0 z-20">
              <div className="w-32 h-1 bg-slate-500 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        {/* Right Column: Screen Quick Controller & Live Backend Data Telemetry */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Smartphone Screen Quick Controller */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-xs text-teal-800 font-semibold">画面クイック切替コントローラー</div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                スマートフォンの画面表示をワンタップで切り替え
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsLiffOpen(false);
                  setPhoneScreen('talk');
                }}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  !isLiffOpen && phoneScreen === 'talk'
                    ? 'border-[#0F766E] bg-teal-50/70 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">1. LINEトーク画面</div>
                <div className="text-[11px] text-slate-500 mt-0.5">チャット＆リッチメニュー</div>
              </button>

              <button
                type="button"
                onClick={() => handleOpenLiff('liff_form')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  isLiffOpen && phoneScreen === 'liff_form'
                    ? 'border-[#0F766E] bg-teal-50/70 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">2. LIFF条件診断</div>
                <div className="text-[11px] text-slate-500 mt-0.5">エリア・予算入力フォーム</div>
              </button>

              <button
                type="button"
                onClick={() => handleOpenLiff('liff_results')}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  isLiffOpen && phoneScreen === 'liff_results'
                    ? 'border-[#0F766E] bg-teal-50/70 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">3. 松竹梅3プラン</div>
                <div className="text-[11px] text-slate-500 mt-0.5">AI提案比較＆フィードバック</div>
              </button>
            </div>
          </div>

          {/* Card 2: Live Backend & Database Synchronization */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-teal-800 font-semibold">裏側システム連動モニター</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Cloudflare API · 旅行DB (D1) · GAS自動連携
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                全{(feedbackLogs ?? []).length}件
              </span>
            </div>

            {/* D1 Query Preview */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">
                実行中D1 SQLクエリ ＆ RAG検索パラメータ
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
{`-- Cloudflare D1 + Vectorize Query
SELECT code, title, tier, price_per_person
FROM travel_records
WHERE area = '${diagnosisInput?.area ?? '箱根・伊豆'}'
  AND companion = '${diagnosisInput?.companion ?? '夫婦・パートナー'}'
-- 抽出根拠: 松(${generatedPlans?.[0]?.sourceRecordCode ?? ''}) / 竹(${generatedPlans?.[1]?.sourceRecordCode ?? ''}) / 梅(${generatedPlans?.[2]?.sourceRecordCode ?? ''})`}
              </pre>
            </div>

            {/* Real-time Sheets Sync Feed */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Googleスプレッドシート / GAS自動出力台帳
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                      <th className="py-2 px-3 font-semibold">時刻 / アクション</th>
                      <th className="py-2 px-3 font-semibold">内容・コメント</th>
                      <th className="py-2 px-3 font-semibold text-right">評価</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(feedbackLogs ?? []).slice(0, 4).map((log) => (
                      <tr key={log?.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 align-top whitespace-nowrap">
                          <div className="font-mono text-[11px] text-slate-500 tabular-nums">{log?.timestamp}</div>
                          <div className="font-bold text-slate-900 text-[11px]">{log?.actionType}</div>
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="font-semibold text-slate-800">【{log?.selectedTier}】{log?.userSegment}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-1">{log?.comment}</div>
                        </td>
                        <td className="py-2.5 px-3 align-top text-right font-mono font-bold text-amber-600 tabular-nums">
                          ★{log?.rating}.0
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
