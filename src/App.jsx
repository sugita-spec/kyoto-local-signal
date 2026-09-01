import { useDeferredValue, useEffect, useId, useState, useSyncExternalStore } from "react";
import brandMark from "./assets/brand-mark.png";
import { categories, getRestaurantById, restaurants, salesProspects } from "./data.js";

const outreachSectors = [
  { name: "飲食", examples: "レストラン・居酒屋・カフェ・菓子店", status: "6件 提案ページ制作済み", active: true },
  { name: "美容・理容", examples: "美容室・理容室・ネイル・アイラッシュ", status: "2件 調査候補" },
  { name: "小売・専門店", examples: "衣料・雑貨・花・食品・工芸", status: "8件 調査候補" },
  { name: "健康・ウェルネス", examples: "整体・鍼灸・ヨガ・ジム", status: "調査対象" },
  { name: "教室・スクール", examples: "音楽・語学・料理・文化教室", status: "調査対象" },
  { name: "生活サービス", examples: "修理・クリーニング・写真・ペット", status: "13件 調査候補" },
  { name: "宿泊・観光", examples: "町家宿・体験・レンタル・案内", status: "調査対象" },
  { name: "専門サービス", examples: "士業・不動産・建築・地域事業者", status: "1件 調査候補" },
];

const prospectMeta = {
  hashido: { websiteStatus: "要再確認", stage: "提案ページ完成", priority: "高", nextAction: "連絡先を最終確認", timing: "今日" },
  "brisket-rony": { websiteStatus: "未整備候補", stage: "未連絡", priority: "高", nextAction: "Instagramから提案", timing: "今日" },
  chochin: { websiteStatus: "要再確認", stage: "情報確認中", priority: "中", nextAction: "Googleマップを再確認", timing: "7/31" },
  "nikusyuka-3610": { websiteStatus: "未整備候補", stage: "提案ページ完成", priority: "高", nextAction: "営業メッセージを準備", timing: "7/31" },
  sakabukuro: { websiteStatus: "要再確認", stage: "未連絡", priority: "中", nextAction: "連絡方法を確認", timing: "8/1" },
  sumigin: { websiteStatus: "未整備候補", stage: "連絡準備", priority: "高", nextAction: "提案ページを最終確認", timing: "今日" },
};

const stageOptions = ["すべて", "提案ページ完成", "提案準備", "HP確認待ち", "未連絡", "情報確認中", "連絡準備"];

const Icon = ({ children, size = 20, strokeWidth = 1.8, ...props }) => (
  <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} {...props}>
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      {children}
    </g>
  </svg>
);

