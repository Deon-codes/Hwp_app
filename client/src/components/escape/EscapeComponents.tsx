import { useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Info,
  MapPin,
  Menu,
  Navigation,
  PartyPopper,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Sun,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { Activity, FinderTab, Friend, IllustrationTone, Mood, Place } from "@/lib/escape-data";
import { formatDuration, formatPrice, getBudgetLabel, moods, places } from "@/lib/escape-data";
import { useEscape, type DetailItem, type View } from "@/lib/escape-state";

const toneClass = (tone: IllustrationTone) => `tone-${tone}`;

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-label="ESCAPE home">
      <span className="brand-sun"><Sun size={compact ? 14 : 17} strokeWidth={2.7} /></span>
      <span>escape</span>
    </div>
  );
}

export function TinyDoodle({ type = "spark" }: { type?: "spark" | "arrow" | "sun" }) {
  if (type === "arrow") return <ArrowDownRight className="doodle doodle-arrow" size={28} aria-hidden="true" />;
  if (type === "sun") return <Sun className="doodle doodle-sun" size={27} aria-hidden="true" />;
  return <Sparkles className="doodle doodle-spark" size={24} aria-hidden="true" />;
}

export function HeroArt() {
  return (
    <div className="hero-art" aria-label="Illustration of a little campus escape" role="img">
      <div className="hero-art-note hero-art-note-top">tiny reset<br /><strong>approved</strong></div>
      <div className="hero-art-sun"><Sun size={47} strokeWidth={1.8} /></div>
      <div className="hero-art-cloud cloud-one" />
      <div className="hero-art-cloud cloud-two" />
      <div className="hero-art-ground" />
      <div className="hero-art-plant plant-one"><span /><i /><b /></div>
      <div className="hero-art-plant plant-two"><span /><i /><b /></div>
      <div className="hero-art-cup"><div className="cup-steam" /><div className="cup-body"><span>chai</span></div><div className="cup-handle" /></div>
      <div className="hero-art-book"><span>15</span><small>min</small></div>
      <div className="hero-art-arrow"><ArrowRight size={30} /></div>
      <div className="hero-art-note hero-art-note-bottom">between<br /><strong>lectures</strong></div>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Avatar({ initials, tone = "lavender", size = "normal" }: { initials: string; tone?: IllustrationTone; size?: "small" | "normal" | "large" }) {
  return <div className={`avatar ${toneClass(tone)} avatar-${size}`} aria-label={`Avatar ${initials}`}>{initials}</div>;
}

export function Header() {
  const { view, setView, profile } = useEscape();
  const nav: Array<{ id: View; label: string; icon: typeof Compass }> = [
    { id: "discover", label: "Discover", icon: Sparkles },
    { id: "find", label: "Break Finder", icon: Compass },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "profile", label: "Profile", icon: Users },
  ];
  return (
    <header className="site-header">
      <button className="brand-button" onClick={() => setView("discover")} aria-label="Go to Discover"><Mark /></button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map(({ id, label }) => (
          <button key={id} className={`nav-link ${view === id ? "is-active" : ""}`} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined}>{label}</button>
        ))}
      </nav>
      <button className="header-avatar" onClick={() => setView("profile")} aria-label="Open your profile"><Avatar initials={profile.avatar} tone="lavender" size="small" /><span>{profile.name}</span><ChevronDown size={15} /></button>
      <button className="mobile-menu-button" aria-label="Navigation is available below"><Menu size={22} /></button>
    </header>
  );
}

export function BottomNav() {
  const { view, setView } = useEscape();
  const nav: Array<{ id: View; label: string; icon: typeof Compass }> = [
    { id: "discover", label: "Discover", icon: Sparkles },
    { id: "find", label: "Find", icon: Compass },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "profile", label: "Profile", icon: Users },
  ];
  return <nav className="bottom-nav" aria-label="Mobile primary navigation">{nav.map(({ id, label, icon: Icon }) => <button key={id} className={`bottom-nav-item ${view === id ? "is-active" : ""}`} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined}><Icon size={20} strokeWidth={view === id ? 2.8 : 2} /><span>{label}</span></button>)}</nav>;
}

export function Button({ children, variant = "primary", onClick, type = "button", className = "", disabled = false, ariaLabel }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "coral"; onClick?: () => void; type?: "button" | "submit"; className?: string; disabled?: boolean; ariaLabel?: string }) {
  return <button type={type} className={`escape-button button-${variant} ${className}`} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{children}</button>;
}

