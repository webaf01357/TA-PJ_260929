export interface ArchitectureNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  layer: 'client' | 'line' | 'edge' | 'data_ai' | 'output' | 'ops';
  layerLabel: string;
  estimateRef: string;
  estimateCost: number;
  summary: string;
  keyFeatures: string[];
  dataInput: string;
  dataOutput: string;
  techStack: string[];
  samplePayload: string;
  isMockupTarget?: boolean;
}

export interface TravelRecord {
  id: string;
  code: string;
  title: string;
  area: '箱根・伊豆' | '金沢・北陸' | '瀬戸内・四国' | '京都・奈良';
  companion: '夫婦・パートナー' | '家族・三世代' | '友人グループ' | 'ひとり旅';
  purpose: '温泉・美食' | '歴史・伝統文化' | '自然・絶景' | '記念日・特別体験';
  duration: '1泊2日' | '2泊3日' | '3泊4日';
  tier: '松' | '竹' | '梅';
  pricePerPerson: number;
  satisfactionScore: number;
  repeatCount: number;
  sourceDoc: string;
  highlights: string[];
  customerVoice: string;
  tags: string[];
}

export interface DiagnosisInput {
  area: '箱根・伊豆' | '金沢・北陸' | '瀬戸内・四国' | '京都・奈良';
  companion: '夫婦・パートナー' | '家族・三世代' | '友人グループ' | 'ひとり旅';
  purpose: '温泉・美食' | '歴史・伝統文化' | '自然・絶景' | '記念日・特別体験';
  duration: '1泊2日' | '2泊3日' | '3泊4日';
  pax: number;
  budgetPerPerson: number;
  freeText: string;
  lineSegmentTag: string;
}

import matsuThumb from '../assets/images/plan_matsu_thumbnail_1790674017556.jpg';
import takeThumb from '../assets/images/plan_take_thumbnail_1790674035745.jpg';
import umeThumb from '../assets/images/plan_ume_thumbnail_1790674051732.jpg';

