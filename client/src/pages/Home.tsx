import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Filter,
  Info,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import {
  ActivityCard,
  Avatar,
  Button,
  HeroArt,
  MoodCard,
  PlaceCard,
  SearchField,
  Segmented,
  TinyDoodle,
} from "@/components/escape/EscapeComponents";
import { activityCategories, formatPlanDate, getBudgetLabel, moods } from "@/lib/escape-data";
import { recommendActivities, recommendPlaces } from "@/lib/escape-logic";
import { useEscape } from "@/lib/escape-state";

const walkOptions: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "any walk" },
  { value: 5, label: "≤ 5 min" },
  { value: 10, label: "≤ 10 min" },
  { value: 15, label: "≤ 15 min" },
];

export default function Home() {
  const {
    prefs,
    setMood,
    setDuration,
    setBudget,
    setCompany,
    sortMode,
    setSortMode,
    profile,
    availability,
    availableFriends,
    nextPlan,
    pendingInviteCount,
    challengesSummary,
    openPlans,
    openPeople,
    openSpots,
    setView,
    jumpToRecommendations,
    jumpToPreferences,
  } = useEscape();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [maxWalk, setMaxWalk] = useState<number | "all">("all");

  const recommendations = useMemo(() => {
    const results = recommendActivities(
      prefs,
      {
        query,
        category,
        maxWalk: maxWalk === "all" ? null : maxWalk,
      },
      profile.preferredMoods,
    );
    if (sortMode === "shortest") return [...results].sort((a, b) => a.item.durationMin - b.item.durationMin || a.item.walkMin - b.item.walkMin);
    if (sortMode === "lowest") return [...results].sort((a, b) => a.item.price - b.item.price || a.item.durationMin - b.item.durationMin);
    return results;
  }, [prefs, query, category, maxWalk, profile.preferredMoods, sortMode]);

  const suggestedPlaces = useMemo(() => recommendPlaces(prefs, 3), [prefs]);
  const filtersActive = Boolean(query.trim()) || category !== "all" || maxWalk !== "all";
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setMaxWalk("all");
    setDuration(30);
    setBudget(100);
    setCompany("either");
  };
  const nextPlanLabel = nextPlan ? formatPlanDate(nextPlan.date) : null;

  return <main className="discover-page page-enter">
    <section className="hero-section">
      <div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot" /> a tiny campus break companion</div><h1>your break<br /><em>deserves better.</em></h1><p>Escape the lecture-to-lecture loop. Find your vibe, discover a spot, and make a little moment out of your day.</p><div className="hero-actions"><Button onClick={jumpToRecommendations}>find my escape <ArrowRight size={18} /></Button><span className="hero-caption">good things happen between lectures.</span></div></div><div className="hero-visual-wrap"><HeroArt /><TinyDoodle type="spark" /><TinyDoodle type="arrow" /></div>
    </section>

    <section className="dashboard-section section-block" aria-labelledby="dashboard-title">
      <div className="section-heading dashboard-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />today, at a glance</div><h2 id="dashboard-title">your little dashboard.</h2><p>Your break, your budget, your people, your next plan — all in one place.</p></div><div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}><button className="dashboard-plans-link" onClick={() => setView("challenges")}><Trophy size={14} /> challenges ({challengesSummary.totalPoints} pts)</button>{pendingInviteCount > 0 ? <button className="invite-banner" onClick={() => openPlans("invites")}><CalendarDays size={16} />{pendingInviteCount} invitation{pendingInviteCount === 1 ? "" : "s"} waiting <ArrowRight size={15} /></button> : <button className="dashboard-plans-link" onClick={() => openPlans("upcoming")}>your plans <ArrowRight size={15} /></button>}</div></div>
      <div className="dashboard-grid">
        <button className="dashboard-card dash-time" onClick={jumpToPreferences} aria-label="Change your available break time"><span className="dashboard-card-icon"><Clock3 size={18} /></span><span className="dashboard-card-copy"><small>break time</small><strong>{prefs.duration} min</strong><span>{availability.expired ? "visibility expired — reset it" : availability.label}</span></span><ArrowRight size={16} /></button>
        <button className="dashboard-card dash-budget" onClick={jumpToPreferences} aria-label="Change your budget"><span className="dashboard-card-icon"><Wallet size={18} /></span><span className="dashboard-card-copy"><small>spend ceiling</small><strong>{getBudgetLabel(prefs.budget)}</strong><span>{prefs.company === "either" ? "solo or with friends" : `usually ${prefs.company}`}</span></span><ArrowRight size={16} /></button>
        <button className="dashboard-card dash-friends" onClick={openPeople} aria-label="See friends who are available"><span className="dashboard-card-icon"><Users size={18} /></span><span className="dashboard-card-copy"><small>friends free</small><strong>{availableFriends.length} around</strong><span>{availableFriends.length ? availableFriends.slice(0, 3).map((friend) => friend.name).join(", ") : "nobody sharing right now"}</span></span><span className="dashboard-avatars">{availableFriends.slice(0, 3).map((friend) => <Avatar key={friend.id} initials={friend.initials} tone={friend.tone} size="small" />)}</span><ArrowRight size={16} /></button>
        <button className="dashboard-card dash-plan" onClick={() => openPlans("upcoming")} aria-label="Open your plans"><span className="dashboard-card-icon"><CalendarDays size={18} /></span><span className="dashboard-card-copy"><small>next plan</small><strong>{nextPlan ? nextPlan.itemName : "no plans yet"}</strong><span>{nextPlan ? `${nextPlanLabel} · ${nextPlan.startTime}` : "start a little something"}</span></span><ArrowRight size={16} /></button>
      </div>
      <p className="dashboard-demo-note"><Info size={13} /> Availability, classmates, prices, and walk times here are simulated demo data stored in this browser.</p>
    </section>

    <section className="mood-section section-block" aria-labelledby="mood-title"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />start with a feeling</div><h2 id="mood-title">okay, what’s the vibe?</h2><p>Pick the feeling you want a little more of. We’ll do the sorting.</p></div><div className="selected-vibe"><span>your vibe</span><strong>{prefs.mood}</strong><Sparkles size={17} /></div></div><div className="mood-grid">{moods.map((mood) => <MoodCard key={mood.name} {...mood} selected={prefs.mood === mood.name} onClick={() => setMood(mood.name)} />)}</div></section>

    <section className="preference-section section-block" id="preferences" aria-labelledby="preference-title"><div className="preference-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />shape the little plan</div><h2 id="preference-title">a few tiny details.</h2></div><span className="preference-note"><SlidersHorizontal size={15} /> update anytime</span></div><div className="preference-grid"><Segmented label="time available" options={[10, 15, 30, 45, 60] as const} value={prefs.duration} onChange={setDuration} optionLabel={(value) => `${value} min`} /><Segmented label="budget" options={[0, 50, 100, 200] as const} value={prefs.budget} onChange={setBudget} optionLabel={getBudgetLabel} /><Segmented label="company" options={["solo", "friends", "either"] as const} value={prefs.company} onChange={setCompany} optionLabel={(value) => value === "friends" ? "With friends" : value === "solo" ? "Solo" : "Either"} /></div><div className="preference-cta-row"><p><Sparkles size={15} /> currently looking for <strong>{prefs.mood.toLowerCase()}</strong> · {prefs.duration} min · {getBudgetLabel(prefs.budget).toLowerCase()} · {prefs.company === "friends" ? "with friends" : prefs.company}</p><Button variant="secondary" onClick={jumpToRecommendations}>show me the good stuff <ArrowRight size={17} /></Button></div></section>

    <section className="recommendations-section section-block" id="recommendations" aria-labelledby="recommendations-title">
      <div className="section-heading recommendations-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />curated for your in-between</div><h2 id="recommendations-title">little plans, big mood.</h2><p>{recommendations.length ? `${recommendations.length} little ${recommendations.length === 1 ? "idea" : "ideas"} fit this moment.` : "The right little plan might be one filter away."}</p></div><label className="sort-select"><span><Filter size={14} /> sort by</span><select value={sortMode} onChange={(event) => setSortMode(event.target.value as typeof sortMode)} aria-label="Sort recommendations"><option value="best">best fit</option><option value="shortest">shortest first</option><option value="lowest">lowest cost</option></select><ChevronDown size={15} /></label></div>
      <div className="discover-filter-bar">
        <SearchField label="Search activities" value={query} onChange={setQuery} placeholder="search activities, moods, tags…" />
        <label className="filter-select"><span>category</span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by activity category"><option value="all">all ideas</option>{activityCategories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}</select><ChevronDown size={14} /></label>
        <label className="filter-select"><span>walk</span><select value={String(maxWalk)} onChange={(event) => setMaxWalk(event.target.value === "all" ? "all" : Number(event.target.value))} aria-label="Filter by walking distance"><option value="all">any walk</option>{walkOptions.filter((option) => option.value !== "all").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={14} /></label>
        {filtersActive && <button className="filter-reset" onClick={() => { setQuery(""); setCategory("all"); setMaxWalk("all"); }}>clear search filters</button>}
      </div>
      {recommendations.length ? <div className="activity-grid">{recommendations.map(({ item, reason }, index) => <ActivityCard key={item.id} item={item} index={index} reason={reason} />)}</div> : <div className="recommendation-empty"><div className="empty-state compact-empty"><div className="empty-illustration"><div className="empty-star"><Sparkles size={23} /></div><div className="empty-circle" /><div className="empty-arrow"><ArrowRight size={22} /></div></div><h3>hmm, nothing fits just yet.</h3><p>Loosen the search, walk, or break settings and we'll look again. No pretending a 40-minute walk fits a 10-minute break.</p><Button variant="secondary" onClick={resetFilters}>Loosen the filters <ArrowRight size={17} /></Button></div></div>}
      <p className="filter-footnote"><Check size={13} /> Travel time is shown as a walk estimate; recommendations mark tight fits instead of hiding them. All times and prices are illustrative demo data.</p>
    </section>

    <section className="suggested-section section-block" aria-labelledby="suggested-title"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />spots for this moment</div><h2 id="suggested-title">a place to land.</h2><p>Suggested using your mood, budget, and available time.</p></div><Button variant="ghost" onClick={openSpots}>all campus spots <ArrowRight size={16} /></Button></div><div className="place-grid suggested-grid">{suggestedPlaces.map((place, index) => <PlaceCard key={place.id} item={place} index={index} />)}</div><div className="suggested-actions"><Button variant="secondary" onClick={openPeople}><Users size={16} /> see who's free</Button><Button variant="ghost" onClick={() => setView("saved")}><Sparkles size={16} /> your saved list</Button></div></section>

    <section className="soft-note section-block"><div className="soft-note-sticker"><TinyDoodle type="sun" /></div><div><strong>local demo data, real working flows.</strong><p>Places, prices, walking times, and classmates are illustrative. Your profile, saved places, friends, availability, and plans are saved safely in this browser. There is no live location, messaging, or account system connected.</p></div></section>
  </main>;
}
