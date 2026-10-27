import { Bookmark, Sparkles } from "lucide-react";
import { ActivityCard, Button, EmptyState, PageIntro, PlaceCard } from "@/components/escape/EscapeComponents";
import { getSavedItems, useEscape } from "@/lib/escape-state";

export default function Saved() {
  const { savedIds, setView } = useEscape();
  const items = getSavedItems(savedIds);
  return <main className="saved-page page-enter">
    <PageIntro eyebrow="the things that made you pause" title="your little collection." description="Saved ideas and spots, ready for the next gap in your day." action={<div className="saved-count"><Bookmark size={17} fill="currentColor" /><strong>{items.length}</strong><span>saved</span></div>} />
    {items.length ? <>
      <div className="saved-toolbar"><span><Sparkles size={15} />your saved escapes persist in this browser — even after a refresh.</span><Button variant="ghost" onClick={() => setView("discover")}>find another <span>↗</span></Button></div>
      <div className="saved-grid">{items.map((item, index) => "social" in item ? <ActivityCard key={item.id} item={item} index={index} /> : <PlaceCard key={item.id} item={item} index={index} />)}</div>
    </> : <EmptyState onAction={() => setView("discover")} />}
  </main>;
}
