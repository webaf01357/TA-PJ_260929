import React, { useState, useEffect } from 'react';
import {
  ARCHITECTURE_NODES,
  DATA_FLYWHEEL_STEPS,
  ArchitectureNode
} from '../data/proposalData';
import {
  ArrowDown,
  ArrowRight,
  Play,
  RotateCcw,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface ArchitectureDiagramViewProps {
  onLaunchMockup: (initialStep?: 'line' | 'diagnosis' | 'results') => void;
  onNavigateTab: (tab: 'architecture' | 'mockup' | 'database' | 'estimate') => void;
}

export const ArchitectureDiagramView: React.FC<ArchitectureDiagramViewProps> = ({
  onLaunchMockup,
  onNavigateTab
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('liff_app');
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(false);
  const [activeFlowIndex, setActiveFlowIndex] = useState<number | null>(null);

  const selectedNode: ArchitectureNode =
    ARCHITECTURE_NODES.find((n) => n?.id === selectedNodeId) ?? ARCHITECTURE_NODES[2];

  useEffect(() => {
    if (!isSimulatingFlow) return;
    const timer = setInterval(() => {
      setActiveFlowIndex((prev) => {
        const next = prev === null ? 0 : prev + 1;
        if (next >= (ARCHITECTURE_NODES?.length ?? 0)) {
          setIsSimulatingFlow(false);
          return null;
        }
        const targetNode = ARCHITECTURE_NODES[next];
        if (targetNode?.id) {
          setSelectedNodeId(targetNode.id);
        }
        return next;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isSimulatingFlow]);

  const handleStartFlowTrace = () => {
    setActiveFlowIndex(0);
    const firstNode = ARCHITECTURE_NODES[0];
    if (firstNode?.id) {
      setSelectedNodeId(firstNode.id);
    }
    setIsSimulatingFlow(true);
  };

  const handleStopFlowTrace = () => {
    setIsSimulatingFlow(false);
    setActiveFlowIndex(null);
  };

  const isNodeHighlighted = (id: string) => selectedNodeId === id;

  return (
    <div className="space-y-10">
      {/* Section Header & Executive Principle */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs text-slate-500 font-medium">
              <span>ご提案書 第1章・第2章・第18章準拠</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>基本方針：「最初から大規模なCRMを作らない」</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span className="tabular-nums">初期構築 3,370,000円（税別）</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              旅行顧客DX・AI旅行提案システム 全体構成図
            </h1>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              社内に蓄積された過去の旅行実績（Word企画書・ツアー情報）をデータベース資産化し、LINE公式アカウントとLIFFを入口としてAI/RAGが「松・竹・梅」の3段階プランを提案。顧客の反応・評価を再び旅行DBへ還流させる循環型アーキテクチャです。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!isSimulatingFlow ? (
              <button
                type="button"
                onClick={handleStartFlowTrace}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-teal-700" />
                <span>データ循環を順送り再生</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopFlowTrace}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>トレース停止（現在 Step {(activeFlowIndex ?? 0) + 1}/7）</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onLaunchMockup?.('diagnosis')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>LIFF・AI旅行提案モックアップを開く</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Key Quantitative Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div>
            <div className="text-xs text-slate-500">初期導入機能範囲</div>
            <div className="mt-1 text-xl font-bold text-slate-900 tabular-nums">全15項目（7区分 A〜G）</div>
            <div className="mt-0.5 text-xs text-slate-500">旅行DB・RAG・LIFF・GAS連携まで網羅</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">初期構築費合計（税別）</div>
            <div className="mt-1 text-xl font-bold text-slate-900 tabular-nums">3,370,000円</div>
            <div className="mt-0.5 text-xs text-slate-500">大規模CRMを省き初期投資を最小化</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">本番月額システム利用料目安</div>
            <div className="mt-1 text-xl font-bold text-slate-900 tabular-nums">3,000〜15,000円/月</div>
            <div className="mt-0.5 text-xs text-slate-500">Cloudflare + AI API + LINE公式</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">2年間総投資額目安（税別）</div>
            <div className="mt-1 text-xl font-bold text-teal-800 tabular-nums">約4,170,000円</div>
            <div className="mt-0.5 text-xs text-slate-500">基本保守（1.5万円/月）・改善予算含む</div>
          </div>
        </div>
      </section>

      {/* Main Interactive Architecture Blueprint + Node Technical Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Visual System Architecture Diagram */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                システム全体構成図（インタラクティブ設計図）
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                各ブロックをクリックすると、右パネルに該当モジュールの技術仕様・入出力データ・見積内訳を表示します
              </p>
            </div>
            <span className="text-xs text-teal-800 font-medium tabular-nums">
              選択中: {selectedNode?.stepNumber ?? '03'}. {selectedNode?.title ?? ''}
            </span>
          </div>

          {/* Diagram Canvas */}
          <div className="space-y-3">
            {/* Layer 1: Customer */}
            <div
              onClick={() => setSelectedNodeId('customer')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isNodeHighlighted('customer')
                  ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">01</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">【お客様】スマートフォン（LINE利用）</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      日常のLINE画面から旅行診断・プラン比較・相談・感想送信までシームレスに利用
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">顧客接点</span>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center py-0.5">
              <div className="flex flex-col items-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* Layer 2: LINE Official Account */}
            <div
              onClick={() => setSelectedNodeId('line_oa')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isNodeHighlighted('line_oa')
                  ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-teal-800 tabular-nums">02</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">【LINE公式アカウント / Messaging API】</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      顧客属性タグと連動したリッチメニュー制御・セグメント別配信・旅行プラン入口
                    </div>
                  </div>
                </div>
                <span className="text-xs text-teal-800 font-mono tabular-nums shrink-0">D. LINE接点 (45万円)</span>
              </div>

              {/* 3 Branches inside LINE Official Account as shown in PDF Page 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-800">├─ リッチメニュー出し分け</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">顧客属性・過去参加歴で表示切替</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-800">├─ セグメント配信</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">興味エリア・目的タグ別に配信</div>
                </div>
                <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200">
                  <div className="text-xs font-semibold text-teal-900">└─ 旅行プラン診断入口</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">タップでLIFF診断アプリを起動</div>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center py-0.5">
              <div className="flex items-center gap-2 text-xs text-teal-800 font-medium">
                <ArrowDown className="w-4 h-4" />
                <span>LINEユーザーID自動連携・LIFF起動</span>
              </div>
            </div>

            {/* Layer 3: LIFF Travel Diagnosis App (Mockup Target Highlight) */}
            <div
              onClick={() => setSelectedNodeId('liff_app')}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isNodeHighlighted('liff_app')
                  ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20'
                  : 'border-teal-600/60 bg-teal-50/20 hover:border-[#0F766E]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-semibold text-teal-800 tabular-nums mt-0.5">03</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        【LIFF】LINE内旅行診断・プラン提案Webアプリ
                      </span>
                      <span className="text-xs font-semibold text-teal-800">
                        ★ 本Webモックアップ実装対象
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      旅行条件・希望を入力（希望エリア · 同行者 · 人数 · ご予算 · 日程 · 旅の目的）＆ AI生成された「松・竹・梅」3プランの比較・評価画面
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchMockup?.('diagnosis');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>モックアップ画面を試す</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center py-0.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ArrowDown className="w-4 h-4" />
                <span>HTTPS JSONリクエスト（旅行条件・LINE User ID）</span>
              </div>
            </div>

            {/* Layer 4: Cloudflare / API Gateway */}
            <div
              onClick={() => setSelectedNodeId('cloudflare_api')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isNodeHighlighted('cloudflare_api')
                  ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">04</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">【Cloudflare / API サーバーレス基盤】</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      認証検証 · 条件フィルタリング実行 · RAG検索＆AIプロンプト制御 · 行動ログ記録（月額1,000〜3,000円の低コスト運用）
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">A/F. 設計・環境 (25万円)</span>
              </div>
            </div>

            {/* Split Connector to Travel DB & AI/RAG */}
            <div className="grid grid-cols-2 gap-4 py-0.5">
              <div className="flex flex-col items-center text-xs text-slate-500">
                <ArrowDown className="w-4 h-4" />
                <span>SQL条件フィルタリング</span>
              </div>
              <div className="flex flex-col items-center text-xs text-slate-500">
                <ArrowDown className="w-4 h-4" />
                <span>ベクトル類似検索・LLM生成</span>
              </div>
            </div>

            {/* Layer 5: Dual Core — Travel DB (D1) & AI/RAG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Travel DB */}
              <div
                onClick={() => setSelectedNodeId('travel_db')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isNodeHighlighted('travel_db')
                    ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-teal-800 tabular-nums">05 · 旅行データ資産</span>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">B. 60万円</span>
                </div>
                <div className="text-sm font-bold text-slate-900">【旅行DB（Cloudflare D1）】</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  過去のWord旅行資料をAI一次変換・品質確認して構造化格納。顧客属性・閲覧行動・評価フィードバックも一元蓄積。
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-800 font-medium">
                  <span>Word過去資料 → AI構造化変換</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab?.('database');
                    }}
                    className="underline hover:text-teal-950 cursor-pointer"
                  >
                    DB中身を見る →
                  </button>
                </div>
              </div>

              {/* AI / RAG */}
              <div
                onClick={() => setSelectedNodeId('ai_rag')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isNodeHighlighted('ai_rag')
                    ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-teal-800 tabular-nums">06 · 検索拡張生成</span>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">B/C. 64万円</span>
                </div>
                <div className="text-sm font-bold text-slate-900">【AI / RAG 推薦エンジン】</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  条件一致＋類似旅行検索により、自社の過去高評価ツアー実績を根拠にした「松・竹・梅」3段階プランを自動生成。
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                  類似度スコア × 過去満足度 × 予算レンジ最適化
                </div>
              </div>
            </div>

            {/* Merge Connector to Pine / Bamboo / Plum Output */}
            <div className="flex justify-center py-0.5">
              <div className="flex items-center gap-2 text-xs text-teal-800 font-medium">
                <ArrowDown className="w-4 h-4" />
                <span>AI旅行プラン生成（松・竹・梅 3段階提示）</span>
              </div>
            </div>

            {/* Pine / Bamboo / Plum 3-Tier Output Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-800">
                  AI旅行プラン生成 → LINE / LIFFへ表示
                </div>
                <span className="text-xs text-slate-500">C. 松竹梅提案・回答品質調整</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-amber-300/80">
                  <div className="text-xs font-bold text-amber-900">【松】特選・極上体験</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    露天付客室・専用送迎・特別拝観など妥協のない上位提案
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-teal-400">
                  <div className="text-xs font-bold text-teal-900">【竹】王道・高満足度</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    希望予算にピタリ収まる過去成約率No.1の本命バランス提案
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-300">
                  <div className="text-xs font-bold text-slate-800">【梅】スマート・厳選</div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    好立地宿＋自由行動を活かした気軽で高コスパな提案
                  </div>
                </div>
              </div>
            </div>

            {/* Connector to Customer Action & Admin/DB Feedback Loop */}
            <div className="flex justify-center py-0.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ArrowDown className="w-4 h-4" />
                <span>顧客の閲覧 · クリック · 問い合わせ · 評価 · 感想を取得</span>
              </div>
            </div>

            {/* Layer 6: Admin / Google Sheets / GAS & Return Loop to Travel DB */}
            <div
              onClick={() => setSelectedNodeId('admin_gas')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isNodeHighlighted('admin_gas')
                  ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">07</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      【旅行DBへ還流蓄積】＋【Googleスプレッドシート / GAS業務自動化】
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      閲覧・相談・評価データを【旅行DB】へ保存し次回の旅行提案へ再利用。同時にスプレッドシート出力＆スタッフ通知を自動化。
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">E. 管理支援 (38万円)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Selected Architecture Node Technical Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 lg:sticky lg:top-20 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <div className="text-xs text-teal-800 font-medium">
              <span>モジュール詳細仕様</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{selectedNode?.layerLabel ?? 'システム層'}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {selectedNode?.stepNumber ?? '00'}. {selectedNode?.title ?? ''}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{selectedNode?.subtitle ?? ''}</p>
          </div>

          {/* Summary & Cost Reference */}
          <div className="space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">{selectedNode?.summary ?? ''}</p>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">関連見積項目：</span>
                <span className="font-semibold text-slate-800">{selectedNode?.estimateRef ?? ''}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {(selectedNode?.estimateCost ?? 0).toLocaleString()}円相当
              </span>
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900">主な構築機能・役割</h4>
            <ul className="space-y-2">
              {(selectedNode?.keyFeatures ?? []).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data I/O Contract */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500">入力データ (Input)</div>
              <div className="text-xs text-slate-800 mt-1 leading-snug">{selectedNode?.dataInput ?? ''}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500">出力・連携先 (Output)</div>
              <div className="text-xs text-slate-800 mt-1 leading-snug">{selectedNode?.dataOutput ?? ''}</div>
            </div>
          </div>

          {/* Tech Stack Unboxed Metadata */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-900">採用技術・インターフェース</div>
            <div className="text-xs text-slate-600 font-mono">
              {(selectedNode?.techStack ?? []).join('  /  ')}
            </div>
          </div>

          {/* Sample Payload / SQL / Code */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-900">データ構造・クエリ実装イメージ</div>
            <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto">
              {selectedNode?.samplePayload ?? ''}
            </pre>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() =>
                onLaunchMockup?.(
                  selectedNode?.id === 'line_oa'
                    ? 'line'
                    : selectedNode?.id === 'ai_rag'
                    ? 'results'
                    : 'diagnosis'
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors cursor-pointer"
            >
              <span>この構成要素をWebモックアップで操作する</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 18: Continuous Data Flywheel (データ循環モデル) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              ご提案書 第18章「投資効果の考え方 — データ循環」
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              単発のAI導入ではなく、旅行会社独自の「データ資産」を形成する循環サイクル
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            これまで個別に散在していた「旅行実績・顧客情報・旅行提案・LINE・顧客の反応・口コミ評価」を一つのデータ循環として統合します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {(DATA_FLYWHEEL_STEPS ?? []).map((item, idx) => (
            <div
              key={item?.step ?? idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold text-teal-800 tabular-nums">STEP {item?.step ?? ''}</span>
                  <span>{item?.badge ?? ''}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item?.title ?? ''}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item?.desc ?? ''}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400">
                <span>循環プロセス</span>
                <span>{idx < (DATA_FLYWHEEL_STEPS?.length ?? 0) - 1 ? '次工程へ →' : '↻ Step 02へ還流'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
