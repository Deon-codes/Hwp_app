import { useState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Info,
  MapPin,
  Navigation,
  PartyPopper,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Sun,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { Activity, Friend, IllustrationTone, Mood, Place } from "@/lib/escape-data";
import {
  formatDuration,
  formatPlanDate,
  formatPrice,
  getBudgetLabel,
  moods,
} from "@/lib/escape-data";
import { ALLOWED_BUDGETS, ALLOWED_DURATIONS, describePlanStatus, formatRemaining, getPlanTiming, nextPlanSlot, type Plan, type PlanDraft, type PlanDraftErrors } from "@/lib/escape-logic";
import { useEscape, type DetailItem, type PlannerState, type View } from "@/lib/escape-state";

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
      <button className="header-avatar" onClick={() => setView("profile")} aria-label="Open your profile">
        <Avatar initials={profile.avatar} tone="lavender" size="small" /><span>{profile.name}</span><ChevronDown size={15} />
      </button>
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
  return (
    <nav className="bottom-nav" aria-label="Mobile primary navigation">
      {nav.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`bottom-nav-item ${view === id ? "is-active" : ""}`} onClick={() => setView(id)} aria-current={view === id ? "page" : undefined}>
          <Icon size={20} strokeWidth={view === id ? 2.8 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
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

export function SearchField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="search-field">
      <span className="sr-only">{label}</span>
      <Search size={16} aria-hidden="true" />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {value && <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search"><X size={14} /></button>}
    </label>
  );
}

export function ActivityCard({ item, index = 0, reason }: { item: Activity; index?: number; reason?: string }) {
  const { openDetails, openPlanner } = useEscape();
  return <article className="activity-card stagger-in" style={{ "--stagger": `${Math.min(index, 5) * 55}ms` } as React.CSSProperties}>
    <div className="card-visual-wrap"><VisualTile item={item} /><BookmarkButton id={item.id} /></div>
    <div className="activity-card-body"><div className="card-kicker"><span>{item.category}</span><span className="match-score"><Sparkles size={13} /> nice fit</span></div><h3>{item.name}</h3><p>{item.description}</p><div className="meta-row"><span><Wallet size={14} />{formatPrice(item.price)}</span><span><Clock3 size={14} />{formatDuration(item.durationMin)}</span><span><Navigation size={14} />{item.walkMin} min walk</span></div><div className="tag-row">{item.moods.slice(0, 2).map((mood) => <Pill key={mood} tone={moods.find((entry) => entry.name === mood)?.tone ?? "paper"}>{mood}</Pill>)}</div><div className="match-line"><Star size={14} fill="currentColor" />{reason ?? item.matchLine}</div></div>
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
  const { inviteFriend } = useEscape();
  const expiry = friend.expiresAt != null ? formatRemaining(Math.max(0, friend.expiresAt - Date.now())) : null;
  return <article className={`friend-card ${friend.available ? "friend-available" : "friend-away"}`}>
    <div className="friend-card-main"><Avatar initials={friend.initials} tone={friend.tone} size="large" /><div><div className="friend-name-row"><h3>{friend.name}</h3><span className={`availability-dot ${friend.available ? "is-on" : "is-off"}`} />{friend.available ? <span className="sr-only">Available</span> : <span className="sr-only">Not available</span>}</div><p>{friend.status}</p><div className="friend-mood"><Sparkles size={13} /> feeling {friend.mood.toLowerCase()}</div>{expiry && friend.available && <small className="friend-expiry"><Clock3 size={11} /> sharing {expiry}</small>}</div></div>
    <div className="friend-card-actions">
      <Button variant={friend.available ? "secondary" : "ghost"} onClick={() => inviteFriend(friend.id)}><Send size={15} /> {friend.available ? "invite to break" : "invite anyway"}</Button>
      <span className="friend-privacy">{friend.available ? "voluntary visibility" : "not sharing right now"}</span>
    </div>
  </article>;
}

export function AvailabilityControl() {
  const { profile, availability, setAvailability, setAvailabilityWindow, toggleShareAvailability } = useEscape();
  const options: Array<{ id: typeof profile.availability; label: string; detail: string; symbol: string }> = [
    { id: "available", label: "Available for a break", detail: profile.shareAvailability ? "friends can see you" : "sharing is off", symbol: "●" },
    { id: "busy", label: "Busy", detail: "not right now", symbol: "—" },
    { id: "hidden", label: "Hidden", detail: "quietly off the list", symbol: "◌" },
  ];
  const windows: Array<{ value: 30 | 60 | 120 | null; label: string }> = [
    { value: 30, label: "30 min" },
    { value: 60, label: "1 hr" },
    { value: 120, label: "2 hrs" },
    { value: null, label: "Until I change it" },
  ];
  return <div className="availability-control" role="group" aria-label="Your availability">
    <div className="availability-label"><span>your visibility</span><small>{availability.label}</small></div>
    <div className="availability-options">{options.map((option) => <button key={option.id} className={`availability-option ${availability.status === option.id ? "is-selected" : ""}`} onClick={() => setAvailability(option.id)} aria-pressed={availability.status === option.id}><span className={`availability-symbol symbol-${option.id}`}>{option.symbol}</span><span><strong>{option.label}</strong><small>{option.detail}</small></span>{availability.status === option.id && <Check size={16} />}</button>)}</div>
    {availability.status === "available" && <div className="availability-window"><span>visible for</span><div className="availability-window-options">{windows.map((entry) => <button type="button" key={entry.label} className={profile.availabilityWindowMin === entry.value ? "is-selected" : ""} onClick={() => setAvailabilityWindow(entry.value)} aria-pressed={profile.availabilityWindowMin === entry.value}>{entry.label}</button>)}</div><small>{availability.remainingMs != null ? formatRemaining(availability.remainingMs) : "until you change it"}</small></div>}
    <button type="button" className={`visibility-toggle ${profile.shareAvailability ? "is-on" : ""}`} aria-pressed={profile.shareAvailability} onClick={toggleShareAvailability}><span>{profile.shareAvailability ? <Check size={13} /> : <X size={13} />}</span>share availability with friends</button>
    <p><Info size={14} />You choose whether to be visible. Availability expires automatically. No precise locations or private details are shown.</p>
  </div>;
}

export function FriendRequestCard({ friend, direction }: { friend: Friend; direction: "incoming" | "outgoing" }) {
  const { acceptFriendRequest, rejectFriendRequest, withdrawFriendRequest } = useEscape();
  return <article className="request-card">
    <Avatar initials={friend.initials} tone={friend.tone} size="normal" />
    <div className="request-copy">
      <strong>{friend.name}</strong>
      <p>{direction === "incoming" ? "would like to connect and share break plans." : "request sent — waiting for a reply."}</p>
      <div className="request-interests">{friend.interests.map((interest) => <Pill key={interest} tone={moods.find((mood) => mood.name === interest)?.tone ?? "paper"}>{interest}</Pill>)}</div>
    </div>
    <div className="request-actions">
      {direction === "incoming" ? <>
        <Button variant="secondary" onClick={() => acceptFriendRequest(friend.id)}><Check size={14} /> accept</Button>
        <button className="request-decline" onClick={() => rejectFriendRequest(friend.id)}>decline</button>
      </> : <button className="request-decline" onClick={() => withdrawFriendRequest(friend.id)}>withdraw</button>}
    </div>
  </article>;
}

export function DirectoryCard({ friend }: { friend: Friend }) {
  const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, withdrawFriendRequest, removeFriend, inviteFriend } = useEscape();
  const relationship = friend.relationship;
  return <article className="directory-card">
    <div className="directory-main">
      <Avatar initials={friend.initials} tone={friend.tone} size="normal" />
      <div>
        <div className="friend-name-row"><h3>{friend.name}</h3>{relationship === "friends" && <span className={`availability-dot ${friend.available ? "is-on" : "is-off"}`} />}</div>
        <p className="directory-bio">{relationship === "friends" ? friend.bio : `Public demo profile · interests: ${friend.interests.join(", ").toLowerCase()}`}</p>
      </div>
    </div>
    {relationship === "friends" && <div className="directory-state"><span>{friend.available ? friend.status : "not sharing availability right now"}</span>{friend.available && friend.expiresAt && <small>{formatRemaining(Math.max(0, friend.expiresAt - Date.now()))}</small>}</div>}
    <div className="directory-actions">
      {relationship === "none" && <Button variant="secondary" onClick={() => sendFriendRequest(friend.id)}><UserPlus size={15} /> add friend</Button>}
      {relationship === "outgoing" && <><span className="relationship-note">request sent</span><button className="request-decline" onClick={() => withdrawFriendRequest(friend.id)}>withdraw</button></>}
      {relationship === "incoming" && <><Button variant="secondary" onClick={() => acceptFriendRequest(friend.id)}><Check size={15} /> accept</Button><button className="request-decline" onClick={() => rejectFriendRequest(friend.id)}>decline</button></>}
      {relationship === "friends" && <><Button variant="secondary" onClick={() => inviteFriend(friend.id)}><Send size={15} /> invite to break</Button><button className="request-decline" onClick={() => removeFriend(friend.id)}>remove</button></>}
    </div>
  </article>;
}

export function DetailSheet() {
  const { detailItem, closeDetails, isSaved, toggleSaved, openPlanner } = useEscape();
  if (!detailItem) return null;
  const item = detailItem;
  const isPlace = "addressHint" in item;
  return <div className="sheet-backdrop" onClick={closeDetails}><aside className="detail-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="sheet-close" onClick={closeDetails} aria-label="Close details"><X size={21} /></button><VisualTile item={item} size="large" /><div className="sheet-body"><div className="eyebrow"><span className="eyebrow-dot" />little detail</div><h2 id="detail-title">{item.name}</h2><p className="sheet-description">{item.description}</p><div className="sheet-meta-grid"><span><Wallet size={17} /><strong>{formatPrice(item.price)}</strong><small>demo estimate</small></span><span><Clock3 size={17} /><strong>{item.durationMin} min</strong><small>suggested time</small></span><span><Navigation size={17} /><strong>{item.walkMin} min</strong><small>walk estimate</small></span></div><div className="sheet-section"><span className="sheet-label">good for</span><div className="tag-row">{item.moods.map((mood) => <Pill key={mood} tone={moods.find((entry) => entry.name === mood)?.tone ?? "paper"}>{mood}</Pill>)}</div></div><div className="sheet-note"><Sparkles size={16} /><span>{item.matchLine}</span></div>
    <div className="sheet-facts">
      <span><Clock3 size={14} />{isPlace && item.openHours ? `Opening hours: ${item.openHours}` : isPlace ? "Opening hours aren't listed for this demo spot — check before you go." : "Exact meeting point isn't listed for this demo activity."}</span>
      <span><MapPin size={14} />{isPlace ? `Illustrative location: ${item.addressHint}.` : "Pick a spot when you make the plan."}</span>
      {isPlace && item.mapUrl ? <a href={item.mapUrl} target="_blank" rel="noreferrer">open map <ArrowUpRight size={13} /></a> : <small>No live map link is attached to this illustrative spot.</small>}
    </div>
    <div className="sheet-actions"><Button variant={isSaved(item.id) ? "ghost" : "secondary"} onClick={() => toggleSaved(item.id)}>{isSaved(item.id) ? <><BookmarkCheck size={17} /> saved</> : <><Bookmark size={17} /> save this</>}</Button><Button onClick={() => { closeDetails(); openPlanner(item); }}>Let's go! <ArrowRight size={17} /></Button></div></div></aside></div>;
}

function planBudgetLabel(budget: number) {
  return budget === 0 ? "free" : `under ₹${budget}`;
}

export function PlanSheet() {
  const { planner } = useEscape();
  if (!planner) return null;
  return <PlanSheetForm key={planner.plan?.id ?? `${planner.item.id}-${planner.friendIds.join("-")}`} planner={planner} />;
}

function PlanSheetForm({ planner }: { planner: PlannerState }) {
  const { closePlanner, createPlan, savePlanEdits, profile, acceptedFriends, validatePlan, showToast } = useEscape();
  const editingPlan = planner.plan;
  const slot = nextPlanSlot(Date.now());
  const initialDuration = editingPlan && (ALLOWED_DURATIONS as readonly number[]).includes(editingPlan.durationMin)
    ? (editingPlan.durationMin as (typeof ALLOWED_DURATIONS)[number])
    : profile.defaultDuration;
  const initialBudget = editingPlan && (ALLOWED_BUDGETS as readonly number[]).includes(editingPlan.budget)
    ? (editingPlan.budget as (typeof ALLOWED_BUDGETS)[number])
    : profile.defaultBudget;
  const [date, setDate] = useState(editingPlan?.date ?? slot.date);
  const [startTime, setStartTime] = useState(editingPlan?.startTime ?? slot.startTime);
  const [duration, setDuration] = useState<number>(initialDuration);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [notes, setNotes] = useState(editingPlan?.notes ?? "");
  const [friendIds, setFriendIds] = useState<string[]>(planner.friendIds.filter((friendId) => acceptedFriends.some((friend) => friend.id === friendId)));
  const [errors, setErrors] = useState<PlanDraftErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const draft: PlanDraft = { itemId: planner.item.id, date, startTime, durationMin: Number(duration), budget: Number(budget), notes, friendIds };
  const toggleFriend = (friendId: string) => {
    setFriendIds((current) => {
      if (current.includes(friendId)) return current.filter((id) => id !== friendId);
      if (current.length >= 8) {
        showToast("Invite up to 8 friends.", "error");
        return current;
      }
      return [...current, friendId];
    });
  };

  const handleSubmit = () => {
    if (submitting) return;
    setSubmitting(true);
    const nextErrors = validatePlan(draft, editingPlan?.id);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast(Object.values(nextErrors)[0] ?? "Check the plan details.", "error");
      setSubmitting(false);
      return;
    }
    const result = editingPlan ? savePlanEdits(editingPlan.id, draft) : createPlan(draft);
    if (result.error) {
      setErrors({ conflict: result.error });
      setSubmitting(false);
    }
  };

  return <div className="sheet-backdrop" onClick={closePlanner}><aside className="plan-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="plan-title"><button className="sheet-close" onClick={closePlanner} aria-label="Close plan builder"><X size={21} /></button><div className="plan-confetti"><PartyPopper size={24} /><span>{editingPlan ? "tweak the little plan" : "tiny plan energy"}</span></div><div className="eyebrow"><span className="eyebrow-dot" />{editingPlan ? "edit your plan" : "make it a moment"}</div><h2 id="plan-title">{editingPlan ? "Edit" : "Plan"} {planner.item.name.toLowerCase()}</h2><p className="sheet-description">Keep it simple. Pick a date, a little time, a spend ceiling, and anyone who should know.</p>
    <div className="plan-form">
      <div className="plan-form-row"><label className="form-field"><span>date</span><input type="date" value={date} min={slot.date} onChange={(event) => setDate(event.target.value)} />{errors.date && <small className="form-error">{errors.date}</small>}</label><label className="form-field"><span>start time</span><input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />{errors.startTime && <small className="form-error">{errors.startTime}</small>}</label></div>
      <Segmented label="how long?" options={ALLOWED_DURATIONS} value={duration as (typeof ALLOWED_DURATIONS)[number]} onChange={setDuration} optionLabel={(value) => `${value} min`} />
      {errors.duration && <small className="form-error">{errors.duration}</small>}
      <Segmented label="spend ceiling" options={ALLOWED_BUDGETS} value={budget as (typeof ALLOWED_BUDGETS)[number]} onChange={setBudget} optionLabel={(value) => getBudgetLabel(value)} />
      {errors.budget && <small className="form-error">{errors.budget}</small>}
      <label className="form-field"><span>notes <em>optional</em></span><textarea value={notes} maxLength={280} rows={2} placeholder="meet by the notice board? bring the good biscuits?" onChange={(event) => setNotes(event.target.value)} />{errors.notes && <small className="form-error">{errors.notes}</small>}<small className="form-hint">{notes.length}/280</small></label>
      <fieldset className="plan-friends"><legend>bring a friend? <span>optional</span></legend>{acceptedFriends.length ? <div className="plan-friend-options">{acceptedFriends.map((friend) => <button type="button" key={friend.id} className={friendIds.includes(friend.id) ? "is-selected" : ""} onClick={() => toggleFriend(friend.id)} aria-pressed={friendIds.includes(friend.id)}><Avatar initials={friend.initials} tone={friend.tone} size="small" /><span>{friend.name}</span>{friendIds.includes(friend.id) ? <Check size={14} /> : <Plus size={14} />}</button>)}</div> : <p className="plan-friends-empty">Accept a friend request first, then you can invite someone along.</p>}{errors.invitees && <small className="form-error">{errors.invitees}</small>}<p className="form-hint">Demo classmates reply automatically in this local prototype. Nothing is sent to anyone.</p></fieldset>
      {errors.conflict && <p className="form-error" role="alert">{errors.conflict}</p>}
      {errors.item && <p className="form-error" role="alert">{errors.item}</p>}
    </div>
    <div className="plan-summary"><div><span>your mini plan</span><strong>{planner.item.name}</strong></div><div className="plan-summary-meta"><span>{formatPlanDate(date)} · {startTime || "pick a time"}</span><span>{duration} min</span><span>{planBudgetLabel(budget)}</span><span>{friendIds.length ? `${friendIds.length} friend${friendIds.length > 1 ? "s" : ""}` : "solo moment"}</span></div></div>
    <Button className="plan-submit" onClick={handleSubmit} disabled={submitting}>{editingPlan ? "Save changes" : "Create my break plan"} <ArrowRight size={17} /></Button>
  </aside></div>;
}