export function BookmarkButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { isSaved, toggleSaved } = useEscape();
  const saved = isSaved(id);
  return <button className={`bookmark-button ${saved ? "is-saved" : ""} ${compact ? "is-compact" : ""}`} onClick={(event) => { event.stopPropagation(); toggleSaved(id); }} aria-label={saved ? "Remove from saved" : "Save for later"} aria-pressed={saved}>{saved ? <BookmarkCheck size={compact ? 17 : 19} fill="currentColor" /> : <Bookmark size={compact ? 17 : 19} />}</button>;
}

export function Pill({ children, tone = "paper" }: { children: ReactNode; tone?: IllustrationTone }) {
  return <span className={`tag-pill ${toneClass(tone)}`}>{children}</span>;
}

export function VisualTile({ item, size = "normal" }: { item: DetailItem; size?: "small" | "normal" | "large" }) {
  const Icon = item.icon;
  return <div className={`visual-tile ${toneClass(item.tone)} visual-${size}`}><div className="visual-tile-lines" /><Icon className="visual-icon" size={size === "large" ? 52 : size === "small" ? 28 : 38} strokeWidth={1.7} /><span className="visual-tile-label">{item.category.split(" ")[0].toLowerCase()}</span>{size !== "small" && <span className="visual-scribble">{item.price === 0 ? "free little thing" : "worth it"}</span>}</div>;
}