export interface GeneratedPlanTier {
  tier: '松' | '竹' | '梅';
  tierName: string;
  tierConcept: string;
  title: string;
  subtitle: string;
  themeGradient: string;
  imageUrl: string;
  pricePerPerson: number;
  totalPrice: number;
  ragMatchScore: number;
  sourceRecordCode: string;
  sourceRecordTitle: string;
  accommodation: string;
  meals: string;
  transport: string;
  recommendReason: string;
  itinerary: {
    day: string;
    schedule: string[];
  }[];
  includedTags: string[];
}

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  lineUserId: string;
  userSegment: string;
  selectedTier: '松' | '竹' | '梅';
  planTitle: string;
  actionType: 'プラン詳細閲覧' | 'お気に入り保存' | '相談・見積リクエスト' | '評価・感想送信';
  rating: number;
  comment: string;
  syncedToSheets: boolean;
}

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'customer',
    stepNumber: '01',
    title: 'お客様（旅行検討・リピーター）',
    subtitle: 'スマートフォンLINEアプリからの日常接点',
    layer: 'client',
    layerLabel: '顧客接点レイヤー',
    estimateRef: 'A. 全体設計 / D. LINE導線設計',
    estimateCost: 140000,
    summary: '新規顧客および過去旅行参加者が、使い慣れたLINEアプリからワンタップで旅行診断・プラン相談・感想フィードバックを行える体験を提供します。',
    keyFeatures: [
      '専用アプリの追加インストール不要（LINE内で完結）',
      '顧客属性（家族層・夫婦旅・温泉好き等）に応じたリッチメニュー表示',
      '提案された「松・竹・梅」プランの比較・保存・スタッフ相談',
      '旅行後の感想・評価フィードバックの簡単送信'
    ],
    dataInput: 'セグメント配信通知・リッチメニュー表示',
    dataOutput: 'タップ操作・旅行条件入力・プラン閲覧・評価コメント',
    techStack: ['LINE iOS / Android Client', 'LINEログイン認証'],
    samplePayload: `{
  "lineUserId": "U89a1c4f0e2...",
  "displayName": "佐藤 健一 様",
  "currentSegment": ["夫婦旅", "温泉・美食関心", "過去参加2回"],
  "richMenuId": "richmenu-premium-couple-v1"
}`
  },
  {
    id: 'line_oa',
    stepNumber: '02',
    title: 'LINE公式アカウント / Messaging API',
    subtitle: 'リッチメニュー出し分け・セグメント配信・旅行プラン入口',
    layer: 'line',
    layerLabel: 'LINEチャネル層',
    estimateRef: 'D. LINE顧客接点構築',
    estimateCost: 450000,
    summary: '既存のLINE公式アカウントとMessaging APIを連携。大規模CRMを導入せずとも、顧客タグ・利用状況に応じたリッチメニュー出し分けとセグメント配信を実現します。',
    keyFeatures: [
      'リッチメニュー出し分け（初回登録者 / 診断済み / リピーター別）',
      '興味関心タグ（エリア・目的・予算帯）に基づくセグメント配信',
      'AI生成された「松・竹・梅」3プランのFlex Message通知',
      'メッセージ開封・リンククリック等の行動データ取得'
    ],
    dataInput: 'ユーザー操作イベント / CloudflareからのPush配信指示',
    dataOutput: 'Webhookイベント / LIFF起動遷移 / Flex Message表示',
    techStack: ['LINE Messaging API', 'Dynamic Rich Menu API', 'Flex Message Simulator'],
    samplePayload: `{
  "destination": "U89a1c4f0e2...",
  "messages": [
    {
      "type": "flex",
      "altText": "AI旅行診断結果：箱根・伊豆【松・竹・梅】3プランのご提案",
      "contents": { "type": "carousel", "bubbles": ["松プラン", "竹プラン", "梅プラン"] }
    }
  ]
}`,
    isMockupTarget: true
  },
  {
    id: 'liff_app',
    stepNumber: '03',
    title: 'LIFF 旅行診断・プラン比較Webアプリ',
    subtitle: 'LINE内で起動する旅行条件入力＆松・竹・梅インタラクティブ提案画面',
    layer: 'line',
    layerLabel: 'LIFFフロントエンド層（本モックアップ対象）',
    estimateRef: 'D. LIFF構築 (250,000円) / C. 旅行条件入力 (80,000円)',
    estimateCost: 330000,
    summary: 'LINEトーク画面からシームレスに立ち上がるWebアプリ（LIFF）。LINEユーザーIDと自動紐付けし、直感的なUIで希望条件（エリア・人数・予算・目的）を入力、AI提案された「松・竹・梅」プランを比較・評価できます。',
    keyFeatures: [
      'LINEユーザーIDの自動取得と顧客プロファイル紐付け',
      'ステップ形式の旅行条件入力（エリア・同行者・予算・日程・目的）',
      'AI/RAGが生成した「松・竹・梅」3段階プランの並列比較UI',
      'プラン詳細閲覧・ワンタップ見積相談・5段階評価フィードバック送信'
    ],
    dataInput: 'LINE IDトークン + 顧客が選択した旅行条件・こだわりキーワード',
    dataOutput: 'Cloudflare APIへの診断リクエスト + 閲覧・クリック・評価ログ',
    techStack: ['LINE Front-end Framework (LIFF v2)', 'React / TypeScript', 'Tailwind CSS'],
    samplePayload: `{
  "liffContext": { "userId": "U89a1c4f0e2...", "viewType": "tall" },
  "diagnosisInput": {
    "area": "箱根・伊豆",
    "companion": "夫婦・パートナー",
    "purpose": "温泉・美食",
    "duration": "1泊2日",
    "pax": 2,
    "budgetPerPerson": 65000
  }
}`,
    isMockupTarget: true
  },
  {
    id: 'cloudflare_api',
    stepNumber: '04',
    title: 'Cloudflare Workers / APIゲートウェイ',
    subtitle: '低コスト・高拡張なサーバーレスAPI＆認証・ルーティング基盤',
    layer: 'edge',
    layerLabel: 'エッジAPI・制御層',
    estimateRef: 'A. 全体システム設計 / F. 本番環境構築 (Cloudflare等)',
    estimateCost: 250000,
    summary: '初期投資および月額インフラ費（月額1,000〜3,000円程度）を最小限に抑えるため、Cloudflareのエッジ基盤を採用。LIFF・LINE Webhook・旅行DB・AI API間を高速かつセキュアに中継します。',
    keyFeatures: [
      'LINE Webhook署名検証およびLIFF IDトークン認証検証',
      '条件フィルタリングとRAG検索クエリのオーケストレーション',
      '顧客行動ログ（閲覧・クリック・滞在時間）の非同期記録',
      '将来的な顧客数・業務量増加にもそのままスケールする設計'
    ],
    dataInput: 'LIFF診断リクエスト / LINE Webhookイベント',
    dataOutput: 'D1 SQLクエリ / Vectorize RAG検索 / AIプロンプト実行 / GAS連携Webhook',
    techStack: ['Cloudflare Workers', 'Hono / TypeScript', 'Cloudflare Queues'],
    samplePayload: `POST /api/v1/travel-diagnosis
Authorization: Bearer <LIFF_ID_TOKEN>
X-Edge-Location: NRT (Tokyo)
Response Time: 38ms (DB Filter) + 0.9s (RAG + LLM Synthesis)`
  },
  {
    id: 'travel_db',
    stepNumber: '05',
    title: '旅行DB（Cloudflare D1 データ資産基盤）',
    subtitle: '過去Word旅行資料の構造化データ＋顧客属性・反応履歴の一元蓄積',
    layer: 'data_ai',
    layerLabel: 'データ資産・AI層',
    estimateRef: 'B. 過去旅行データ・旅行DB構築 (600,000円)',
    estimateCost: 600000,
    summary: '社内に眠っていた過去のWord旅行企画書・行程表・ツアー実績を解析・AI一次変換し、再利用可能なデータベース（D1）として資産化。さらに顧客の反応・口コミも同一DBに循環蓄積します。',
    keyFeatures: [
      'Word過去資料の構造化（エリア・宿・食事・行程・予算・満足度）',
      'AIによるデータ一次変換＋重複・欠損・異常データの品質確認',
      '顧客テーブル（LINE ID・属性タグ・過去診断履歴・興味セグメント）',
      'フィードバック蓄積による「成約率・満足度の高い実績」の自動重み付け'
    ],
    dataInput: '過去Word旅行資料（初期構築時）＋ 日々の顧客行動・評価データ（運用時）',
    dataOutput: '条件フィルタリングされた候補旅行データ群',
    techStack: ['Cloudflare D1 (SQLite Edge DB)', 'Drizzle ORM', 'Word Parser Pipeline'],
    samplePayload: `SELECT tour_code, title, tier, price_per_person, satisfaction_score
FROM travel_records
WHERE area = '箱根・伊豆' AND companion_type = '夫婦・パートナー'
ORDER BY satisfaction_score DESC, repeat_count DESC LIMIT 6;`,
    isMockupTarget: true
  },
  {
    id: 'ai_rag',
    stepNumber: '06',
    title: 'AI / RAG検索・推薦エンジン',
    subtitle: '類似旅行検索＋「松・竹・梅」3段階プラン自動編成ロジック',
    layer: 'data_ai',
    layerLabel: 'データ資産・AI層',
    estimateRef: 'B. RAG検索基盤 (150,000円) / C. AIレコメンドシステム (490,000円)',
    estimateCost: 640000,
    summary: '単なる汎用AIの一般論ではなく、自社が過去に実施して高評価だった実在ツアー実績（旅行DB）をRAG（検索拡張生成）で参照し、根拠のある「松・竹・梅」3プランを生成します。',
    keyFeatures: [
      'ベクトル類似度検索（顧客の自由記述要望と過去ツアー実績の意味検索）',
      '推薦ロジック（条件一致度 × 過去顧客満足度 × 季節適性のハイブリッド算出）',
      '松（特別体験）・竹（王道バランス）・梅（スマート良質）の3段階構成プロンプト制御',
      'ハルシネーション（架空の宿や不可能な行程）を防ぐ実績ベース回答調整'
    ],
    dataInput: '顧客希望条件 ＋ 旅行DBから抽出された過去類似ツアー実績Top候補',
    dataOutput: '構造化された「松・竹・梅」3プランJSON（推薦理由・行程・概算予算・実績根拠つき）',
    techStack: ['Cloudflare Vectorize', 'LLM API (Structured Outputs)', 'Hybrid RAG Pipeline'],
    samplePayload: `{
  "ragRetrievedDocs": ["TRV-2025-089 (類似度: 0.96)", "TRV-2025-014 (類似度: 0.94)", "TRV-2024-112 (類似度: 0.89)"],
  "generatedPlans": {
    "matsu": { "tier": "松", "baseRecord": "TRV-2025-089", "price": 78000 },
    "take":  { "tier": "竹", "baseRecord": "TRV-2025-014", "price": 54000 },
    "ume":   { "tier": "梅", "baseRecord": "TRV-2024-112", "price": 38000 }
  }
}`,
    isMockupTarget: true
  },
  {
    id: 'admin_gas',
    stepNumber: '07',
    title: '管理画面・Googleスプレッドシート / GAS業務自動化',
    subtitle: '過剰な開発を避け、現場スタッフが即座に使える管理・集計・通知基盤',
    layer: 'ops',
    layerLabel: '管理・業務効率化層',
    estimateRef: 'E. 管理・業務支援 (380,000円)',
    estimateCost: 380000,
    summary: '初期段階で高額な専用CRM画面を作り込まず、必要最低限のWeb管理機能と使い慣れたGoogleスプレッドシート/GAS連携を組み合わせることで、日々の確認・通知・月次集計を効率化します。',
    keyFeatures: [
      '旅行データ・顧客データ・AI提案履歴のWeb一覧確認',
      'Googleスプレッドシートへのリアルタイム診断・相談データ自動出力',
      'GAS（Google Apps Script）によるスタッフへの見積相談チャット通知・定型集計',
      '利用数・松竹梅ごとの選択率・顧客反応の可視化レポート'
    ],
    dataInput: '旅行DBの更新イベント / 顧客からの相談・評価アクション',
    dataOutput: 'スプレッドシート台帳更新 / 社内スタッフ通知 / 次回セグメント配信リスト',
    techStack: ['Google Sheets API', 'Google Apps Script (GAS)', 'Lightweight Admin Console'],
    samplePayload: `// GAS Webhook 自動処理
function onNewTravelInquiry(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AI提案・反応履歴');
  sheet.appendRow([new Date(), e.userId, e.selectedTier, e.planTitle, e.rating, e.comment]);
  notifyStaffChannel("新規プラン相談: " + e.planTitle + " (" + e.selectedTier + ")");
}`
  }
];