function PlanCard({ plan }: { plan: Plan }) {
  const { openPlanEditor, cancelPlan, respondToPlan } = useEscape();
  const now = Date.now();
  const timing = getPlanTiming(plan, now);
  const isOwner = plan.ownerId === "me";
  const isUpcoming = timing.status === "upcoming";
  const declined = !isOwner && plan.myStatus === "declined";
  return <article className={`plan-card ${timing.status} ${!isOwner && plan.myStatus === "pending" ? "plan-invite-card" : ""}`}>
    <div className="plan-card-top"><span className="eyebrow"><span className="eyebrow-dot" />{isOwner ? "your plan" : `${plan.ownerName}'s invite`}</span><span className={`plan-state ${timing.status} ${declined ? "declined" : ""}`}>{declined ? "declined" : describePlanStatus(plan, now)}</span></div>
    <h3>{plan.itemName}</h3>
    <div className="plan-when"><span><CalendarDays size={14} />{formatPlanDate(plan.date)}</span><span><Clock3 size={14} />{plan.startTime} · {plan.durationMin} min</span><span><Wallet size={14} />{planBudgetLabel(plan.budget)}</span></div>
    {plan.notes && <p className="plan-notes">“{plan.notes}”</p>}
    {plan.invitees.length > 0 && <div className="plan-invitee-list">{plan.invitees.map((invitee) => <span key={invitee.friendId} className={`plan-invitee ${invitee.status}`}>{invitee.name} · {invitee.status}</span>)}</div>}
    <div className="plan-card-actions">
      {isOwner && isUpcoming && <><Button variant="secondary" onClick={() => openPlanEditor(plan)}><Pencil size={14} /> edit</Button><button className="plan-cancel" onClick={() => cancelPlan(plan.id)}>cancel plan</button></>}
      {!isOwner && isUpcoming && plan.myStatus === "pending" && <><Button variant="secondary" onClick={() => respondToPlan(plan.id, "accepted")}><Check size={15} /> accept</Button><button className="plan-cancel" onClick={() => respondToPlan(plan.id, "declined")}>decline</button></>}
      {!isOwner && plan.myStatus === "accepted" && isUpcoming && <span className="plan-footnote"><Check size={14} /> you're going</span>}
      {timing.status === "past" && <span className="plan-footnote">this little plan is in the books.</span>}
      {timing.status === "cancelled" && <span className="plan-footnote">cancelled — no hard feelings.</span>}
    </div>
  </article>;
}

export function PlansSheet() {
  const { plansOpen, closePlans, planBuckets, pendingInviteCount, plansTab: tab, setPlansTab: setTab } = useEscape();
  if (!plansOpen) return null;
  const list = tab === "upcoming" ? planBuckets.upcoming : tab === "invites" ? planBuckets.invites : planBuckets.history;
  const empty = tab === "upcoming" ? "no upcoming plans yet — your next break could live here." : tab === "invites" ? "no invitations waiting. quiet calendar, clear head." : "past, cancelled, and declined plans gather here.";
  return <div className="sheet-backdrop" onClick={closePlans}><aside className="plans-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="plans-title"><button className="sheet-close" onClick={closePlans} aria-label="Close plans"><X size={21} /></button><div className="eyebrow"><span className="eyebrow-dot" />your little calendar</div><h2 id="plans-title">plans & invitations.</h2><p className="sheet-description">Everything you've planned, been invited to, or quietly cancelled. Demo classmates reply automatically here.</p>
    <div className="plan-tabs" role="tablist" aria-label="Plan lists"><button role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "is-active" : ""} onClick={() => setTab("upcoming")}>Upcoming<span>{planBuckets.upcoming.length}</span></button><button role="tab" aria-selected={tab === "invites"} className={tab === "invites" ? "is-active" : ""} onClick={() => setTab("invites")}>Invites<span>{planBuckets.invites.length}</span></button><button role="tab" aria-selected={tab === "history"} className={tab === "history" ? "is-active" : ""} onClick={() => setTab("history")}>History<span>{planBuckets.history.length}</span></button></div>
    <div className="plan-list">{list.length ? list.map((plan) => <PlanCard key={plan.id} plan={plan} />) : <div className="plans-empty"><CalendarDays size={27} /><p>{empty}</p>{tab === "invites" && pendingInviteCount === 0 && <small>New invitations will show up here.</small>}</div>}</div>
  </aside></div>;
}

export function ToastNotice() {
  const { toast, clearToast } = useEscape();
  if (!toast) return null;
  return <div className={`toast-notice toast-${toast.tone}`} role="status"><span className="toast-icon">{toast.tone === "success" ? <Check size={16} strokeWidth={3} /> : toast.tone === "error" ? <X size={16} strokeWidth={3} /> : <Info size={16} />}</span><span>{toast.message}</span><button onClick={clearToast} aria-label="Dismiss message"><X size={15} /></button></div>;
}

export function EmptyState({ onAction }: { onAction: () => void }) {
  return <div className="empty-state"><div className="empty-illustration"><div className="empty-star"><Sparkles size={28} /></div><div className="empty-circle" /><div className="empty-arrow"><ArrowDownRight size={25} /></div></div><h3>nothing saved yet.</h3><p>let's find your next little escape.</p><Button onClick={onAction}>Find a little plan <ArrowRight size={17} /></Button></div>;
}

export function SectionDivider({ children }: { children: ReactNode }) {
  return <div className="section-divider"><span>{children}</span><span className="section-divider-line" /></div>;
}

export { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, ChevronRight, Heart, Search, Users, Wallet };