const SearchIcon = (props) => <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>;
const ArrowRightIcon = (props) => <Icon {...props}><path d="M5 12h14M14 7l5 5-5 5" /></Icon>;
const ExternalLinkIcon = (props) => <Icon {...props}><path d="M14 5h5v5M19 5l-8 8" /><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Icon>;
const InstagramIcon = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" strokeWidth="2.8" /></Icon>;
const MapPinIcon = (props) => <Icon {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>;
const InfoIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></Icon>;
const MenuIcon = (props) => <Icon {...props}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
const CloseIcon = (props) => <Icon {...props}><path d="m6 6 12 12M18 6 6 18" /></Icon>;
const ClockIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Icon>;
const CalendarIcon = (props) => <Icon {...props}><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>;
const HomeIcon = (props) => <Icon {...props}><path d="m4 10 8-7 8 7v10H4Z" /><path d="M9 20v-6h6v6" /></Icon>;
const PlusIcon = (props) => <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>;
const TrainIcon = (props) => <Icon {...props}><rect x="5" y="3" width="14" height="16" rx="3" /><path d="M8 8h8M8 15h.01M16 15h.01M8 21l2-2M16 21l-2-2" /></Icon>;
const BookIcon = (props) => <Icon {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" /></Icon>;
const GridIcon = (props) => <Icon {...props}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></Icon>;
const UsersIcon = (props) => <Icon {...props}><circle cx="9" cy="8" r="3" /><path d="M3.5 19v-2a5.5 5.5 0 0 1 11 0v2M16 6.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8" /></Icon>;
const FileIcon = (props) => <Icon {...props}><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>;
const TargetIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Icon>;
const DownloadIcon = (props) => <Icon {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></Icon>;
const CheckIcon = (props) => <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>;
const RefreshIcon = (props) => <Icon {...props}><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M6.1 8.5A7 7 0 0 1 18.6 7L20 12M4 12l1.4 5a7 7 0 0 0 12.5-1.5" /></Icon>;

const subscribeToHash = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};

const readHash = () => window.location.hash;
const getMapsUrl = (restaurant) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`;
const getProspectMeta = (prospect) => prospectMeta[prospect.id] ?? {
  websiteStatus: prospect.websiteStatus,
  stage: prospect.stage,
  priority: prospect.priority,
  nextAction: prospect.nextAction,
  timing: prospect.timing,
};
const formatUpdatedAt = () => new Intl.DateTimeFormat("ja-JP", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date());

function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="site-header">
      <a className="brand" href="#dashboard" aria-label="KYOTO LOCAL SIGNAL ホーム">
        <img src={brandMark} width="48" height="48" alt="" />
        <span>KYOTO LOCAL SIGNAL</span>
      </a>
      <button className="menu-button" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={onMenuToggle}>
        {menuOpen ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
      </button>
      <nav id="site-navigation" className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="メインナビゲーション">
        <a href="#dashboard">概要</a>
        <a href="#scope">営業対象</a>
        <a href="#candidates">候補リスト</a>
        <a href="#method">調査キュー</a>
        <span>2026.07.30 更新</span>
      </nav>
    </header>
  );
}

function DashboardSidebar() {
  const items = [
    { label: "営業ダッシュボード", href: "#dashboard", icon: <GridIcon /> },
    { label: "営業対象", href: "#scope", icon: <UsersIcon /> },
    { label: "候補リスト", href: "#candidates", icon: <TargetIcon /> },
    { label: "調査キュー", href: "#method", icon: <SearchIcon /> },
    { label: "提案ページ", href: "#candidates", icon: <FileIcon /> },
  ];
  return (
    <aside className="dashboard-sidebar" aria-label="営業メニュー">
      <a className="dashboard-sidebar__brand" href="#dashboard">
        <img src={brandMark} alt="" />
        <span>KYOTO<br />LOCAL SIGNAL</span>
      </a>
      <nav>
        {items.map((item, index) => <a className={index === 0 ? "is-active" : ""} href={item.href} key={item.label}>{item.icon}<span>{item.label}</span></a>)}
      </nav>
      <div className="dashboard-sidebar__note"><span>対象エリア</span><strong>京都市 中京区</strong><small>営業候補デモ</small></div>
    </aside>
  );
}

function Hero() {
  return (
    <section className="hero" id="dashboard">
      <div className="hero__content">
        <h1>中京区の商いを、<br />次の顧客へ。</h1>
        <p>ホームページ未整備の事業者を見つけ、調査・提案・連絡までを一つの画面で。</p>
        <a className="hero__cta" href="#candidates">今日の営業リストを見る<ArrowRightIcon /></a>
      </div>
      <div className="hero-map" aria-hidden="true">
        <span className="hero-map__river" />
        <span className="hero-map__seal"><img src={brandMark} alt="" /></span>
        <span className="hero-map__marker">京</span>
        <span className="hero-map__place hero-map__place--one" />
        <span className="hero-map__place hero-map__place--two" />
        <span className="hero-map__place hero-map__place--three" />
      </div>
    </section>
  );
}

function MetricsStrip() {
  const metrics = [
    { label: "営業候補", value: String(salesProspects.length), unit: "件", icon: <UsersIcon size={29} /> },
    { label: "提案ページ", value: "6", unit: "件", icon: <FileIcon size={29} /> },
    { label: "HPなし確認", value: "2", unit: "件", icon: <CheckIcon size={29} /> },
    { label: "HP確認待ち", value: "22", unit: "件", icon: <SearchIcon size={29} /> },
  ];
  return (
    <section className="metrics-strip" aria-label="営業状況">
      {metrics.map((metric) => <article key={metric.label}><span className="metrics-strip__icon">{metric.icon}</span><div><span>{metric.label}</span><strong>{metric.value}<small>{metric.unit}</small></strong></div></article>)}
    </section>
  );
}

function ScopeOverview() {
  return (
    <section className="scope-overview" id="scope" aria-labelledby="scope-heading">
      <div className="scope-overview__intro">
        <div><h2 id="scope-heading">業種別カバレッジ</h2><p>飲食6件に加えて、公開情報から24件の調査候補を追加しました。</p></div>
        <a href="#method">調査方法を見る<ArrowRightIcon size={15} /></a>
      </div>
      <div className="scope-list">
        {outreachSectors.map((sector, index) => (
          <article className={sector.active ? "is-active" : ""} key={sector.name}>
            <span className="scope-list__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{sector.name}</h3>
              <p>{sector.examples}</p>
            </div>
            <span className="scope-list__status">{sector.status}</span>
            <span className="scope-list__bar" aria-hidden="true"><i /></span>
          </article>
        ))}
      </div>
    </section>
  );
}

function RestaurantRow({ restaurant }) {
  const meta = getProspectMeta(restaurant);
  const websiteStatusClass = meta.websiteStatus === "HPなし確認済み"
    ? "is-confirmed"
    : meta.websiteStatus === "HP確認待ち"
      ? "is-pending"
      : meta.websiteStatus === "未整備候補"
        ? "is-likely"
        : "";
  return (
    <article className="restaurant-row">
      <div className="restaurant-row__identity"><h3>{restaurant.name}</h3><span>{restaurant.category}</span></div>
      <a className="restaurant-row__address" href={getMapsUrl(restaurant)} target="_blank" rel="noreferrer"><MapPinIcon size={18} /><span>{restaurant.address}</span></a>
      <div className="restaurant-row__website"><span className={`website-status ${websiteStatusClass}`}>{meta.websiteStatus}</span></div>
      <div className="restaurant-row__stage"><span className={`stage-label stage-label--${meta.stage === "提案ページ完成" ? "complete" : meta.stage === "情報確認中" ? "review" : "pending"}`}>{meta.stage}</span></div>
      <div className="restaurant-row__next"><strong><span className={`priority priority--${meta.priority === "高" ? "high" : "medium"}`}>{meta.priority}</span>{meta.nextAction}</strong><small>{meta.timing}</small></div>
      <div className="row-actions">
        {restaurant.instagram
          ? <a className="action-icon-link" href={restaurant.instagram} target="_blank" rel="noreferrer" aria-label={`${restaurant.name}のInstagram`}><InstagramIcon size={18} /></a>
          : <a className="action-icon-link" href={restaurant.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${restaurant.name}の公開情報を見る`}><BookIcon size={18} /></a>}
        <a className="action-icon-link" href={getMapsUrl(restaurant)} target="_blank" rel="noreferrer" aria-label={`${restaurant.name}をGoogleマップで見る`}><MapPinIcon size={18} /></a>
        {restaurant.hasProposal
          ? <a className="homepage-button" href={`#/restaurants/${restaurant.id}`}><span>提案を見る</span><ArrowRightIcon size={15} /></a>
          : <span className="homepage-button is-disabled" aria-label="提案ページ準備中"><span>提案準備中</span></span>}
      </div>
    </article>
  );
}

