// Tier B: per-theme, empirically-verified syntax overrides for divergences
// that CANNOT be derived mechanically from the VS Code source. Because Zed uses
// Tree-sitter (a flat capture set) while VS Code uses TextMate (hierarchical
// scopes), the "right" color sometimes only matches what the real editor
// renders, not what any single source scope says.
//
// Keyed by output filename -> Zed syntax token -> entry. Each entry MUST cite
// its issue and be confirmed against side-by-side editor rendering. Keep this
// list small and intentional; prefer fixing things generically in
// convert.ts's SCOPE_TO_TOKEN when the source actually supports it. This module
// is the single source of truth: convert.ts applies these and audit.ts expects
// them (so an intentional deviation is not reported as a source mismatch).

export interface SyntaxOverride {
  color?: string;
  background_color?: string;
  font_style?: "italic" | "oblique" | "normal";
  font_weight?: number;
}

export const SYNTAX_OVERRIDES: Record<
  string,
  Record<string, SyntaxOverride>
> = {
  // issue #1: In Dark 2026 (GitHub-style) VS Code renders ordinary variables
  // gray and parameters orange — the opposite of the bare `variable` /
  // `variable.parameter.function` source scopes. Verified via the reporter's
  // side-by-side screenshots. Scoped to this theme only; a global precedence
  // change would regress Dark+/Modern/VS/Solarized, where the bare-scope colors
  // are correct.
  "dark-2026.json": {
    variable: { color: "#c9d1d9ff" },
    "variable.parameter": { color: "#ffa657ff" },
  },
  // issue #1 (by analogy): Light 2026 is the GitHub-Light counterpart with the
  // same scope inversion — bare `variable` (#953800, orange accent) is shown
  // for variables and `variable.parameter.function` (#1f2328, foreground) for
  // parameters. Mirror the Dark 2026 fix: variables -> foreground, parameters
  // -> accent. Applied structurally; not independently screenshot-verified.
  "light-2026.json": {
    variable: { color: "#1f2328ff" },
    "variable.parameter": { color: "#953800ff" },
  },
};