export const DATA_FLYWHEEL_STEPS = [
  {
    step: '01',
    title: '過去の旅行実績（Word資料等）',
    desc: '社内に蓄積された過去の企画書・行程表・ツアー実績を整理し、AIで構造化データへ一次変換。',
    badge: '資産化フェーズ'
  },
  {
    step: '02',
    title: '旅行DB（D1）＋ RAG検索基盤',
    desc: 'エリア・予算・同行者・過去の顧客評価を検索可能なデータベース＆ベクトルインデックスとして格納。',
    badge: 'データ基盤'
  },
  {
    step: '03',
    title: 'LINE・LIFFでの旅行診断＆松・竹・梅提案',
    desc: 'お客様の希望条件に対し、過去の高評価実績を根拠とした「松・竹・梅」3段階プランをAIが即座に編成。',
    badge: 'AI顧客接点'
  },
  {
    step: '04',
    title: '顧客の閲覧・クリック・相談反応',
    desc: '「松・竹・梅のどれが最も見られたか」「どのエリアに関心があるか」の行動ログとセグメントタグを自動取得。',
    badge: '行動計測'
  },
  {
    step: '05',
    title: 'フィードバック・口コミ・評価の蓄積',
    desc: '提案に対する評価や旅行後の感想をLINEから回収し、各旅行プランの実績スコアとして旅行DBを更新。',
    badge: '評価還流'
  },
  {
    step: '06',
    title: '次回の旅行提案・セグメント配信へ再利用',
    desc: '反応が良かったプランがさらに推薦されやすくなり、顧客ごとの好みに合わせた次回提案の精度が継続向上。',
    badge: '持続的成長'
  }
];