function CandidateList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [activeStage, setActiveStage] = useState("すべて");
  const [activePriority, setActivePriority] = useState("すべて");
  const [lastUpdated, setLastUpdated] = useState(formatUpdatedAt);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("ja"));
  const searchId = useId();
  const visibleRestaurants = salesProspects.filter((restaurant) => {
    const categoryMatches = activeCategory === "すべて" || restaurant.filterCategory === activeCategory;
    const meta = getProspectMeta(restaurant);
    const stageMatches = activeStage === "すべて" || meta.stage === activeStage;
    const priorityMatches = activePriority === "すべて" || meta.priority === activePriority;
    return categoryMatches && stageMatches && priorityMatches && `${restaurant.name} ${restaurant.address} ${restaurant.category} ${meta.nextAction}`.toLocaleLowerCase("ja").includes(deferredQuery);
  });

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("すべて");
    setActiveStage("すべて");
    setActivePriority("すべて");
  };

  const refreshCandidates = () => {
    setIsRefreshing(true);
    resetFilters();
    window.setTimeout(() => {
      setLastUpdated(formatUpdatedAt());
      setIsRefreshing(false);
    }, 450);
  };

  const exportCsv = () => {
    const header = ["事業者", "業種", "住所", "HP確認", "営業ステージ", "優先度", "次のアクション"];
    const rows = visibleRestaurants.map((restaurant) => {
      const meta = getProspectMeta(restaurant);
      return [restaurant.name, restaurant.category, restaurant.address, meta.websiteStatus, meta.stage, meta.priority, meta.nextAction];
    });
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nakagyo-sales-candidates.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="candidates" id="candidates">
      <div className="candidate-toolbar__heading">
        <div><h2>現在の営業候補</h2><p>30件を整理済み。公式サイトの有無は、営業前にGoogleマップと公開情報で再確認します。<span className="last-updated" aria-live="polite">表示更新 {lastUpdated}</span></p></div>
        <div className="candidate-toolbar__actions">
          <button className={`refresh-button ${isRefreshing ? "is-refreshing" : ""}`} type="button" onClick={refreshCandidates} disabled={isRefreshing}><RefreshIcon size={17} />{isRefreshing ? "更新中…" : "30件を更新"}</button>
          <button className="export-button" type="button" onClick={exportCsv}><DownloadIcon size={17} />CSV出力</button>
        </div>
      </div>
      <div className="filter-bar">
        <label className="search-field" htmlFor={searchId}><SearchIcon /><input id={searchId} type="search" aria-label="事業者名・エリアで検索" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="事業者名・エリアで検索" /></label>
        <label className="select-filter"><span>業種</span><select aria-label="業種で絞り込み" value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="select-filter"><span>営業ステージ</span><select aria-label="営業ステージで絞り込み" value={activeStage} onChange={(event) => setActiveStage(event.target.value)}>{stageOptions.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
        <label className="select-filter"><span>優先度</span><select aria-label="優先度で絞り込み" value={activePriority} onChange={(event) => setActivePriority(event.target.value)}>{["すべて", "高", "中"].map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        <button className="clear-filters" type="button" onClick={resetFilters}>クリア</button>
      </div>
      <p className="result-announcement" aria-live="polite">{visibleRestaurants.length}件の候補を表示中</p>
      <div className="restaurant-list">
        <div className="restaurant-list__header" aria-hidden="true"><span>事業者</span><span>業種・住所</span><span>HP確認</span><span>営業ステージ</span><span>次のアクション</span><span>操作</span></div>
        {visibleRestaurants.length > 0 ? visibleRestaurants.map((restaurant) => <RestaurantRow key={restaurant.id} restaurant={restaurant} />) : (
          <div className="empty-state"><p>条件に合う事業者はありません。</p><button type="button" onClick={resetFilters}>絞り込みをリセット</button></div>
        )}
      </div>
      <p className="candidate-count">{salesProspects.length}件中 {visibleRestaurants.length}件を表示</p>
    </section>
  );
}

function MethodNote() {
  const workflow = [
    { title: "調査・発見", body: "エリアと業種を決め、候補を抽出する。" },
    { title: "確認・提案準備", body: "公式サイトの有無と公開情報を確認する。" },
    { title: "アプローチ", body: "Instagramや電話から提案を届ける。" },
    { title: "フォロー", body: "反応と次の連絡予定を記録する。" },
  ];
  const activities = [
    { label: "サイト更新", body: "営業候補を30件へ拡張", time: "7/30" },
    { label: "提案ページ", body: "飲食店6件のデモを確認", time: "確認済み" },
    { label: "HPなし確認", body: "京都市公開一覧から2件を確認", time: "確認済み" },
    { label: "調査キュー", body: "22件のHP有無を再確認", time: "今週" },
  ];
  return (
    <section className="operations" id="method">
      <div className="workflow-panel"><div className="operations__heading"><h2>営業ワークフロー</h2><span>4ステップ</span></div><div className="workflow-list">{workflow.map((step, index) => <article key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div>{index < workflow.length - 1 ? <ArrowRightIcon size={18} /> : <CheckIcon size={18} />}</article>)}</div></div>
      <div className="activity-panel"><div className="operations__heading"><h2>最近のアクティビティ</h2><span>デモ更新履歴</span></div><div className="activity-list">{activities.map((activity) => <article key={activity.body}><span>{activity.label}</span><p>{activity.body}</p><time>{activity.time}</time></article>)}</div></div>
      <div className="method-disclaimer"><InfoIcon size={22} /><p>この画面は営業候補を整理する提案用デモです。ホームページの有無や連絡先、営業可否は実際のアプローチ直前に必ず再確認してください。</p></div>
    </section>
  );
}

function MobileDock() {
  return <nav className="mobile-dock" aria-label="モバイル営業メニュー"><a href="#dashboard"><GridIcon /><span>概要</span></a><a href="#scope"><UsersIcon /><span>営業対象</span></a><a href="#candidates"><TargetIcon /><span>候補</span></a><a href="#method"><SearchIcon /><span>調査</span></a></nav>;
}

function Footer() {
  return <footer className="site-footer"><div><strong>KYOTO LOCAL SIGNAL</strong><small>© 2026 KYOTO LOCAL SIGNAL</small></div><nav aria-label="フッターナビゲーション"><a href="#dashboard">概要</a><a href="#scope">営業対象</a><a href="#candidates">候補リスト</a><a href="#method">調査キュー</a></nav></footer>;
}

function DirectoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = "KYOTO LOCAL SIGNAL | 中京区の営業候補";
  }, []);
  return <div className="page-shell dashboard-shell"><DashboardSidebar /><div className="dashboard-content"><Header menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} /><main><Hero /><MetricsStrip /><ScopeOverview /><CandidateList /><MethodNote /></main><Footer /></div><MobileDock /></div>;
}

