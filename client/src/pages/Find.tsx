import { useMemo, useState } from "react";
import { ChevronDown, Filter, Info, MapPin, Search, Sparkles, Users } from "lucide-react";
import {
  AvailabilityControl,
  Button,
  DirectoryCard,
  FriendCard,
  FriendRequestCard,
  MiniMap,
  PageIntro,
  PlaceCard,
  SearchField,
} from "@/components/escape/EscapeComponents";
import { spotCategories, type Budget, type BreakDuration } from "@/lib/escape-data";
import { filterPlaces, type CatalogSort } from "@/lib/escape-logic";
import { useEscape } from "@/lib/escape-state";

const distanceOptions: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "any distance" },
  { value: 5, label: "≤ 5 min" },
  { value: 10, label: "≤ 10 min" },
  { value: 15, label: "≤ 15 min" },
];

export default function Find() {
  const {
    finderTab,
    setFinderTab,
    prefs,
    friends,
    availableFriends,
    incomingRequests,
    outgoingRequests,
    profile,
    availability,
    showToast,
  } = useEscape();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<Budget | "all">("all");
  const [duration, setDuration] = useState<BreakDuration | "all">("all");
  const [maxWalk, setMaxWalk] = useState<number | "all">("all");
  const [sort, setSort] = useState<CatalogSort>("best");
  const [peopleQuery, setPeopleQuery] = useState("");

  const filteredPlaces = useMemo(() => filterPlaces({
    query,
    category,
    maxPrice: price === "all" ? null : price,
    maxDuration: duration === "all" ? null : duration,
    maxWalk: maxWalk === "all" ? null : maxWalk,
    sort,
  }), [query, category, price, duration, maxWalk, sort]);

  const filteredPeople = useMemo(() => {
    const normalized = peopleQuery.trim().toLowerCase();
    return friends.filter((friend) => {
      if (!normalized) return true;
      return `${friend.name} ${friend.bio} ${friend.interests.join(" ")}`.toLowerCase().includes(normalized);
    });
  }, [friends, peopleQuery]);

  const resetSpotFilters = () => {
    setCategory("all");
    setQuery("");
    setPrice("all");
    setDuration("all");
    setMaxWalk("all");
    setSort("best");
  };
  const spotFiltersActive = Boolean(query.trim()) || category !== "all" || price !== "all" || duration !== "all" || maxWalk !== "all" || sort !== "best";
  const freeCount = availableFriends.length;
  const requestCount = incomingRequests.length;

  return <main className="find-page page-enter">
    <PageIntro eyebrow="campus, but make it a little more intentional" title="find your kind of break." description="Choose a spot, find your people, or make a simple plan without making a whole thing of it." action={<div className="finder-stat"><span>your defaults</span><strong>{prefs.duration} min · ₹{prefs.budget || 0}</strong></div>} />
    <div className="finder-tabs" role="tablist" aria-label="Break Finder sections">
      <button role="tab" aria-selected={finderTab === "spots"} className={finderTab === "spots" ? "is-active" : ""} onClick={() => setFinderTab("spots")}><MapPin size={18} />Spots<span>{filteredPlaces.length}</span></button>
      <button role="tab" aria-selected={finderTab === "people"} className={finderTab === "people" ? "is-active" : ""} onClick={() => setFinderTab("people")}><Sparkles size={18} />Your People<span>{requestCount ? `${requestCount} request${requestCount === 1 ? "" : "s"}` : `${freeCount} free`}</span></button>
    </div>

    {finderTab === "spots" ? <section className="finder-spots">
      <div className="finder-overview"><div><div className="eyebrow"><span className="eyebrow-dot" />illustrative campus guide</div><h2>spots with a little soul.</h2><p>Not live navigation — just the places that make a short break feel more like a break.</p></div><MiniMap /></div>
      <div className="finder-filters">
        <div className="filter-label"><Filter size={15} />filter spots</div>
        <div className="filter-scroll">
          <SearchField label="Search spots" value={query} onChange={setQuery} placeholder="search cafés, parks, study spots…" />
          <button className={`filter-chip ${category === "all" ? "is-active" : ""}`} onClick={() => setCategory("all")}>All spots</button>
          {spotCategories.map((entry) => <button key={entry} className={`filter-chip ${category === entry ? "is-active" : ""}`} onClick={() => setCategory(entry)}>{entry}</button>)}
          <label className="filter-select"><span>price</span><select value={price} onChange={(event) => setPrice(event.target.value === "all" ? "all" : Number(event.target.value) as Budget)}><option value="all">any</option><option value="0">free</option><option value="50">under ₹50</option><option value="100">under ₹100</option></select><ChevronDown size={14} /></label>
          <label className="filter-select"><span>time</span><select value={duration} onChange={(event) => setDuration(event.target.value === "all" ? "all" : Number(event.target.value) as BreakDuration)}><option value="all">any</option><option value="10">10 min</option><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option></select><ChevronDown size={14} /></label>
          <label className="filter-select"><span>walk</span><select value={String(maxWalk)} onChange={(event) => setMaxWalk(event.target.value === "all" ? "all" : Number(event.target.value))} aria-label="Filter spots by walk distance"><option value="all">any</option>{distanceOptions.filter((option) => option.value !== "all").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={14} /></label>
          <label className="filter-select"><span>sort</span><select value={sort} onChange={(event) => setSort(event.target.value as CatalogSort)} aria-label="Sort spots"><option value="best">best fit</option><option value="closest">closest first</option><option value="cheapest">lowest cost</option><option value="quickest">quickest</option></select><ChevronDown size={14} /></label>
          {spotFiltersActive && <button className="filter-reset" onClick={resetSpotFilters}>reset</button>}
        </div>
      </div>
      <div className="spot-result-heading"><span><strong>{filteredPlaces.length}</strong> spots to wander toward</span><span className="estimate-label"><Info size={13} /> demo estimates</span></div>
      {filteredPlaces.length ? <div className="place-grid">{filteredPlaces.map((place, index) => <PlaceCard key={place.id} item={place} index={index} />)}</div> : <div className="small-empty"><Search size={22} /><strong>no spot fits those filters yet.</strong><button onClick={resetSpotFilters}>reset filters</button></div>}
    </section> : <section className="finder-people">
      <div className="people-intro"><div><div className="eyebrow"><span className="eyebrow-dot" />voluntary + low pressure</div><h2>who’s around for a little something?</h2><p>These are fictional demo classmates. They choose whether to show up here — no exact locations, no private details. Availability expires on its own.</p></div><AvailabilityControl /></div>
      <div className="people-note"><Info size={15} /><span>Your availability: <strong>{availability.status === "available" ? "visible" : availability.status}</strong>{availability.expired ? " (expired — set it again)" : ""} · profile {profile.shareProfile ? "visible" : "private"}. Change it anytime from this page or your profile.</span></div>

      <section className="people-section" aria-labelledby="available-title">
        <div className="people-section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />available right now</div><h3 id="available-title">your people, without the guesswork.</h3></div><span className="people-count">{freeCount} free</span></div>
        {availableFriends.length ? <div className="friend-grid">{availableFriends.map((friend) => <FriendCard key={friend.id} friend={friend} />)}</div> : <div className="people-empty"><Users size={22} /><p>Nobody is sharing availability right now. You can still send a friend request below or check back later.</p></div>}
      </section>

      {(incomingRequests.length > 0 || outgoingRequests.length > 0) && <section className="people-section" aria-labelledby="requests-title">
        <div className="people-section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />friend requests</div><h3 id="requests-title">the "should we hang out?" stage.</h3></div><span className="people-count">{incomingRequests.length + outgoingRequests.length} waiting</span></div>
        <div className="request-list">{incomingRequests.map((friend) => <FriendRequestCard key={friend.id} friend={friend} direction="incoming" />)}{outgoingRequests.map((friend) => <FriendRequestCard key={friend.id} friend={friend} direction="outgoing" />)}</div>
      </section>}

      <section className="people-section" aria-labelledby="directory-title">
        <div className="people-section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" />campus directory</div><h3 id="directory-title">find your people.</h3></div><span className="people-count">{friends.length} demo classmates</span></div>
        <div className="directory-toolbar"><SearchField label="Search demo classmates" value={peopleQuery} onChange={setPeopleQuery} placeholder="search by name or interest…" /><button className="filter-reset" onClick={() => setPeopleQuery("")}>clear</button></div>
        <div className="directory-grid">{filteredPeople.length ? filteredPeople.map((friend) => <DirectoryCard key={friend.id} friend={friend} />) : <div className="people-empty"><Search size={22} /><p>No demo classmate matches “{peopleQuery}”. Try another name or interest.</p></div>}</div>
        <p className="directory-note"><Info size={14} /> Friend requests, availability, and shared details stay in this browser. Only accepted friends can see availability, and nobody can see a precise location.</p>
      </section>

      <section className="people-section demo-reply-note">
        <div><Sparkles size={20} /><strong>about this local demo</strong><p>Classmates are seeded fictional profiles. When you invite them to a plan they accept or decline automatically based on their simulated availability, so the invitation states are visible without pretending a real person was messaged.</p><Button variant="ghost" onClick={() => showToast("no messages are ever sent in this demo — your plans live in this browser", "info")}>how invites work</Button></div>
      </section>
    </section>}
  </main>;
}