export const INITIAL_TRAVEL_DB: TravelRecord[] = [
  {
    id: 'rec-1',
    code: 'TRV-2025-089',
    title: '強羅・渓谷露天風呂付き客室で寛ぐ 懐石美食と美術館めぐり',
    area: '箱根・伊豆',
    companion: '夫婦・パートナー',
    purpose: '温泉・美食',
    duration: '1泊2日',
    tier: '松',
    pricePerPerson: 78000,
    satisfactionScore: 4.9,
    repeatCount: 18,
    sourceDoc: '2025秋_箱根強羅特別企画書_夫婦向け.docx',
    highlights: ['源泉かけ流し露天風呂付き離れ客室', '相模湾地魚と足柄牛の特選懐石', 'ポーラ美術館・プライベートハイヤー送迎'],
    customerVoice: '部屋の露天風呂からの紅葉と静けさが格別でした。移動もスムーズで夫婦の記念日に最適でした。（60代ご夫婦）',
    tags: ['露天風呂付客室', '記念日', 'ハイヤー送迎', '懐石料理']
  },
  {
    id: 'rec-2',
    code: 'TRV-2025-014',
    title: '箱根芦ノ湖畔リゾート＆大涌谷・彫刻の森 王道ゴールデンルート',
    area: '箱根・伊豆',
    companion: '夫婦・パートナー',
    purpose: '温泉・美食',
    duration: '1泊2日',
    tier: '竹',
    pricePerPerson: 54000,
    satisfactionScore: 4.7,
    repeatCount: 34,
    sourceDoc: '2025通年_箱根芦ノ湖王道プラン実績.docx',
    highlights: ['芦ノ湖ビュー和洋室ステイ', '旬の創作和食コース＆地酒ペアリング', '箱根海賊船特別船室＆ロープウェイ周遊'],
    customerVoice: '王道スポットを無理のないペースで回れて、宿の食事と景色も値段以上の満足感でした。（50代ご夫婦）',
    tags: ['レイクビュー', '周遊パス付', '地酒ペアリング', '高満足度']
  },
  {
    id: 'rec-3',
    code: 'TRV-2024-112',
    title: '箱根湯本・老舗温泉宿と小田原城下町食べ歩きスマート旅',
    area: '箱根・伊豆',
    companion: '夫婦・パートナー',
    purpose: '温泉・美食',
    duration: '1泊2日',
    tier: '梅',
    pricePerPerson: 38000,
    satisfactionScore: 4.5,
    repeatCount: 42,
    sourceDoc: '2024下期_箱根湯本カジュアル温泉実績.docx',
    highlights: ['箱根湯本駅から徒歩圏の名湯宿', '小田原漁港直送の海鮮御膳ランチ', 'ロマンスカー往復特急券つきスマート行程'],
    customerVoice: 'アクセスが良く、週末に気軽に行ける温泉旅としてコスパが抜群でした。（40代ご夫婦）',
    tags: ['駅近名湯', 'ロマンスカー', '海鮮ランチ', '週末気軽旅']
  },
  {
    id: 'rec-4',
    code: 'TRV-2025-052',
    title: '金沢・ひがし茶屋街の貸切町家宿と加賀百万石の伝統工芸・料亭体験',
    area: '金沢・北陸',
    companion: '夫婦・パートナー',
    purpose: '歴史・伝統文化',
    duration: '2泊3日',
    tier: '松',
    pricePerPerson: 92000,
    satisfactionScore: 4.9,
    repeatCount: 15,
    sourceDoc: '2025春_金沢伝統文化プレミアム企画.docx',
    highlights: ['庭園付き伝統建築一棟貸切スイート', 'ミシュラン掲載料亭での加賀懐石と芸妓お座敷体験', '加賀友禅・金箔工房の特別拝観'],
    customerVoice: '普段入れない工房の見学や料亭での体験が素晴らしく、心に残る旅になりました。（60代ご夫婦）',
    tags: ['町家一棟貸し', '老舗料亭', '伝統工芸特別拝観']
  },
  {
    id: 'rec-5',
    code: 'TRV-2025-061',
    title: '兼六園・近江町市場と山代温泉の名旅館で味わう北陸満喫旅',
    area: '金沢・北陸',
    companion: '家族・三世代',
    purpose: '温泉・美食',
    duration: '2泊3日',
    tier: '竹',
    pricePerPerson: 64000,
    satisfactionScore: 4.8,
    repeatCount: 29,
    sourceDoc: '2025_北陸三世代ファミリー実績表.docx',
    highlights: ['金沢市内1泊＋加賀・山代温泉1泊の2拠点ステイ', 'のどぐろ・加賀野菜の会席料理（個室食事処）', '三世代に優しいジャンボタクシー観光付き'],
    customerVoice: '両親の足腰に配慮したタクシー移動と個室食が大好評でした。（50代・三世代6名）',
    tags: ['個室食事処', '2拠点ステイ', '観光タクシー付']
  },
  {
    id: 'rec-6',
    code: 'TRV-2025-077',
    title: '瀬戸内・直島アート巡りと尾道水道を望む絶景テラスリゾート旅',
    area: '瀬戸内・四国',
    companion: '友人グループ',
    purpose: '自然・絶景',
    duration: '2泊3日',
    tier: '竹',
    pricePerPerson: 68000,
    satisfactionScore: 4.8,
    repeatCount: 24,
    sourceDoc: '2025_瀬戸内アート＆クルーズ実績.docx',
    highlights: ['全室オーシャンビューの瀬戸内ブティックホテル', '瀬戸内シトラス＆地中海シーフードディナー', 'チャーターボートで巡る直島・豊島アート鑑賞'],
    customerVoice: 'フェリー待ち時間を気にせずチャーター船で島々を巡れたのが最高でした！（40代女性グループ）',
    tags: ['オーシャンビュー', 'アート島巡り', '瀬戸内美食']
  }
];

