import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_SOURCES } from "./sources.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "..", "themes");

interface VscodeTheme {
  include?: string;
  colors?: Record<string, string>;
  tokenColors?: Array<{
    scope?: string | string[];
    settings?: { foreground?: string; fontStyle?: string };
  }>;
  semanticHighlighting?: boolean;
  semanticTokenColors?: Record<string, unknown>;
}

function stripJsonc(text: string): string {
  let result = "";
  let i = 0;
  let inString = false;
  while (i < text.length) {
    const ch = text[i]!;
    const next = text[i + 1];
    if (inString) {
      if (ch === "\\" && next !== undefined) {
        result += ch + next;
        i += 2;
        continue;
      }
      if (ch === '"') inString = false;
      result += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inString = true;
      result += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i + 1 < text.length && !(text[i] === "*" && text[i + 1] === "/"))
        i++;
      if (i + 1 < text.length) i += 2;
      continue;
    }
    result += ch;
    i++;
  }
  return result.replace(/,(\s*[}\]])/g, "$1");
}

const cache = new Map<string, VscodeTheme>();
async function fetchJson(url: string): Promise<VscodeTheme> {
  const c = cache.get(url);
  if (c) return c;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const data = JSON.parse(stripJsonc(await res.text())) as VscodeTheme;
  cache.set(url, data);
  return data;
}

function resolveIncludeUrl(baseUrl: string, includePath: string): string {
  return new URL(includePath, baseUrl).toString();
}

async function resolveTheme(url: string, depth = 0): Promise<VscodeTheme> {
  if (depth > 5) throw new Error("depth");
  const t = await fetchJson(url);
  if (!t.include) return t;
  const p = await resolveTheme(resolveIncludeUrl(url, t.include), depth + 1);
  return {
    colors: { ...p.colors, ...t.colors },
    tokenColors: [...(p.tokenColors ?? []), ...(t.tokenColors ?? [])],
    semanticTokenColors: {
      ...p.semanticTokenColors,
      ...t.semanticTokenColors,
    },
  };
}

function norm(c: string | undefined | null): string | null {
  if (!c) return null;
  const s = c.trim().toLowerCase();
  if (!s.startsWith("#")) return null;
  if (s.length === 4) {
    const [, r, g, b] = s;
    return `#${r}${r}${g}${g}${b}${b}ff`;
  }
  if (s.length === 5) {
    const [, r, g, b, a] = s;
    return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
  }
  if (s.length === 7) return `${s}ff`;
  if (s.length === 9) return s;
  return null;
}

function findScopeColor(
  tokenColors: VscodeTheme["tokenColors"],
  targetScope: string,
): string | null {
  if (!tokenColors) return null;
  for (let i = tokenColors.length - 1; i >= 0; i--) {
    const r = tokenColors[i]!;
    if (!r.scope || !r.settings?.foreground) continue;
    const scopes = Array.isArray(r.scope) ? r.scope : r.scope.split(/\s*,\s*/);
    for (const s of scopes) {
      if (s.trim() === targetScope) return norm(r.settings.foreground);
    }
  }
  return null;
}

interface Mismatch {
  theme: string;
  key: string;
  source: string | null;
  output: string | null;
  note?: string;
}

