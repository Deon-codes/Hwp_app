import { useState } from "react";
import { Check, Edit3, Eye, EyeOff, Heart, Info, Sparkles, UserRound } from "lucide-react";
import { AvailabilityControl, Avatar, PageIntro, Segmented } from "@/components/escape/EscapeComponents";
import { getBudgetLabel, moods, type Budget, type BreakDuration, type Company, type IllustrationTone, type Mood } from "@/lib/escape-data";
import { useEscape } from "@/lib/escape-state";

const avatarTones: IllustrationTone[] = ["lavender", "coral", "mint", "blue", "yellow", "paper"];

export default function Profile() {
  const {
    profile,
    updateProfile,
    availability,
    toggleShareProfile,
    showToast,
    savedIds,
    friends,
    plans,
    challengesSummary,
  } = useEscape();
  const [name, setName] = useState(profile.name);
  const [editingName, setEditingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const toggleMood = (mood: Mood) => {
    if (profile.preferredMoods.includes(mood)) {
      if (profile.preferredMoods.length === 1) {
        showToast("Keep at least one interest so recommendations have something to work with.", "error");
        return;
      }
      updateProfile({ preferredMoods: profile.preferredMoods.filter((value) => value !== mood) });
      return;
    }
    updateProfile({ preferredMoods: [...profile.preferredMoods, mood] });
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Display name needs at least 2 characters.");
      return;
    }
    if (trimmed.length > 40) {
      setNameError("Display name must be 40 characters or fewer.");
      return;
    }
    if (updateProfile({ name: trimmed })) {
      setNameError(null);
      setEditingName(false);
      showToast("profile saved — nice and easy");
    }
  };

  return <main className="profile-page page-enter">
    <PageIntro eyebrow="your little corner of ESCAPE" title="make it feel like yours." description="A local demo profile. Your choices shape the little plans we show you." action={<div className="demo-badge"><span className="badge-dot" />saved on this device</div>} />
    <div className="profile-layout">
      <section className="profile-card profile-identity">
        <div className="profile-card-header"><div><div className="eyebrow"><span className="eyebrow-dot" />your profile</div><h2>hi, {profile.name.toLowerCase()}.</h2></div><Sparkles size={21} /></div>
        <div className="identity-main"><Avatar initials={profile.avatar} tone={profile.avatarTone} size="large" /><div className="identity-fields"><label htmlFor="display-name">display name</label><div className="editable-name">{editingName ? <input id="display-name" value={name} maxLength={40} onChange={(event) => { setName(event.target.value); setNameError(null); }} autoFocus /> : <strong>{profile.name}</strong>}{editingName ? <button onClick={saveName} aria-label="Save display name"><Check size={17} /></button> : <button onClick={() => { setName(profile.name); setEditingName(true); }} aria-label="Edit display name"><Edit3 size={16} /></button>}</div>{nameError ? <small className="form-error" role="alert">{nameError}</small> : <small>Shown to accepted friends inside this app.</small>}</div></div>
        <div className="profile-tone-row"><span className="field-label">avatar colour</span><div className="tone-options">{avatarTones.map((tone) => <button key={tone} className={`tone-option tone-${tone} ${profile.avatarTone === tone ? "is-selected" : ""}`} onClick={() => updateProfile({ avatarTone: tone })} aria-label={`Use ${tone} avatar`} aria-pressed={profile.avatarTone === tone}>{profile.avatarTone === tone && <Check size={13} />}</button>)}</div></div>
        <div className="profile-stats"><span><strong>{savedIds.length}</strong> saved</span><span><strong>{friends.filter((friend) => friend.relationship === "friends").length}</strong> friends</span><span><strong>{plans.filter((plan) => plan.cancelledAt == null).length}</strong> plans</span><span><strong>{challengesSummary.totalPoints}</strong> pts</span><span><strong>{challengesSummary.earnedBadgesCount}</strong> badges</span></div>
        <div className="profile-mini-note"><Info size={15} />Your profile lives in this browser only. There is no account, password, or server sync in this build.</div>
      </section>

      <section className="profile-card profile-preferences">
        <div className="profile-card-header"><div><div className="eyebrow"><span className="eyebrow-dot" />your defaults</div><h2>what usually helps?</h2></div><Heart size={21} /></div>
        <div className="profile-field"><span className="field-label">preferred moods <small>pick at least one</small></span><div className="profile-mood-row">{moods.map((mood) => <button key={mood.name} className={`profile-mood-chip tone-${mood.tone} ${profile.preferredMoods.includes(mood.name) ? "is-selected" : ""}`} onClick={() => toggleMood(mood.name)} aria-pressed={profile.preferredMoods.includes(mood.name)}>{profile.preferredMoods.includes(mood.name) && <Check size={13} />}{mood.name}</button>)}</div></div>
        <div className="profile-segment-row"><Segmented label="default break" options={[10, 15, 30, 45, 60] as const} value={profile.defaultDuration} onChange={(value: BreakDuration) => updateProfile({ defaultDuration: value })} optionLabel={(value) => `${value} min`} /><Segmented label="default budget" options={[0, 50, 100, 200] as const} value={profile.defaultBudget} onChange={(value: Budget) => updateProfile({ defaultBudget: value })} optionLabel={getBudgetLabel} /></div>
        <Segmented label="usually with" options={["solo", "friends", "either"] as const} value={profile.company} onChange={(value: Company) => updateProfile({ company: value })} optionLabel={(value) => value === "friends" ? "With friends" : value === "solo" ? "Solo" : "Either"} />
        <div className="profile-preview">
          <div className="profile-preview-header"><span className="field-label">how friends see you</span><button className={`visibility-toggle ${profile.shareProfile ? "is-on" : ""}`} aria-pressed={profile.shareProfile} onClick={toggleShareProfile}>{profile.shareProfile ? <Eye size={14} /> : <EyeOff size={14} />}{profile.shareProfile ? "profile visible" : "profile private"}</button></div>
          <div className="preview-card"><Avatar initials={profile.avatar} tone={profile.avatarTone} size="small" /><div>{profile.shareProfile ? <><strong>{profile.name}</strong><p>{profile.preferredMoods.join(" · ")} · usually {profile.company === "either" ? "solo or with friends" : profile.company}</p><small>{profile.shareProfile && profile.shareAvailability ? availability.label : "availability not shared"}</small></> : <><strong>private profile</strong><p>Your name and interests stay hidden from the demo directory.</p></>}</div></div>
        </div>
      </section>

      <section className="profile-card profile-availability">
        <div className="profile-card-header"><div><div className="eyebrow"><span className="eyebrow-dot" />break visibility</div><h2>let your people know.</h2></div><UserRound size={21} /></div>
        <AvailabilityControl />
        <div className="profile-data-note"><Info size={14} /><span>Availability is voluntary, expires automatically, and is only shown to accepted friends. Nobody can change it for you.</span></div>
      </section>
    </div>
  </main>;
}
