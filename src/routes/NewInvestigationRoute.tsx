// NewInvestigationPage does NOT set its own full-screen background — in the
// author's original App.reference-shell.tsx that background lived on the
// OUTER shell div (which also contained a demo-only sidebar, intentionally
// not reused here since it duplicates app-level navigation). The
// className below is copied verbatim from that outer div so the page's
// background/scroll behavior renders identically to the author's demo.
import "../modules/new-investigation/styles/theme.css";
import { NewInvestigationPage } from "../modules/new-investigation";

export default function NewInvestigationRoute() {
  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <main className="overflow-y-auto nx-scrollbar">
        <NewInvestigationPage />
      </main>
    </div>
  );
}