async function main(): Promise<void> {
  const mismatches: Mismatch[] = [];
  const report: string[] = [];
  let assertions = 0;

  for (const source of THEME_SOURCES) {
    const outPath = join(THEMES_DIR, source.output);
    const zedFile = JSON.parse(readFileSync(outPath, "utf-8")) as {
      themes: Array<{ style: Record<string, unknown>; appearance: string }>;
    };
    const style = zedFile.themes[0]!.style;
    const zedAppearance = zedFile.themes[0]!.appearance;

    process.stdout.write(`Auditing ${source.family}... `);
    let vtheme: VscodeTheme;
    try {
      vtheme = await resolveTheme(source.url);
    } catch (e) {
      console.log(`FETCH FAILED: ${(e as Error).message}`);
      continue;
    }

    // Appearance check
    assertions++;
    if (zedAppearance !== source.appearance) {
      mismatches.push({
        theme: source.family,
        key: "appearance",
        source: source.appearance,
        output: zedAppearance,
      });
    }

    // UI color checks — direct 1:1 mappings (primary pick target only)
    const uiChecks: [string, string][] = [
      // core editor + text
      ["editor.background", "editor.background"],
      ["editor.foreground", "editor.foreground"],
      ["foreground", "text"],

      // panels + tabs
      ["panel.background", "panel.background"],
      ["panel.background", "surface.background"],
      ["statusBar.background", "status_bar.background"],
      ["titleBar.activeBackground", "title_bar.background"],
      ["titleBar.inactiveBackground", "title_bar.inactive_background"],
      ["breadcrumb.background", "toolbar.background"],
      ["tab.activeBackground", "tab.active_background"],
      ["tab.inactiveBackground", "tab.inactive_background"],
      ["editorGroupHeader.tabsBackground", "tab_bar.background"],

      // borders
      ["focusBorder", "border.focused"],
      ["focusBorder", "pane.focused_border"],
      ["focusBorder", "panel.focused_border"],
      ["editorGroup.border", "pane_group.border"],

      // gutter + line numbers
      ["editorLineNumber.foreground", "editor.line_number"],
      ["editorLineNumber.activeForeground", "editor.active_line_number"],
      ["editorLineNumber.activeForeground", "editor.hover_line_number"],
      ["editor.lineHighlightBackground", "editor.active_line.background"],
      ["editor.lineHighlightBackground", "editor.highlighted_line.background"],
      ["editorIndentGuide.background", "editor.indent_guide"],
      ["editorIndentGuide.background", "panel.indent_guide"],
      ["editorIndentGuide.activeBackground", "editor.indent_guide_active"],
      ["editorIndentGuide.activeBackground", "panel.indent_guide_active"],
      ["editorIndentGuide.activeBackground", "panel.indent_guide_hover"],
      ["editorWhitespace.foreground", "editor.invisible"],
      [
        "editorBracketMatch.background",
        "editor.document_highlight.bracket_background",
      ],
      [
        "editor.wordHighlightStrongBackground",
        "editor.document_highlight.write_background",
      ],

      // search
      ["editor.findMatchBackground", "search.active_match_background"],

      // diagnostics
      ["editorError.foreground", "error"],
      ["editorError.background", "error.background"],
      ["editorError.border", "error.border"],
      ["editorWarning.foreground", "warning"],
      ["editorWarning.background", "warning.background"],
      ["editorWarning.border", "warning.border"],
      ["editorInfo.foreground", "info"],
      ["editorInfo.background", "info.background"],
      ["editorInfo.border", "info.border"],
      ["editorInlayHint.foreground", "hint"],
      ["editorHint.border", "hint.border"],
      ["testing.iconPassed", "success"],

      // git
      ["gitDecoration.conflictingResourceForeground", "conflict"],
      ["gitDecoration.ignoredResourceForeground", "ignored"],
      ["gitDecoration.renamedResourceForeground", "renamed"],
      ["gitDecoration.addedResourceForeground", "created"],
      ["gitDecoration.modifiedResourceForeground", "modified"],
      ["gitDecoration.deletedResourceForeground", "deleted"],
      ["gitDecoration.addedResourceForeground", "version_control.added"],
      ["gitDecoration.modifiedResourceForeground", "version_control.modified"],
      ["gitDecoration.deletedResourceForeground", "version_control.deleted"],
      ["diffEditor.insertedTextBackground", "version_control.word_added"],
      ["diffEditor.removedTextBackground", "version_control.word_deleted"],

      // scrollbar
      ["scrollbarSlider.background", "scrollbar.thumb.background"],
      ["scrollbarSlider.background", "scrollbar.thumb.border"],
      ["scrollbarSlider.hoverBackground", "scrollbar.thumb.hover_background"],

      // accents
      ["textLink.foreground", "text.accent"],
      ["textLink.foreground", "icon.accent"],

      // terminal (non-ansi)
      ["terminal.background", "terminal.background"],
      ["terminal.background", "terminal.ansi.background"],
      ["terminal.foreground", "terminal.foreground"],
      ["terminal.foreground", "terminal.bright_foreground"],
    ];
    for (const [vk, zk] of uiChecks) {
      if (!zk) continue;
      const src = norm(vtheme.colors?.[vk]);
      const out = style[zk] as string | undefined;
      if (src && out) {
        assertions++;
        if (src !== out) {
          mismatches.push({
            theme: source.family,
            key: zk,
            source: src,
            output: out,
            note: `source key ${vk}`,
          });
        }
      }
    }

    // Terminal ANSI — full 16-color set (normal + bright)
    const ansiMap: [string, string][] = [
      ["terminal.ansiBlack", "terminal.ansi.black"],
      ["terminal.ansiRed", "terminal.ansi.red"],
      ["terminal.ansiGreen", "terminal.ansi.green"],
      ["terminal.ansiYellow", "terminal.ansi.yellow"],
      ["terminal.ansiBlue", "terminal.ansi.blue"],
      ["terminal.ansiMagenta", "terminal.ansi.magenta"],
      ["terminal.ansiCyan", "terminal.ansi.cyan"],
      ["terminal.ansiWhite", "terminal.ansi.white"],
      ["terminal.ansiBrightBlack", "terminal.ansi.bright_black"],
      ["terminal.ansiBrightRed", "terminal.ansi.bright_red"],
      ["terminal.ansiBrightGreen", "terminal.ansi.bright_green"],
      ["terminal.ansiBrightYellow", "terminal.ansi.bright_yellow"],
      ["terminal.ansiBrightBlue", "terminal.ansi.bright_blue"],
      ["terminal.ansiBrightMagenta", "terminal.ansi.bright_magenta"],
      ["terminal.ansiBrightCyan", "terminal.ansi.bright_cyan"],
      ["terminal.ansiBrightWhite", "terminal.ansi.bright_white"],
    ];
    for (const [vk, zk] of ansiMap) {
      const src = norm(vtheme.colors?.[vk]);
      const out = style[zk] as string | undefined;
      if (src && out) {
        assertions++;
        if (src !== out) {
          mismatches.push({
            theme: source.family,
            key: zk,
            source: src,
            output: out,
          });
        }
      }
    }

    // Syntax — trace signature scopes to output tokens
    const syntax = (style.syntax as Record<string, { color?: string }>) ?? {};
    const syntaxChecks: [string, string][] = [
      ["comment", "comment"],
      ["string", "string"],
      ["keyword", "keyword"],
      ["variable", "variable"],
      ["entity.name.function", "function"],
      ["entity.name.tag", "tag"],
      ["entity.name.type", "type"],
      ["constant.numeric", "number"],
      ["string.regexp", "string.regex"],
      ["variable.parameter", "variable.parameter"],
      ["entity.other.attribute-name", "attribute"],
      ["entity.name.namespace", "namespace"],
      ["entity.name.tag.css", "selector"],
    ];
    for (const [scope, tok] of syntaxChecks) {
      const src = findScopeColor(vtheme.tokenColors, scope);
      const out = syntax[tok]?.color;
      if (src && out) {
        assertions++;
        if (src !== out) {
          mismatches.push({
            theme: source.family,
            key: `syntax.${tok}`,
            source: src,
            output: out,
            note: `source scope '${scope}' → expected ${src}, got ${out}`,
          });
        }
      }
    }

    console.log("ok");
    report.push(source.family);
  }

  console.log(
    `\n=== Audit of ${report.length} themes (${assertions} assertions) ===\n`,
  );
  if (mismatches.length === 0) {
    console.log("ALL CLEAR: every checked color matches VS Code source.\n");
    return;
  }

  console.log(`Found ${mismatches.length} mismatch(es):\n`);
  for (const m of mismatches) {
    console.log(
      `  ${m.theme} :: ${m.key}  source=${m.source}  output=${m.output}${
        m.note ? `  (${m.note})` : ""
      }`,
    );
  }
  process.exit(1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
