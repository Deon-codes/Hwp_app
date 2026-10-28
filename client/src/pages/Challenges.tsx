import { useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  Filter,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  CHALLENGE_CATEGORIES,
  challengesList,
  type ChallengeCategory,
} from "@/lib/escape-challenges-data";
import { useEscape } from "@/lib/escape-state";
import {
  AchievementSummary,
  BadgesShowcase,
  ChallengeCard,
  GreenSpaceModal,
  RecordStudyModal,
} from "@/components/escape/ChallengeComponents";
import { PageIntro } from "@/components/escape/EscapeComponents";

type StatusFilter = "all" | "active" | "completed";

export default function Challenges() {
  const { challenges, getChallengeProgress } = useEscape();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [greenModalOpen, setGreenModalOpen] = useState(false);

  const filteredChallenges = useMemo(() => {
    return challengesList.filter((challenge) => {
      const progress = getChallengeProgress(challenge.id);
      if (statusFilter === "active" && progress.isCompleted) return false;
      if (statusFilter === "completed" && !progress.isCompleted) return false;
      if (categoryFilter !== "all" && challenge.category !== categoryFilter) return false;
      return true;
    });
  }, [challenges, statusFilter, categoryFilter, getChallengeProgress]);

  const activeChallenges = useMemo(() => {
    return filteredChallenges.filter(
      (c) => !getChallengeProgress(c.id).isCompleted,
    );
  }, [filteredChallenges, getChallengeProgress]);

  const completedChallenges = useMemo(() => {
    return filteredChallenges.filter(
      (c) => getChallengeProgress(c.id).isCompleted,
    );
  }, [filteredChallenges, getChallengeProgress]);

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const isFiltered = statusFilter !== "all" || categoryFilter !== "all";

  return (
    <main className="challenges-page page-enter">
      <PageIntro
        eyebrow="college challenges · tiny resets"
        title="mini-challenges, real breaks."
        description="Earn badges, collect points, and turn ordinary gaps between lectures into mindful, social, and restorative moments."
        action={
          <div className="challenges-hero-stat">
            <span>your points</span>
            <strong>{challenges.points} pts</strong>
          </div>
        }
      />

      {/* Top summary card */}
      <AchievementSummary />

      {/* Filter toolbar */}
      <section className="challenges-toolbar-section">
        <div className="challenges-toolbar">
          <div className="filter-group">
            <span className="filter-group-label">
              <Filter size={14} /> Status:
            </span>
            <div className="filter-chips">
              <button
                type="button"
                className={`filter-chip ${statusFilter === "all" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All ({challengesList.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${statusFilter === "active" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("active")}
              >
                Active (
                {challengesList.filter((c) => !getChallengeProgress(c.id).isCompleted).length}
                )
              </button>
              <button
                type="button"
                className={`filter-chip ${statusFilter === "completed" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed ({challenges.completedChallengeIds.length})
              </button>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-group-label">Category:</span>
            <div className="filter-chips">
              <button
                type="button"
                className={`filter-chip ${categoryFilter === "all" ? "is-active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                All
              </button>
              {CHALLENGE_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`filter-chip ${categoryFilter === cat ? "is-active" : ""}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isFiltered && (
            <button type="button" className="filter-reset-button" onClick={resetFilters}>
              <RotateCcw size={12} /> Reset filters
            </button>
          )}
        </div>
      </section>

      {/* Challenges list */}
      <section className="challenges-content-section">
        {filteredChallenges.length === 0 ? (
          <div className="empty-state challenges-empty">
            <Sparkles size={32} />
            <h3>No challenges found</h3>
            <p>No mini-challenges match your current filter settings.</p>
            <button
              type="button"
              className="escape-button button-secondary"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        ) : statusFilter === "all" ? (
          <>
            {activeChallenges.length > 0 && (
              <div className="challenge-section-block">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">
                      <span className="eyebrow-dot" />
                      in progress & ready
                    </div>
                    <h3>active challenges ({activeChallenges.length})</h3>
                  </div>
                </div>
                <div className="challenges-grid">
                  {activeChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onOpenStudyModal={() => setStudyModalOpen(true)}
                      onOpenGreenModal={() => setGreenModalOpen(true)}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedChallenges.length > 0 && (
              <div className="challenge-section-block completed-section">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">
                      <span className="eyebrow-dot" />
                      completed & earned
                    </div>
                    <h3>completed challenges ({completedChallenges.length})</h3>
                  </div>
                </div>
                <div className="challenges-grid">
                  {completedChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onOpenStudyModal={() => setStudyModalOpen(true)}
                      onOpenGreenModal={() => setGreenModalOpen(true)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="challenges-grid">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onOpenStudyModal={() => setStudyModalOpen(true)}
                onOpenGreenModal={() => setGreenModalOpen(true)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Badges showcase */}
      <BadgesShowcase />

      {/* Modals */}
      <RecordStudyModal open={studyModalOpen} onClose={() => setStudyModalOpen(false)} />
      <GreenSpaceModal open={greenModalOpen} onClose={() => setGreenModalOpen(false)} />
    </main>
  );
}
