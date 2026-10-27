import { ArrowLeft, Compass } from "lucide-react";
import { Button, TinyDoodle } from "@/components/escape/EscapeComponents";
import { useEscape } from "@/lib/escape-state";

export default function NotFound() {
  const { setView } = useEscape();
  return <main className="not-found-page page-enter">
    <div className="not-found-art" aria-hidden="true"><Compass size={58} strokeWidth={1.4} /><TinyDoodle type="spark" /></div>
    <div className="eyebrow"><span className="eyebrow-dot" />wrong turn, little wanderer</div>
    <h1>this path isn't on the map.</h1>
    <p>The page you opened doesn't exist. Your saved places, friends, and plans are still safe — head back to Discover and find a break instead.</p>
    <Button onClick={() => setView("discover")}><ArrowLeft size={17} /> back to discover</Button>
  </main>;
}