export function generateThreeTierPlans(input: DiagnosisInput): GeneratedPlanTier[] {
  const safeArea = input?.area ?? '箱根・伊豆';
  const safeCompanion = input?.companion ?? '夫婦・パートナー';
  const safePurpose = input?.purpose ?? '温泉・美食';
  const safeDuration = input?.duration ?? '1泊2日';
  const baseBudget = Number(input?.budgetPerPerson ?? 60000);
  const pax = Math.max(1, Number(input?.pax ?? 2));

  const areaMap: Record<
    string,
    {
      matsuPlace: string;
      takePlace: string;
      umePlace: string;
      matsuCode: string;
      takeCode: string;
      umeCode: string;
      matsuStay: string;
      takeStay: string;
      umeStay: string;
      matsuSpot: string;
      takeSpot: string;
      umeSpot: string;
    }
  > = {
    '箱根・伊豆': {
      matsuPlace: '強羅・奥湯河原 渓谷離れ',
      takePlace: '芦ノ湖畔・仙石原高原',
      umePlace: '箱根湯本・小田原城下',
      matsuCode: 'TRV-2025-089',
      takeCode: 'TRV-2025-014',
      umeCode: 'TRV-2024-112',
      matsuStay: '強羅 源泉かけ流し露天風呂付き離れ客室（約75㎡）',
      takeStay: '芦ノ湖レイクビュー和洋室・貸切展望風呂特典つき',
      umeStay: '箱根湯本 老舗温泉旅館（大浴場・露天風呂完備）',
      matsuSpot: 'ポーラ美術館 貸切ハイヤー送迎＆早朝庭園散策',
      takeSpot: '箱根海賊船特別船室＆大涌谷ロープウェイ周遊',
      umeSpot: '小田原城下町食べ歩き＆彫刻の森美術館めぐり'
    },
    '金沢・北陸': {
      matsuPlace: '金沢・ひがし茶屋街＆山代温泉',
      takePlace: '兼六園・加賀山代温泉',
      umePlace: '金沢駅周辺・近江町市場',
      matsuCode: 'TRV-2025-052',
      takeCode: 'TRV-2025-061',
      umeCode: 'TRV-2024-108',
      matsuStay: '伝統建築一棟貸切スイート＆名湯露天風呂付特別室',
      takeStay: '山代温泉 伝統和風旅館（個室食事処確約）',
      umeStay: '金沢市内 天然温泉大浴場つき上質モダンホテル',
      matsuSpot: '加賀友禅・金箔工房の特別拝観＆老舗料亭お座敷体験',
      takeSpot: '兼六園ガイド付き散策＆近江町市場・九谷焼体験',
      umeSpot: '金沢21世紀美術館・長町武家屋敷跡周遊バス旅'
    },
    '瀬戸内・四国': {
      matsuPlace: '瀬戸内・尾道水道＆直島プライベート滞在',
      takePlace: '尾道・しまなみ海道＆直島アート',
      umePlace: '倉敷美観地区・高松瀬戸内めぐり',
      matsuCode: 'TRV-2025-079',
      takeCode: 'TRV-2025-077',
      umeCode: 'TRV-2024-121',
      matsuStay: '瀬戸内海を一望する全室スイート・アイランドリゾート',
      takeStay: '尾道水道オーシャンビュー・ブティックホテル',
      umeStay: '瀬戸内海沿い展望テラス付きシーサイドホテル',
      matsuSpot: 'プライベートクルーザーで巡る直島・豊島アート島旅',
      takeSpot: '高速船で巡る直島地中美術館＆千光寺ロープウェイ',
      umeSpot: '倉敷美観地区散策＆瀬戸内フェリー島めぐり'
    },
    '京都・奈良': {
      matsuPlace: '京都・洛北隠れ里＆嵐山奥座敷',
      takePlace: '京都・東山＆宇治・奈良歴史めぐり',
      umePlace: '京都・三条河原町＆伏見・奈良散策',
      matsuCode: 'TRV-2025-093',
      takeCode: 'TRV-2025-044',
      umeCode: 'TRV-2024-098',
      matsuStay: '洛北 数寄屋造り離れ客室・日本庭園ビュー',
      takeStay: '東山エリア 京町家リノベーション上質宿',
      umeStay: '大浴場つき京都モダンスタイリッシュホテル',
      matsuSpot: '非公開寺院の早朝特別拝観＆専属観光ハイヤー手配',
      takeSpot: '清水・東山朝散歩ガイド＆宇治茶道体験',
      umeSpot: '地下鉄・バス1日券で巡る王道寺社＆錦市場食べ歩き'
    }
  };

  const cfg = areaMap[safeArea] ?? areaMap['箱根・伊豆'];
  const matsuPrice = Math.round((baseBudget * 1.32) / 1000) * 1000;
  const takePrice = Math.round((baseBudget * 0.98) / 1000) * 1000;
  const umePrice = Math.round((baseBudget * 0.72) / 1000) * 1000;

  return [
    {
      tier: '松',
      tierName: '松プラン（特選・極上体験）',
      tierConcept: 'プライベート空間と特別体験を妥協なく盛り込んだハイクラス提案',
      title: `【松】${cfg.matsuPlace}で愉しむ ${safePurpose}・特別誂えの旅（${safeDuration}）`,
      subtitle: `${safeCompanion}に最適な専用送迎・客室露天またはスイート確約プラン`,
      themeGradient: 'from-amber-900 via-stone-800 to-slate-900',
      imageUrl: matsuThumb,
      pricePerPerson: matsuPrice,
      totalPrice: matsuPrice * pax,
      ragMatchScore: 96,
      sourceRecordCode: cfg.matsuCode,
      sourceRecordTitle: `${safeArea} 過去満足度4.9実績（リピート18件）をベースにAI最適化`,
      accommodation: cfg.matsuStay,
      meals: '夕朝食つき（個室または部屋食・料理長特選懐石＆ペアリング特典）',
      transport: '主要駅からの専用ハイヤー送迎 ＋ グリーン車/特別車両手配',
      recommendReason: `旅行DB内の「${safeArea}×${safeCompanion}」実績データで最も顧客満足度（4.9/5.0）が高かった『${cfg.matsuCode}』をベースに、ご希望の「${safePurpose}」に合わせてプライベート感を高めた最上位プランです。`,
      itinerary: [
        {
          day: '1日目',
          schedule: [
            `10:30 出発駅より特別車両にて${safeArea}エリアへ`,
            '12:30 老舗名店にて季節の特選ランチ（個室席確約）',
            `14:00 ${cfg.matsuSpot}`,
            '16:00 宿へチェックイン・ウェルカム抹茶と甘味のおもてなし',
            '18:30 旬の地産食材を活かした料理長特選懐石ディナー'
          ]
        },
        {
          day: '2日目',
          schedule: [
            '08:00 庭園を眺めながら土鍋炊き御飯の和朝食',
            '10:30 専属ドライバー迎えにて隠れた名所・工房をゆったり巡覧',
            '13:00 地元料理人おすすめの隠れ家レストランにて昼食',
            '15:30 お土産処立ち寄り後、帰路へ（移動もゆとり設計）'
          ]
        }
      ],
      includedTags: [safeArea, safeCompanion, safePurpose, '露天風呂/特別室', '専用送迎つき', '高評価実績ベース']
    },
    {
      tier: '竹',
      tierName: '竹プラン（王道・高満足度バランス）',
      tierConcept: '過去成約率No.1！予算と上質さのバランスが最も優れた本命提案',
      title: `【竹】${cfg.takePlace} 名宿ステイと${safePurpose}満喫ゴールデンルート（${safeDuration}）`,
      subtitle: `ご予算目安（${baseBudget.toLocaleString()}円/名）にピタリと収まる一番人気の王道構成`,
      themeGradient: 'from-teal-950 via-slate-800 to-emerald-950',
      imageUrl: takeThumb,
      pricePerPerson: takePrice,
      totalPrice: takePrice * pax,
      ragMatchScore: 94,
      sourceRecordCode: cfg.takeCode,
      sourceRecordTitle: `${safeArea} 成約数No.1実績（過去34組催行）をベースにAI最適化`,
      accommodation: cfg.takeStay,
      meals: '夕朝食つき（旬の地産創作コース・半個室ダイニング）',
      transport: '特急指定席 ＋ 現地周遊フリーパス＆一部タクシー組み合わせ',
      recommendReason: `ご予算（1名あたり${baseBudget.toLocaleString()}円前後）に対して最もコストパフォーマンスと満足度のバランスが高い実績『${cfg.takeCode}』を基に構成。無理のない移動動線で定番と穴場の両方を押さえています。`,
      itinerary: [
        {
          day: '1日目',
          schedule: [
            `10:00 特急指定席にて${safeArea}へ快適移動`,
            '12:00 地元で人気の旬菜ダイニングにてご当地ランチ',
            `13:45 ${cfg.takeSpot}`,
            '16:30 景観自慢の名宿へチェックイン・展望温泉で湯浴み',
            '18:30 地元食材の創作和会席と地酒の夕食'
          ]
        },
        {
          day: '2日目',
          schedule: [
            '08:00 地元食材ビュッフェまたは和定食の朝ごはん',
            '10:00 周辺の文化スポット・絶景展望台を散策',
            '12:30 名物グルメの昼食と銘菓・工芸品ショッピング',
            '16:00 特急列車にて帰着'
          ]
        }
      ],
      includedTags: [safeArea, safeCompanion, safePurpose, '成約率No.1構成', '周遊パス付', '予算ぴったり']
    },
    {
      tier: '梅',
      tierName: '梅プラン（スマート・厳選コスパ）',
      tierConcept: '宿と食の質はしっかり保ちつつ、移動と行程をスリム化した良質提案',
      title: `【梅】${cfg.umePlace} 気軽に楽しむ${safePurpose}スマート旅（${safeDuration}）`,
      subtitle: '現地での自由時間を広く確保し、ご予算を抑えて賢く旅する厳選プラン',
      themeGradient: 'from-slate-900 via-indigo-950 to-slate-800',
      imageUrl: umeThumb,
      pricePerPerson: umePrice,
      totalPrice: umePrice * pax,
      ragMatchScore: 89,
      sourceRecordCode: cfg.umeCode,
      sourceRecordTitle: `${safeArea} リピーター好評スマート実績（過去42組）をベースに編成`,
      accommodation: cfg.umeStay,
      meals: '1泊朝食つき＋初日名物ランチ予約つき（夕食は現地名店リストをご案内）',
      transport: '往復交通セット券 ＋ 公共交通1日フリー乗車券',
      recommendReason: `初期費用を抑えつつ、立地の良い宿と高評価スポットを厳選した『${cfg.umeCode}』ベースの構成。現地での食べ歩きや自由散策を柔軟に楽しみたい${safeCompanion}に好評です。`,
      itinerary: [
        {
          day: '1日目',
          schedule: [
            `10:30 往復企画乗車券を利用して${safeArea}へ出発`,
            `12:30 ${cfg.umeSpot}`,
            '16:00 駅・観光地アクセス至便な温泉宿/ホテルへチェックイン',
            '18:00 旅行DB厳選の「地元スタッフおすすめ名店リスト」から自由夕食'
          ]
        },
        {
          day: '2日目',
          schedule: [
            '08:30 宿にて和洋朝食後、朝市・城下町エリアを自由散策',
            '12:00 海鮮・ご当地グルメの昼食',
            '14:30 カフェ・お土産巡り後、夕方の列車で帰着'
          ]
        }
      ],
      includedTags: [safeArea, safeCompanion, 'スマート予算', '駅近好立地', '自由時間充実']
    }
  ];
}