export function MoodCard({ name, description, icon: Icon, tone, sticker, selected, onClick }: { name: Mood; description: string; icon: typeof Sparkles; tone: IllustrationTone; sticker: string; selected: boolean; onClick: () => void }) {
  return <button className={`mood-card ${toneClass(tone)} ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected}><div className="mood-card-top"><span className="mood-icon"><Icon size={25} strokeWidth={2} /></span><span className="mood-check">{selected ? <Check size={15} strokeWidth={3} /> : <span />}</span></div><strong>{name}</strong><span>{description}</span><small>{sticker}</small></button>;
}

export function Segmented<T extends string | number>({ label, options, value, onChange, optionLabel }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void; optionLabel?: (option: T) => string }) {
  return <fieldset className="segmented-group"><legend>{label}</legend><div className="segmented-options">{options.map((option) => <button type="button" key={String(option)} className={value === option ? "is-selected" : ""} onClick={() => onChange(option)} aria-pressed={value === option}>{optionLabel ? optionLabel(option) : String(option)}</button>)}</div></fieldset>;
}

export function ActivityCard({ item, index = 0 }: { item: Activity; index?: number }) {
  const { openDetails, openPlanner, prefs } = useEscape();
  return <article className="activity-card stagger-in" style={{ "--stagger": `${Math.min(index, 5) * 55}ms` } as React.CSSProperties}>
    <div className="card-visual-wrap"><VisualTile item={item} /><BookmarkButton id={item.id} /></div>
    <div className="activity-card-body"><div className="card-kicker"><span>{item.category}</span><span className="match-score"><Sparkles size={13} /> nice fit</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="meta-row"><span><Wallet size={14} />{formatPrice(item.price)}</span><span><Clock3 size={14} />{formatDuration(item.durationMin)}</span><span><Navigation size={14} />{item.walkMin} min walk</span></div><div className="tag-row">{item.moods.slice(0, 2).map((mood) => <Pill key={mood} tone={moods.find((entry) => entry.name === mood)?.tone ?? "paper"}>{mood}</Pill>)}</div><div className="match-line"><Star size={14} fill="currentColor" />{item.moods.includes(prefs.mood) ? item.matchLine : "A lovely little option for the space in between."}</div></div>
    <div className="card-actions"><Button variant="ghost" onClick={() => openDetails(item)}>View details <ArrowUpRight size={16} /></Button><Button variant="secondary" onClick={() => openPlanner(item)}>Plan this <ArrowRight size={16} /></Button></div>
  </article>;
}

export function PlaceCard({ item, index = 0 }: { item: Place; index?: number }) {
  const { openDetails, openPlanner } = useEscape();
  return <article className="place-card stagger-in" style={{ "--stagger": `${Math.min(index, 5) * 45}ms` } as React.CSSProperties}><div className="place-card-visual"><VisualTile item={item} /><BookmarkButton id={item.id} /></div><div className="place-card-content"><div className="card-kicker"><span>{item.category}</span><span className="estimate-label">illustrative estimate</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="meta-row"><span><Wallet size={14} />{formatPrice(item.price)}</span><span><Clock3 size={14} />{item.durationMin} min</span><span><MapPin size={14} />{item.walkMin} min</span></div><div className="tag-row">{item.moods.slice(0, 2).map((mood) => <Pill key={mood} tone={moods.find((entry) => entry.name === mood)?.tone ?? "paper"}>{mood}</Pill>)}</div><div className="place-card-actions"><Button variant="ghost" onClick={() => openDetails(item)}>Details <ArrowUpRight size={15} /></Button><Button variant="primary" onClick={() => openPlanner(item)}>Let's go! <ArrowRight size={15} /></Button></div></div></article>;
}

export function MiniMap() {
  return <div className="mini-map" aria-label="Illustrative campus map, not live navigation" role="img"><div className="map-river" /><div className="map-path path-one" /><div className="map-path path-two" /><div className="map-building building-one" /><div className="map-building building-two" /><div className="map-building building-three" /><div className="map-tree tree-one" /><div className="map-tree tree-two" /><div className="map-note"><MapPin size={14} /> illustrative campus map</div><span className="map-campus-label">campus<br /><strong>commons</strong></span><span className="map-pin pin-chai"><MapPin size={17} fill="currentColor" /></span><span className="map-pin pin-garden"><MapPin size={17} fill="currentColor" /></span><span className="map-pin pin-library"><MapPin size={17} fill="currentColor" /></span></div>;
}

export function FriendCard({ friend }: { friend: Friend }) {
  const { inviteFriend, invitedIds, openPlanner } = useEscape();
  const invited = invitedIds.includes(friend.id);
  return <article className={`friend-card ${friend.available ? "friend-available" : "friend-away"}`}><div className="friend-card-main"><Avatar initials={friend.initials} tone={friend.tone} size="large" /><div><div className="friend-name-row"><h3>{friend.name}</h3><span className={`availability-dot ${friend.available ? "is-on" : "is-off"}`} />{friend.available ? <span className="sr-only">Available</span> : <span className="sr-only">Not available</span>}</div><p>{friend.status}</p><div className="friend-mood"><Sparkles size={13} /> feeling {friend.mood.toLowerCase()}</div></div></div><div className="friend-card-actions">{friend.available ? <><Button variant={invited ? "ghost" : "secondary"} onClick={() => inviteFriend(friend.id)} disabled={invited}>{invited ? <><Check size={15} /> invite noted</> : <><Send size={15} /> invite to break</>}</Button><button className="friend-plan-link" onClick={() => openPlanner(places[1])}>plan with {friend.name} <ArrowRight size={14} /></button></> : <span className="friend-unavailable"><span className="status-symbol">—</span> not showing availability</span>}</div></article>;
}

export function AvailabilityControl() {
  const { profile, setAvailability } = useEscape();
  const options: Array<{ id: typeof profile.availability; label: string; detail: string; symbol: string }> = [
    { id: "available", label: "Available for a break", detail: "friends can see you", symbol: "●" },
    { id: "busy", label: "Busy", detail: "not right now", symbol: "—" },
    { id: "hidden", label: "Hidden", detail: "quietly off the list", symbol: "◌" },
  ];
  return <div className="availability-control" role="radiogroup" aria-label="Your availability"><div className="availability-label"><span>your visibility</span><small>voluntary + demo only</small></div><div className="availability-options">{options.map((option) => <button key={option.id} className={`availability-option ${profile.availability === option.id ? "is-selected" : ""}`} onClick={() => setAvailability(option.id)} role="radio" aria-checked={profile.availability === option.id}><span className={`availability-symbol symbol-${option.id}`}>{option.symbol}</span><span><strong>{option.label}</strong><small>{option.detail}</small></span>{profile.availability === option.id && <Check size={16} />}</button>)}</div><p><Info size={14} />You choose whether to be visible. No precise locations or private details are shown.</p></div>;
}

export function DetailSheet() {
  const { detailItem, closeDetails, isSaved, toggleSaved, openPlanner } = useEscape();
  if (!detailItem) return null;
  const item = detailItem;
  return <div className="sheet-backdrop" onClick={closeDetails}><aside className="detail-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="sheet-close" onClick={closeDetails} aria-label="Close details"><X size={21} /></button><VisualTile item={item} size="large" /><div className="sheet-body"><div className="eyebrow"><span className="eyebrow-dot" />little detail</div><h2 id="detail-title">{item.name}</h2><p className="sheet-description">{item.description}</p><div className="sheet-meta-grid"><span><Wallet size={17} /><strong>{formatPrice(item.price)}</strong><small>demo estimate</small></span><span><Clock3 size={17} /><strong>{item.durationMin} min</strong><small>suggested time</small></span><span><Navigation size={17} /><strong>{item.walkMin} min</strong><small>walk estimate</small></span></div><div className="sheet-section"><span className="sheet-label">good for</span><div className="tag-row">{item.moods.map((mood) => <Pill key={mood} tone={moods.find((entry) => entry.name === mood)?.tone ?? "paper"}>{mood}</Pill>)}</div></div><div className="sheet-note"><Sparkles size={16} /><span>{"matchLine" in item ? item.matchLine : "A small plan for a better in-between."}</span></div>{"addressHint" in item && <p className="illustrative-copy"><MapPin size={14} /> A friendly demo spot near {item.addressHint}. This is illustrative, not live navigation.</p>}<div className="sheet-actions"><Button variant={isSaved(item.id) ? "ghost" : "secondary"} onClick={() => toggleSaved(item.id)}>{isSaved(item.id) ? <><BookmarkCheck size={17} /> saved</> : <><Bookmark size={17} /> save this</>}</Button><Button onClick={() => { closeDetails(); openPlanner(item); }}>Let's go! <ArrowRight size={17} /></Button></div></div></aside></div>;
}

export function PlanSheet() {
  const { planItem, closePlanner, createPlan, profile, friends } = useEscape();
  const [duration, setDuration] = useState<10 | 15 | 30 | 45 | 60>(([10, 15, 30, 45, 60] as const).includes(planItem?.durationMin as 10 | 15 | 30 | 45 | 60) ? planItem?.durationMin as 10 | 15 | 30 | 45 | 60 : profile.defaultDuration);
  const [budget, setBudget] = useState<0 | 50 | 100 | 200>(([0, 50, 100, 200] as const).includes(planItem?.price as 0 | 50 | 100 | 200) ? planItem?.price as 0 | 50 | 100 | 200 : profile.defaultBudget);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  if (!planItem) return null;
  const availableFriends = friends.filter((friend) => friend.available);
  return <div className="sheet-backdrop" onClick={closePlanner}><aside className="plan-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="plan-title"><button className="sheet-close" onClick={closePlanner} aria-label="Close plan builder"><X size={21} /></button><div className="plan-confetti"><PartyPopper size={24} /><span>tiny plan energy</span></div><div className="eyebrow"><span className="eyebrow-dot" />make it a moment</div><h2 id="plan-title">Plan {planItem.name.toLowerCase()}</h2><p className="sheet-description">Keep it simple. Pick a little time, a spend ceiling, and anyone who should know.</p><div className="plan-form"><Segmented label="how long?" options={[10, 15, 30, 45, 60] as const} value={duration} onChange={setDuration} optionLabel={(value) => `${value} min`} /><Segmented label="spend ceiling" options={[0, 50, 100, 200] as const} value={budget} onChange={setBudget} optionLabel={getBudgetLabel} /><fieldset className="plan-friends"><legend>bring a friend? <span>optional</span></legend><div className="plan-friend-options">{availableFriends.map((friend) => <button type="button" key={friend.id} className={friendIds.includes(friend.id) ? "is-selected" : ""} onClick={() => setFriendIds((current) => current.includes(friend.id) ? current.filter((id) => id !== friend.id) : [...current, friend.id])}><Avatar initials={friend.initials} tone={friend.tone} size="small" /><span>{friend.name}</span>{friendIds.includes(friend.id) ? <Check size={14} /> : <Plus size={14} />}</button>)}</div></fieldset></div><div className="plan-summary"><div><span>your mini plan</span><strong>{planItem.name}</strong></div><div className="plan-summary-meta"><span>{duration} min</span><span>{getBudgetLabel(budget)}</span><span>{friendIds.length ? `${friendIds.length} friend${friendIds.length > 1 ? "s" : ""}` : "solo moment"}</span></div></div><Button className="plan-submit" onClick={() => createPlan({ itemId: planItem.id, itemName: planItem.name, duration, budget, friendIds })}>Create my break plan <ArrowRight size={17} /></Button></aside></div>;
}

export function ToastNotice() {
  const { toast, clearToast } = useEscape();
  if (!toast) return null;
  return <div className={`toast-notice toast-${toast.tone}`} role="status"><span className="toast-icon">{toast.tone === "success" ? <Check size={16} strokeWidth={3} /> : <Info size={16} />}</span><span>{toast.message}</span><button onClick={clearToast} aria-label="Dismiss message"><X size={15} /></button></div>;
}

export function EmptyState({ onAction }: { onAction: () => void }) {
  return <div className="empty-state"><div className="empty-illustration"><div className="empty-star"><Sparkles size={28} /></div><div className="empty-circle" /><div className="empty-arrow"><ArrowDownRight size={25} /></div></div><h3>nothing saved yet.</h3><p>let's find your next little escape.</p><Button onClick={onAction}>Find a little plan <ArrowRight size={17} /></Button></div>;
}

export function SectionDivider({ children }: { children: ReactNode }) {
  return <div className="section-divider"><span>{children}</span><span className="section-divider-line" /></div>;
}

export { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, ChevronRight, Heart, Search, Users, Wallet };
