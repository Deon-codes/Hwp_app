import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clock3,
  Coffee,
  Compass,
  Flame,
  Flower2,
  Headphones,
  Info,
  Lock,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  badgesCatalog,
  challengeById,
  challengesList,
  type ChallengeBadge,
  type ChallengeCadence,
  type ChallengeCategory,
  type ChallengeDefinition,
} from "@/lib/escape-challenges-data";
import { placeById, places, activities, activityById } from "@/lib/escape-data";
import { useEscape } from "@/lib/escape-state";
import { Avatar, Button, Mark, TinyDoodle } from "./EscapeComponents";

const toneClass = (tone: string) => `tone-${tone}`;

export function AchievementSummary() {
  const { challengesSummary, setView } = useEscape();
  const { totalPoints, completedCount, totalChallenges, earnedBadgesCount, totalBadges, activeTimerRemainingSeconds } =
    challengesSummary;

  return (
    <div className="achievement-summary-card">
      <div className="achievement-summary-top">
        <div className="achievement-stat">
          <span className="achievement-stat-icon stat-points">
            <Star size={18} fill="currentColor" />
          </span>
          <div>
            <small>total points</small>
            <strong>{totalPoints} pts</strong>
          </div>
        </div>

        <div className="achievement-stat">
          <span className="achievement-stat-icon stat-challenges">
            <Trophy size={18} />
          </span>
          <div>
            <small>completed</small>
            <strong>
              {completedCount} / {totalChallenges}
            </strong>
          </div>
        </div>

        <div className="achievement-stat">
          <span className="achievement-stat-icon stat-badges">
            <Award size={18} />
          </span>
          <div>
            <small>badges earned</small>
            <strong>
              {earnedBadgesCount} / {totalBadges}
            </strong>
          </div>
        </div>

        {activeTimerRemainingSeconds != null && activeTimerRemainingSeconds > 0 && (
          <div className="achievement-timer-pill" role="status" aria-live="polite">
            <Timer size={15} className="animate-pulse text-coral" />
            <span>
              Detox: {Math.floor(activeTimerRemainingSeconds / 60)}:
              {String(activeTimerRemainingSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
      <p className="achievement-summary-note">
        <Sparkles size={13} />
        Complete optional campus mini-adventures, earn college badges, and make room for honest resets.
      </p>
    </div>
  );
}

export function BadgesShowcase() {
  const { challenges } = useEscape();
  const [selectedBadge, setSelectedBadge] = useState<ChallengeBadge | null>(null);

  return (
    <section className="badges-showcase-section" aria-labelledby="badges-heading">
      <div className="section-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            badges & recognition
          </div>
          <h2 id="badges-heading">your little badges.</h2>
          <p>Each milestone unlocks a little keepsake for your college days.</p>
        </div>
        <div className="badge-count-pill">
          <Award size={14} />
          <span>
            {challenges.earnedBadgeIds.length} of {badgesCatalog.length} unlocked
          </span>
        </div>
      </div>

      <div className="badges-grid" role="list" aria-label="Earned and available badges">
        {badgesCatalog.map((badge) => {
          const isEarned = challenges.earnedBadgeIds.includes(badge.id);
          const Icon = badge.icon;
          return (
            <button
              type="button"
              key={badge.id}
              role="listitem"
              className={`badge-item ${isEarned ? "is-earned" : "is-locked"} ${toneClass(badge.tone)}`}
              onClick={() => setSelectedBadge(badge)}
              aria-label={`${badge.name}: ${badge.description}. Status: ${isEarned ? "Unlocked" : "Locked"}`}
            >
              <div className="badge-icon-wrap">
                <Icon size={24} strokeWidth={2.2} />
                {isEarned ? (
                  <span className="badge-unlocked-tick" aria-hidden="true">
                    <Check size={11} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="badge-lock-indicator" aria-hidden="true">
                    <Lock size={10} />
                  </span>
                )}
              </div>
              <strong className="badge-name">{badge.name}</strong>
              <small className="badge-points">+{badge.points} pts</small>
            </button>
          );
        })}
      </div>

      {selectedBadge && (
        <div className="badge-detail-popover" role="dialog" aria-label={selectedBadge.name}>
          <div className="badge-popover-content">
            <button
              type="button"
              className="badge-popover-close"
              onClick={() => setSelectedBadge(null)}
              aria-label="Close badge details"
            >
              <X size={14} />
            </button>
            <div className="badge-popover-header">
              <span className={`badge-icon-wrap large ${toneClass(selectedBadge.tone)}`}>
                <selectedBadge.icon size={28} />
              </span>
              <div>
                <strong>{selectedBadge.name}</strong>
                <span className="badge-points-tag">+{selectedBadge.points} points</span>
              </div>
            </div>
            <p>{selectedBadge.description}</p>
            <div className="badge-popover-status">
              {challenges.earnedBadgeIds.includes(selectedBadge.id) ? (
                <span className="badge-earned-label">
                  <CheckCircle2 size={14} /> Earned & active in your collection
                </span>
              ) : (
                <span className="badge-locked-label">
                  <Lock size={14} /> Complete the matching challenge to unlock
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function ChallengeCard({
  challenge,
  onOpenStudyModal,
  onOpenGreenModal,
}: {
  challenge: ChallengeDefinition;
  onOpenStudyModal: () => void;
  onOpenGreenModal: () => void;
}) {
  const {
    getChallengeProgress,
    startDetoxTimer,
    cancelDetoxTimer,
    claimDetoxTimer,
    setView,
  } = useEscape();

  const progress = getChallengeProgress(challenge.id);
  const Icon = challenge.icon;
  const isCompleted = progress.isCompleted;

  const cadenceLabel: Record<ChallengeCadence, string> = {
    "one-time": "One-time",
    weekly: "Weekly",
    repeatable: "Repeatable",
  };

  const handleAction = () => {
    if (challenge.id === "campus-explorer") {
      setView("find");
    } else if (challenge.id === "digital-detox") {
      if (progress.isReadyToClaim) {
        claimDetoxTimer();
      } else if (progress.timerRemainingSeconds != null) {
        cancelDetoxTimer();
      } else {
        startDetoxTimer(15 * 60);
      }
    } else if (challenge.id === "study-buddy") {
      onOpenStudyModal();
    } else if (challenge.id === "green-escape") {
      onOpenGreenModal();
    } else if (challenge.id === "chai-committee") {
      onOpenStudyModal();
    } else if (challenge.id === "curious-wanderer") {
      setView("discover");
    }
  };

  return (
    <article
      className={`challenge-card ${isCompleted ? "is-completed" : "is-active"}`}
      aria-labelledby={`challenge-title-${challenge.id}`}
    >
      <div className="challenge-card-top">
        <div className="challenge-tags">
          <span className="challenge-category-tag">{challenge.category}</span>
          <span className={`challenge-cadence-tag cadence-${challenge.cadence}`}>
            {cadenceLabel[challenge.cadence]}
          </span>
          <span className="challenge-difficulty-tag">{challenge.difficulty}</span>
        </div>
        <div className="challenge-reward-badge" aria-label={`Reward: ${challenge.points} points`}>
          <Star size={13} fill="currentColor" />
          <span>+{challenge.points} pts</span>
        </div>
      </div>

      <div className="challenge-header">
        <div className={`challenge-icon ${toneClass(challenge.badge.tone)}`}>
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <div className="challenge-title-group">
          <h3 id={`challenge-title-${challenge.id}`}>{challenge.title}</h3>
          <p>{challenge.description}</p>
        </div>
      </div>

      <div className="challenge-criteria-box">
        <Info size={13} />
        <span>{challenge.criteriaDescription}</span>
      </div>

      <div className="challenge-progress-section">
        <div className="challenge-progress-label">
          <span>Progress</span>
          <strong>{progress.label}</strong>
        </div>
        <div
          className="challenge-progress-track"
          role="progressbar"
          aria-valuenow={progress.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`challenge-progress-fill ${isCompleted ? "fill-completed" : ""}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div className="challenge-footer">
        <div className="challenge-badge-preview">
          <span className="badge-preview-icon">
            <challenge.badge.icon size={15} />
          </span>
          <small>
            Badge: <strong>{challenge.badge.name}</strong>
          </small>
        </div>

        <div className="challenge-card-actions">
          {challenge.id === "digital-detox" && progress.timerRemainingSeconds != null && (
            <button
              type="button"
              className="escape-button button-ghost cancel-timer-button"
              onClick={cancelDetoxTimer}
            >
              Cancel
            </button>
          )}

          {isCompleted && challenge.cadence !== "repeatable" ? (
            <span className="challenge-completed-pill">
              <Check size={14} /> Completed
            </span>
          ) : progress.isReadyToClaim ? (
            <Button variant="coral" onClick={handleAction}>
              <Sparkles size={15} /> Claim Reward
            </Button>
          ) : challenge.id === "digital-detox" ? (
            progress.timerRemainingSeconds != null ? (
              <Button variant="primary" disabled>
                <Timer size={15} className="animate-spin" /> Detox in Progress
              </Button>
            ) : (
              <Button variant="primary" onClick={handleAction}>
                <Play size={14} fill="currentColor" /> Start 15-min Detox
              </Button>
            )
          ) : challenge.id === "campus-explorer" ? (
            <Button variant="secondary" onClick={handleAction}>
              <Compass size={14} /> Discover Spots
            </Button>
          ) : challenge.id === "study-buddy" ? (
            <Button variant="secondary" onClick={handleAction}>
              <BookOpen size={14} /> Record Session
            </Button>
          ) : challenge.id === "green-escape" ? (
            <Button variant="secondary" onClick={handleAction}>
              <Flower2 size={14} /> Visit Green Space
            </Button>
          ) : challenge.id === "chai-committee" ? (
            <Button variant="secondary" onClick={handleAction}>
              <Coffee size={14} /> Record Chai Break
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleAction}>
              <Sparkles size={14} /> Continue
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function RecordStudyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { acceptedFriends, plans, recordStudySession } = useEscape();
  const [selectedFriendId, setSelectedFriendId] = useState<string>(
    acceptedFriends[0]?.id ?? "",
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<"friend" | "plan">("friend");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "friend") {
      if (!selectedFriendId) return;
      const ok = recordStudySession({
        friendId: selectedFriendId,
        note: notes,
      });
      if (ok) onClose();
    } else {
      if (!selectedPlanId) return;
      const ok = recordStudySession({
        planId: selectedPlanId,
        note: notes,
      });
      if (ok) onClose();
    }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="study-modal-title">
      <div className="detail-sheet challenge-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="sheet-body">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            study buddy challenge
          </div>
          <h2 id="study-modal-title">record a study session.</h2>
          <p className="sheet-description">
            Studying together keeps you accountable. Confirm a session you completed with an accepted classmate or existing study plan.
          </p>

          <form onSubmit={handleSubmit} className="challenge-form">
            <div className="challenge-modal-tabs">
              <button
                type="button"
                className={mode === "friend" ? "is-active" : ""}
                onClick={() => setMode("friend")}
              >
                With a classmate
              </button>
              <button
                type="button"
                className={mode === "plan" ? "is-active" : ""}
                onClick={() => setMode("plan")}
              >
                From existing plan
              </button>
            </div>

            {mode === "friend" ? (
              <div className="form-field">
                <label htmlFor="friend-select">
                  <span>Classmate</span>
                </label>
                {acceptedFriends.length ? (
                  <select
                    id="friend-select"
                    value={selectedFriendId}
                    onChange={(e) => setSelectedFriendId(e.target.value)}
                    required
                  >
                    {acceptedFriends.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name} ({friend.status})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="form-hint">
                    No connected friends yet. Connect with classmates in Break Finder first!
                  </p>
                )}
              </div>
            ) : (
              <div className="form-field">
                <label htmlFor="plan-select">
                  <span>Completed Plan</span>
                </label>
                {plans.length ? (
                  <select
                    id="plan-select"
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    required
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.itemName} ({plan.date} · {plan.startTime})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="form-hint">No plans found in your history.</p>
                )}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="study-notes">
                <span>Notes / Topic (Optional)</span>
              </label>
              <input
                id="study-notes"
                type="text"
                placeholder="e.g. Reviewed physics notes in the library annex"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="honest-verification-note">
              <Info size={14} />
              <span>
                <strong>Honest college honor system:</strong> ESCAPE trusts your confirmation. No tracking or location snooping is ever performed.
              </span>
            </div>

            <div className="sheet-actions">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={mode === "friend" ? !selectedFriendId : !selectedPlanId}
              >
                Confirm Session (+120 pts)
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function GreenSpaceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { recordGreenEscape, openDetails } = useEscape();

  if (!open) return null;

  const qualifyingSpots = [
    {
      id: "place-garden",
      name: "Garden courtyard",
      desc: "A patch of shade, a few benches, and enough green to make the day feel wider.",
      type: "place",
      hint: "behind the arts block",
    },
    {
      id: "garden-reset",
      name: "Garden reset",
      desc: "Take the long way through the campus garden and let your brain change channels.",
      type: "activity",
      hint: "campus gardens",
    },
  ];

  const handleConfirm = (id: string) => {
    recordGreenEscape(id);
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="green-modal-title">
      <div className="detail-sheet challenge-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="sheet-body">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            green escape challenge
          </div>
          <h2 id="green-modal-title">touch some campus grass.</h2>
          <p className="sheet-description">
            Step outside to an airy campus green space. Visiting either of these qualifying spots fulfills this week’s challenge.
          </p>

          <div className="green-spots-list">
            {qualifyingSpots.map((spot) => (
              <div key={spot.id} className="green-spot-card">
                <div className="green-spot-info">
                  <span className="green-spot-icon">
                    <Flower2 size={20} />
                  </span>
                  <div>
                    <strong>{spot.name}</strong>
                    <p>{spot.desc}</p>
                    <small>Location: {spot.hint}</small>
                  </div>
                </div>
                <div className="green-spot-actions">
                  <Button variant="secondary" onClick={() => handleConfirm(spot.id)}>
                    <Check size={14} /> I Visited This
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="honest-verification-note">
            <Info size={14} />
            <span>
              <strong>Voluntary verification:</strong> Confirm your visit when you have taken a breath outside. No GPS tracking used.
            </span>
          </div>

          <div className="sheet-actions">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