export const ESTIMATE_SECTIONS = [
  {
    code: 'A',
    category: '全体設計・プロジェクト設計',
    subtotal: 400000,
    items: [
      { name: '全体システム設計', desc: 'LINE・Web・AI・DB・インフラ全体設計', cost: 100000 },
      { name: '業務フロー設計', desc: '顧客導線・社内運用フロー', cost: 80000 },
      { name: 'データ設計', desc: '旅行DB・顧客データ・行動データ', cost: 80000 },
      { name: 'AI/RAG設計', desc: 'AIによる旅行推薦・検索設計', cost: 80000 },
      { name: 'LINE導線設計', desc: 'LINE→旅行診断→提案までの導線', cost: 60000 }
    ]
  },
  {
    code: 'B',
    category: '旅行データ資産化（過去旅行データ・旅行DB構築）',
    subtotal: 750000,
    items: [
      { name: 'Wordデータ解析・整理', desc: '過去旅行資料の構造化', cost: 150000 },
      { name: 'AIによるデータ一次変換', desc: '旅行情報をDB項目へ変換', cost: 100000 },
      { name: '旅行DB構築', desc: 'D1等を利用した旅行データ基盤', cost: 250000 },
      { name: 'データ品質確認', desc: '重複・欠損・異常データ等の確認', cost: 100000 },
      { name: 'RAG検索基盤', desc: '類似旅行・条件検索等', cost: 150000 }
    ]
  },
  {
    code: 'C',
    category: 'AI旅行提案機能（AIレコメンドシステム）',
    subtotal: 570000,
    items: [
      { name: '旅行条件入力', desc: 'エリア・人数・予算・目的等', cost: 80000 },
      { name: '条件フィルタリング', desc: 'DBから候補旅行を抽出', cost: 80000 },
      { name: '推薦ロジック', desc: '条件・類似性等による候補選定', cost: 100000 },
      { name: 'AI連携', desc: 'AI APIとの接続', cost: 100000 },
      { name: '松竹梅提案', desc: '3段階の旅行プラン生成', cost: 80000 },
      { name: 'AI回答品質調整', desc: 'プロンプト・回答形式等の調整', cost: 80000 },
      { name: 'フィードバック蓄積', desc: '評価・感想等の保存', cost: 50000 }
    ]
  },
  {
    code: 'D',
    category: 'LINE・LIFF連携（LINE顧客接点構築）',
    subtotal: 700000,
    items: [
      { name: 'LINE Developers設定', desc: 'Messaging API等の初期設定', cost: 50000 },
      { name: 'LINE API連携', desc: 'システムとの送受信連携', cost: 100000 },
      { name: 'LIFF構築', desc: 'LINE内旅行診断アプリ', cost: 250000 },
      { name: 'LINEユーザー連携', desc: 'LINEユーザーID等との紐付け', cost: 80000 },
      { name: 'タグ・セグメント管理', desc: '興味関心・利用状況等の管理', cost: 80000 },
      { name: 'リッチメニュー出し分け', desc: '顧客属性等による表示制御', cost: 80000 },
      { name: '行動データ取得', desc: '閲覧・クリック等の記録', cost: 60000 }
    ]
  },
  {
    code: 'E',
    category: '管理・分析・業務効率化（管理・業務支援）',
    subtotal: 380000,
    items: [
      { name: '最低限の管理機能', desc: '旅行データ・顧客データ等の確認', cost: 100000 },
      { name: '利用状況集計', desc: '利用数・推薦・反応等の集計', cost: 80000 },
      { name: 'Googleスプレッドシート連携', desc: '業務データの確認・出力', cost: 50000 },
      { name: 'GAS業務自動化', desc: '定型業務・通知・集計等', cost: 100000 },
      { name: '運用マニュアル', desc: '基本操作・運用方法', cost: 50000 }
    ]
  },
  {
    code: 'F',
    category: 'テスト・公開（本番導入）',
    subtotal: 250000,
    items: [
      { name: 'LINEテスト', desc: 'Messaging API等', cost: 50000 },
      { name: 'LIFFテスト', desc: 'スマートフォン・PC等', cost: 50000 },
      { name: 'AI回答テスト', desc: '推薦結果・回答品質', cost: 50000 },
      { name: 'セキュリティ基本確認', desc: '認証・権限・入力等', cost: 50000 },
      { name: '本番環境構築・公開', desc: 'Cloudflare等', cost: 50000 }
    ]
  },
  {
    code: 'G',
    category: 'プロジェクト管理・導入支援（PM・導入支援）',
    subtotal: 320000,
    items: [
      { name: 'プロジェクト管理', desc: '全体進行・スケジュール管理', cost: 100000 },
      { name: 'チーム連携', desc: '開発・Web制作等との調整', cost: 80000 },
      { name: 'クライアント打合せ', desc: '要件確認・進捗確認', cost: 80000 },
      { name: '導入支援', desc: '本番運用開始時の支援', cost: 60000 }
    ]
  }
];