function RestaurantHeader({ restaurant, menuOpen, onMenuToggle }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <header className="restaurant-header">
      <a className="restaurant-wordmark" href={`#/restaurants/${restaurant.id}`}>{restaurant.shortName}</a>
      <button className="restaurant-menu-button" type="button" aria-controls="restaurant-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={onMenuToggle}>{menuOpen ? <CloseIcon size={30} /> : <MenuIcon size={30} />}</button>
      <nav id="restaurant-navigation" className={`restaurant-nav ${menuOpen ? "restaurant-nav--open" : ""}`} aria-label={`${restaurant.name} ナビゲーション`}>
        <button type="button" onClick={() => scrollTo("restaurant-story")}>この店について</button>
        <button type="button" onClick={() => scrollTo("restaurant-menu")}>おすすめ料理</button>
        <button type="button" onClick={() => scrollTo("restaurant-access")}>店舗情報</button>
        <button type="button" onClick={() => scrollTo("restaurant-faq")}>よくある質問</button>
        <a href="#candidates">候補一覧へ</a>
      </nav>
    </header>
  );
}

function RestaurantSectionHeading({ children }) {
  return <h2 className="restaurant-section-heading">{children}</h2>;
}

function RestaurantStory({ restaurant }) {
  return (
    <section className="restaurant-story" id="restaurant-story">
      <div className="restaurant-story__copy">
        <RestaurantSectionHeading>この店について</RestaurantSectionHeading>
        <span className="restaurant-story__glyph" aria-hidden="true">想</span>
        {restaurant.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <a className="restaurant-text-link" href={restaurant.source.url} target="_blank" rel="noreferrer"><BookIcon size={18} />情報の確認元を見る<ExternalLinkIcon size={14} /></a>
      </div>
      <figure className="restaurant-story__image"><img src={restaurant.heroImage} alt="" /></figure>
    </section>
  );
}

function RestaurantExperience({ restaurant }) {
  return (
    <section className="restaurant-experience" aria-labelledby="experience-heading">
      <RestaurantSectionHeading><span id="experience-heading">おすすめの楽しみ方</span></RestaurantSectionHeading>
      <div className="restaurant-experience__steps">
        {restaurant.features.map((feature, index) => (
          <article key={feature.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{feature.title}</h3><p>{feature.body}</p></div></article>
        ))}
      </div>
    </section>
  );
}

function RestaurantMenu({ restaurant }) {
  const cropPositions = ["25% center", "50% center", "75% center"];
  return (
    <section className="restaurant-menu" id="restaurant-menu" aria-labelledby="menu-heading">
      <RestaurantSectionHeading><span id="menu-heading">おすすめ料理</span></RestaurantSectionHeading>
      <div className="restaurant-menu__list">
        {restaurant.menuHighlights.map((item, index) => (
          <article key={item.name}>
            <figure><img src={restaurant.heroImage} alt="" style={{ objectPosition: cropPositions[index] }} /></figure>
            <div className="restaurant-menu__copy"><span>{item.label}</span><h3>{item.name}</h3><p>{item.body}</p></div>
            <p className="restaurant-menu__note">価格・提供状況はInstagramでご確認ください。</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RestaurantOccasions({ restaurant }) {
  return (
    <section className="restaurant-occasions" aria-labelledby="occasions-heading">
      <RestaurantSectionHeading><span id="occasions-heading">こんな日に</span></RestaurantSectionHeading>
      <div className="restaurant-occasions__list">
        {restaurant.occasions.map((occasion, index) => <article key={occasion.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{occasion.title}</h3><p>{occasion.body}</p></div></article>)}
      </div>
    </section>
  );
}

function FirstVisitGuide({ restaurant }) {
  const notes = [
    { title: "ご来店前に", body: restaurant.reservation, icon: <CalendarIcon size={27} /> },
    { title: "メニューについて", body: "仕入れや季節により提供内容が変わる場合があります。最新情報はInstagramでご確認ください。", icon: <BookIcon size={27} /> },
    { title: "アレルギーについて", body: "食材に関する不安がある方は、注文前または予約時に店舗へ直接ご相談ください。", icon: <InfoIcon size={27} /> },
  ];
  return (
    <section className="restaurant-first-visit" aria-labelledby="first-visit-heading">
      <RestaurantSectionHeading><span id="first-visit-heading">はじめての方へ</span></RestaurantSectionHeading>
      <p className="restaurant-section-lead">安心してお店を選ぶために、来店前に確認したいことをまとめました。</p>
      <div className="restaurant-first-visit__notes">
        {notes.map((note) => <article key={note.title}><span className="restaurant-first-visit__icon">{note.icon}</span><div><h3>{note.title}</h3><p>{note.body}</p></div></article>)}
      </div>
    </section>
  );
}

function RestaurantAccess({ restaurant }) {
  return (
    <section className="restaurant-access" id="restaurant-access" aria-labelledby="access-heading">
      <div className="restaurant-access__details">
        <RestaurantSectionHeading><span id="access-heading">店舗情報・アクセス</span></RestaurantSectionHeading>
        <dl>
          <div><MapPinIcon size={23} /><dt>住所</dt><dd>{restaurant.address}</dd></div>
          <div><ClockIcon size={23} /><dt>営業時間</dt><dd>{restaurant.hours}</dd></div>
          <div><CalendarIcon size={23} /><dt>営業案内</dt><dd>{restaurant.holiday}</dd></div>
          <div><TrainIcon size={23} /><dt>アクセス</dt><dd>{restaurant.access}</dd></div>
        </dl>
      </div>
      <div className="restaurant-access__visual" aria-hidden="true"><span /><i /><b>店</b></div>
      <div className="restaurant-access__actions">
        <a className="restaurant-cta restaurant-cta--primary" href={getMapsUrl(restaurant)} target="_blank" rel="noreferrer"><MapPinIcon size={20} />Googleマップで見る<ExternalLinkIcon size={15} /></a>
        <a className="restaurant-cta" href={restaurant.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={20} />Instagramで最新情報を見る<ExternalLinkIcon size={15} /></a>
      </div>
    </section>
  );
}

function RestaurantFaq({ restaurant }) {
  const [openIndex, setOpenIndex] = useState(null);
  const items = [
    { question: "予約はできますか？", answer: restaurant.reservation },
    { question: "ひとりでも利用できますか？", answer: restaurant.seating },
    { question: "営業時間はどこで確認できますか？", answer: `${restaurant.hours}。臨時変更を含む最新情報はInstagramでご確認ください。` },
    { question: "支払い方法を教えてください", answer: "現金・カード・電子決済などの対応状況は変更される場合があります。来店前または会計前に店舗へご確認ください。" },
    { question: "子ども連れでも利用できますか？", answer: "席の広さや時間帯、子ども向け対応を含め、来店前に店舗へ直接ご相談ください。" },
    { question: "貸切や宴会の相談はできますか？", answer: restaurant.groupUse },
  ];
  return (
    <section className="restaurant-faq" id="restaurant-faq" aria-labelledby="faq-heading">
      <RestaurantSectionHeading><span id="faq-heading">よくあるご質問</span></RestaurantSectionHeading>
      <div className="restaurant-faq__list">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return <article key={item.question} className={isOpen ? "is-open" : ""}><h3><button type="button" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)}><span>{item.question}</span><PlusIcon size={22} /></button></h3>{isOpen ? <p>{item.answer}</p> : null}</article>;
        })}
      </div>
    </section>
  );
}

function RestaurantFinalCta({ restaurant }) {
  return (
    <section className="restaurant-final-cta"><div><h2>今夜、京都で。</h2><p>{restaurant.name}の最新情報を確認して、次の一軒へ。</p></div><div><a href={getMapsUrl(restaurant)} target="_blank" rel="noreferrer">Googleマップで見る<ExternalLinkIcon size={15} /></a><a href={restaurant.instagram} target="_blank" rel="noreferrer">Instagramで最新情報を見る<ExternalLinkIcon size={15} /></a></div></section>
  );
}

function RestaurantPage({ restaurant }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = `${restaurant.name} | KYOTO LOCAL SIGNAL 制作デモ`;
    window.scrollTo(0, 0);
    return () => { document.title = "KYOTO LOCAL SIGNAL | 中京区の店舗候補"; };
  }, [restaurant.id, restaurant.name]);

  return (
    <div className="restaurant-page" style={{ "--restaurant-accent": restaurant.accent }}>
      <RestaurantHeader restaurant={restaurant} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
      <main>
        <section className="restaurant-hero">
          <div className="restaurant-hero__copy">
            <div className="restaurant-hero__rule">
              <h1>{restaurant.shortName}</h1>
              <h2>{restaurant.headline}</h2>
              <p>{restaurant.summary}</p>
            </div>
            <div className="restaurant-hero__actions">
              <a className="restaurant-cta restaurant-cta--primary" href={restaurant.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={21} />Instagramを見る<ExternalLinkIcon size={16} /></a>
              <a className="restaurant-cta" href={getMapsUrl(restaurant)} target="_blank" rel="noreferrer"><MapPinIcon size={21} />Googleマップで見る<ExternalLinkIcon size={16} /></a>
            </div>
          </div>
          <figure className="restaurant-hero__media"><img src={restaurant.heroImage} alt={`${restaurant.name}の魅力を表現した料理イメージ`} /></figure>
        </section>

        <section className="restaurant-features" id="restaurant-features" aria-labelledby="features-heading">
          <h2 className="visually-hidden" id="features-heading">{restaurant.name}の名物</h2>
          <span className="restaurant-features__glyph" aria-hidden="true">{restaurant.glyph}</span>
          {restaurant.features.map((feature) => <article className="restaurant-feature" key={feature.title}><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
        </section>

        <section className="restaurant-info" id="restaurant-info" aria-labelledby="info-heading">
          <h2 id="info-heading">店舗情報</h2>
          <dl>
            <div><MapPinIcon size={28} /><dt>住所</dt><dd>{restaurant.address}</dd></div>
            <div><ClockIcon size={28} /><dt>営業時間</dt><dd>{restaurant.hours}</dd></div>
            <div><CalendarIcon size={28} /><dt>営業案内</dt><dd>{restaurant.holiday}</dd></div>
          </dl>
        </section>
        <RestaurantStory restaurant={restaurant} />
        <RestaurantExperience restaurant={restaurant} />
        <RestaurantMenu restaurant={restaurant} />
        <RestaurantOccasions restaurant={restaurant} />
        <FirstVisitGuide restaurant={restaurant} />
        <RestaurantAccess restaurant={restaurant} />
        <RestaurantFaq restaurant={restaurant} />
        <RestaurantFinalCta restaurant={restaurant} />
      </main>
      <footer className="restaurant-footer"><strong>KYOTO LOCAL SIGNAL 制作デモ</strong><span>公開情報をもとに制作したマーケティング提案用ページです。</span><a href="#candidates">候補一覧へ戻る</a></footer>
    </div>
  );
}

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, readHash, () => "");
  const restaurantId = hash.startsWith("#/restaurants/") ? hash.replace("#/restaurants/", "").split(/[?&]/)[0] : null;
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;
  return restaurant ? <RestaurantPage restaurant={restaurant} /> : <DirectoryPage />;
}