export const PHASE1_SCOPE_ITEMS = [
  '01. 旅行データベース（Cloudflare D1基盤）',
  '02. 過去旅行資料（Word等）の構造化データ化',
  '03. AI / RAG検索基盤（類似旅行・条件検索）',
  '04. AI旅行プラン推薦ロジック',
  '05. 松・竹・梅の3段階プラン提示',
  '06. LINE公式アカウント / Messaging API連携',
  '07. LIFF旅行診断Webアプリ',
  '08. 顧客タグ・セグメント管理',
  '09. リッチメニュー出し分け制御',
  '10. 利用状況・行動データ（閲覧・クリック）蓄積',
  '11. 顧客フィードバック（評価・感想）蓄積',
  '12. Googleスプレッドシート / GAS業務自動化連携',
  '13. 基本的なデータ確認・管理機能',
  '14. Cloudflare本番環境構築・公開',
  '15. セキュリティ基本対策（認証・権限・入力検証）'
];

export const PHASE2_FUTURE_ITEMS = [
  '大規模CRMシステム構築（初期投資抑制のためPhase 2以降）',
  '顧客ステージ管理・LTVスコアリング',
  '複雑な自動ステップ配信シナリオ',
  'オンライン予約管理・在庫連動システム',
  'オンライン決済システム連携',
  '高度なマーケティングオートメーション（MA）',
  'スタッフ向け高度管理画面・大規模分析ダッシュボード',
  '口コミ・レビュー自動活用＆成約データとの自動連携'
];
