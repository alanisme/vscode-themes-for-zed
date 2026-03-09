import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "..", "themes");
const VSCODE_REF = process.env["VSCODE_REF"] ?? "1.96.4";
const GITHUB_RAW =
  `https://raw.githubusercontent.com/microsoft/vscode/${VSCODE_REF}/extensions`;
const THEME_SUFFIX = " (VS Code)";

type Appearance = "dark" | "light";

interface ThemeSource {
  family: string;
  appearance: Appearance;
  url: string;
  output: string;
}

interface TokenColorSettings {
  foreground?: string;
  background?: string;
  fontStyle?: string;
}

interface TokenColorRule {
  scope?: string | string[];
  settings: TokenColorSettings;
  name?: string;
}

interface VscodeTheme {
  include?: string;
  colors: Record<string, string>;
  tokenColors: TokenColorRule[];
  semanticHighlighting?: boolean;
  semanticTokenColors: Record<string, string | TokenColorSettings>;
}

interface SyntaxEntry {
  color?: string;
  background_color?: string;
  font_style?: "italic" | "oblique" | "normal";
  font_weight?: number;
}

interface PlayerColor {
  cursor: string;
  background: string | null;
  selection: string | null;
}

interface ZedThemeStyle {
  [key: string]:
    | string
    | null
    | Record<string, SyntaxEntry>
    | PlayerColor[]
    | undefined;
  syntax?: Record<string, SyntaxEntry>;
  players?: PlayerColor[];
}

interface ZedTheme {
  name: string;
  appearance: Appearance;
  style: ZedThemeStyle;
}

interface ZedThemeFamily {
  $schema: string;
  name: string;
  author: string;
  themes: ZedTheme[];
}

const THEME_SOURCES: ThemeSource[] = [
  {
    family: "Abyss",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-abyss/themes/abyss-color-theme.json`,
    output: "abyss.json",
  },
  {
    family: "Dark Modern",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-defaults/themes/dark_modern.json`,
    output: "dark-modern.json",
  },
  {
    family: "Dark+",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-defaults/themes/dark_plus.json`,
    output: "dark-plus.json",
  },
  {
    family: "Visual Studio Dark",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-defaults/themes/dark_vs.json`,
    output: "visual-studio-dark.json",
  },
  {
    family: "Light Modern",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-defaults/themes/light_modern.json`,
    output: "light-modern.json",
  },
  {
    family: "Light+",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-defaults/themes/light_plus.json`,
    output: "light-plus.json",
  },
  {
    family: "Visual Studio Light",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-defaults/themes/light_vs.json`,
    output: "visual-studio-light.json",
  },
  {
    family: "High Contrast Dark",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-defaults/themes/hc_black.json`,
    output: "high-contrast-dark.json",
  },
  {
    family: "High Contrast Light",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-defaults/themes/hc_light.json`,
    output: "high-contrast-light.json",
  },
  {
    family: "Kimbie Dark",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-kimbie-dark/themes/kimbie-dark-color-theme.json`,
    output: "kimbie-dark.json",
  },
  {
    family: "Monokai",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-monokai/themes/monokai-color-theme.json`,
    output: "monokai.json",
  },
  {
    family: "Monokai Dimmed",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-monokai-dimmed/themes/dimmed-monokai-color-theme.json`,
    output: "monokai-dimmed.json",
  },
  {
    family: "Quiet Light",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-quietlight/themes/quietlight-color-theme.json`,
    output: "quiet-light.json",
  },
  {
    family: "Red",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-red/themes/Red-color-theme.json`,
    output: "red.json",
  },
  {
    family: "Solarized Dark",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-solarized-dark/themes/solarized-dark-color-theme.json`,
    output: "solarized-dark.json",
  },
  {
    family: "Solarized Light",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-solarized-light/themes/solarized-light-color-theme.json`,
    output: "solarized-light.json",
  },
  {
    family: "Tomorrow Night Blue",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-tomorrow-night-blue/themes/tomorrow-night-blue-color-theme.json`,
    output: "tomorrow-night-blue.json",
  },
];

const SCOPE_TO_TOKEN: [string[], string][] = [
  [["comment", "comment.line", "comment.block"], "comment"],
  [["comment.block.documentation", "comment.block.javadoc"], "comment.doc"],
  [["string", "string.quoted"], "string"],
  [["string.regexp"], "string.regex"],
  [
    ["constant.character.escape", "constant.character.escape.backslash"],
    "string.escape",
  ],
  [["string.other.link"], "link_text"],
  [["markup.underline.link", "markup.underline.link.markdown"], "link_uri"],
  [
    [
      "constant.numeric",
      "constant.numeric.integer",
      "constant.numeric.float",
      "constant.numeric.hex",
    ],
    "number",
  ],
  [
    [
      "constant.language",
      "constant.language.boolean",
      "constant.language.null",
      "constant.language.undefined",
    ],
    "boolean",
  ],
  [["constant.language"], "constant.builtin"],
  [
    ["constant.character", "constant.other", "constant.other.color"],
    "constant",
  ],
  [["variable", "variable.other", "variable.other.readwrite"], "variable"],
  [
    [
      "variable.language",
      "variable.language.this",
      "variable.language.self",
      "variable.language.super",
    ],
    "variable.special",
  ],
  [["variable.parameter", "variable.parameter.function"], "variable.parameter"],
  [
    [
      "keyword",
      "keyword.control",
      "keyword.control.flow",
      "keyword.control.import",
      "keyword.control.export",
    ],
    "keyword",
  ],
  [
    [
      "keyword.operator",
      "keyword.operator.assignment",
      "keyword.operator.arithmetic",
      "keyword.operator.logical",
    ],
    "operator",
  ],
  [["storage", "storage.modifier"], "keyword"],
  [["storage.type", "storage.type.class", "storage.type.function"], "keyword"],
  [
    [
      "entity.name.type",
      "entity.name.class",
      "entity.name.namespace",
      "entity.name.scope-resolution",
    ],
    "type",
  ],
  [["support.type", "support.class"], "type.builtin"],
  [["entity.name.function", "entity.name.method"], "function"],
  [["support.function"], "function"],
  [["entity.name.tag"], "tag"],
  [["entity.other.attribute-name"], "attribute"],
  [
    [
      "punctuation.definition.template-expression",
      "punctuation.section.embedded",
    ],
    "punctuation.special",
  ],
  [["punctuation.definition.tag"], "punctuation.bracket"],
  [
    ["punctuation.separator", "punctuation.terminator", "punctuation.accessor"],
    "punctuation.delimiter",
  ],
  [["punctuation.definition.list.begin.markdown"], "punctuation.list_marker"],
  [["punctuation"], "punctuation"],
  [["meta.preprocessor", "entity.name.function.preprocessor"], "preproc"],
  [["entity.other.inherited-class"], "type"],
  [["support.constant", "support.variable"], "constant.builtin"],
  [
    [
      "markup.heading",
      "markup.heading.setext",
      "markup.heading.markdown",
      "entity.name.section",
    ],
    "title",
  ],
  [["markup.bold"], "emphasis.strong"],
  [["markup.italic"], "emphasis"],
  [["markup.inline.raw", "markup.fenced_code.block"], "text.literal"],
  [["markup.quote"], "string"],
  [["entity.name.type.enum"], "enum"],
  [
    [
      "variable.other.property",
      "variable.other.object.property",
      "support.type.property-name",
    ],
    "property",
  ],
  [["meta.object-literal.key"], "property"],
  [
    [
      "entity.name.tag.yaml",
      "entity.other.attribute-name.class",
      "entity.other.attribute-name.id",
    ],
    "label",
  ],
  [["constructor", "entity.name.function.constructor"], "constructor"],
];

const SEMANTIC_TOKEN_TO_ZED: Record<string, string> = {
  variable: "variable",
  "variable.readonly": "variable",
  "variable.defaultLibrary": "variable.special",
  parameter: "variable.parameter",
  property: "property",
  "property.readonly": "property",
  function: "function",
  "function.defaultLibrary": "function",
  method: "function",
  type: "type",
  "type.defaultLibrary": "type.builtin",
  class: "type",
  "class.defaultLibrary": "type.builtin",
  interface: "type",
  enum: "enum",
  enumMember: "constant",
  namespace: "type",
  keyword: "keyword",
  operator: "operator",
  comment: "comment",
  string: "string",
  number: "number",
  regexp: "string.regex",
  decorator: "attribute",
  macro: "preproc",
  label: "label",
};

const cache = new Map<string, VscodeTheme>();

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

async function fetchJson(url: string): Promise<VscodeTheme> {
  const cached = cache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const data = JSON.parse(stripJsonc(await res.text())) as VscodeTheme;
  cache.set(url, data);
  return data;
}

function resolveIncludeUrl(baseUrl: string, includePath: string): string {
  return baseUrl.replace(/\/[^/]+$/, "/" + includePath.replace(/^\.\//, ""));
}

async function resolveTheme(url: string, depth = 0): Promise<VscodeTheme> {
  if (depth > 5) throw new Error("Include chain too deep");
  const theme = await fetchJson(url);
  if (!theme.include) return theme;

  const parentUrl = resolveIncludeUrl(url, theme.include);
  const parent = await resolveTheme(parentUrl, depth + 1);

  return {
    colors: { ...parent.colors, ...theme.colors },
    tokenColors: [...(parent.tokenColors ?? []), ...(theme.tokenColors ?? [])],
    semanticHighlighting:
      theme.semanticHighlighting || parent.semanticHighlighting || false,
    semanticTokenColors: {
      ...parent.semanticTokenColors,
      ...theme.semanticTokenColors,
    },
  };
}

function normalizeColor(color: string | undefined | null): string | null {
  if (!color || typeof color !== "string") return null;
  const c = color.trim().toLowerCase();
  if (!c.startsWith("#")) return null;
  if (c.length === 4) {
    const [, r, g, b] = c;
    return `#${r}${r}${g}${g}${b}${b}ff`;
  }
  if (c.length === 5) {
    const [, r, g, b, a] = c;
    return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
  }
  if (c.length === 7) return c + "ff";
  if (c.length === 9) return c;
  return null;
}

function pick(
  colors: Record<string, string>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const val = colors[key];
    if (val) return normalizeColor(val);
  }
  return null;
}

function transparentize(color: string | null, alpha: number): string | null {
  if (!color) return null;
  const hex = normalizeColor(color);
  if (!hex || hex.length < 7) return null;
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return hex.slice(0, 7) + a;
}

function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let ro: number, go: number, bo: number;
  switch (i % 6) {
    case 0:
      ro = v;
      go = t;
      bo = p;
      break;
    case 1:
      ro = q;
      go = v;
      bo = p;
      break;
    case 2:
      ro = p;
      go = v;
      bo = t;
      break;
    case 3:
      ro = p;
      go = q;
      bo = v;
      break;
    case 4:
      ro = t;
      go = p;
      bo = v;
      break;
    default:
      ro = v;
      go = p;
      bo = q;
      break;
  }
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(ro)}${toHex(go)}${toHex(bo)}ff`;
}

function rgbToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h, s, v];
}

function shiftHue(hexColor: string, degrees: number): string {
  const hex = normalizeColor(hexColor);
  if (!hex) return hexColor;
  let [h, s, v] = rgbToHsv(hex);
  if (s < 0.08) {
    s = 0.6;
    v = Math.max(v, 0.5);
  }
  h = (h + degrees / 360) % 1;
  if (h < 0) h += 1;
  return hsvToHex(h, s, v);
}

function derivePlayerColors(
  cursorColor: string,
  selectionBg: string | null,
): PlayerColor[] {
  const players: PlayerColor[] = [
    {
      cursor: cursorColor,
      background: transparentize(cursorColor, 0.15),
      selection: selectionBg,
    },
  ];
  for (let i = 1; i <= 7; i++) {
    const color = shiftHue(cursorColor, i * 45);
    players.push({
      cursor: color,
      background: transparentize(color, 0.15),
      selection: transparentize(color, 0.3),
    });
  }
  return players;
}

function prefixMatch(
  scopeMap: Map<string, TokenColorSettings>,
  query: string,
): TokenColorSettings | null {
  const exact = scopeMap.get(query);
  if (exact) return exact;
  let best: TokenColorSettings | null = null;
  let bestLen = 0;
  for (const [scope, settings] of scopeMap) {
    if (query.startsWith(scope + ".") && scope.length > bestLen) {
      best = settings;
      bestLen = scope.length;
    }
    if (scope.startsWith(query + ".") && query.length > bestLen) {
      best = settings;
      bestLen = query.length;
    }
  }
  return best;
}

function mapTokenColors(
  tokenColors: TokenColorRule[],
  semanticTokenColors: Record<string, string | TokenColorSettings>,
): Record<string, SyntaxEntry> {
  const scopeMap = new Map<string, TokenColorSettings>();
  for (const rule of tokenColors) {
    if (!rule.scope || !rule.settings) continue;
    const scopes = Array.isArray(rule.scope)
      ? rule.scope
      : rule.scope.split(/\s*,\s*/);
    for (const scope of scopes) {
      scopeMap.set(scope.trim(), rule.settings);
    }
  }

  const defaultSettings = tokenColors.find((r) => !r.scope && r.settings);
  const syntax: Record<string, SyntaxEntry> = {};

  for (const [scopes, token] of SCOPE_TO_TOKEN) {
    if (syntax[token]) continue;
    let settings: TokenColorSettings | null = null;
    for (const scope of scopes) {
      settings = prefixMatch(scopeMap, scope);
      if (settings) break;
    }
    if (!settings) continue;
    const entry: SyntaxEntry = {};
    if (settings.foreground)
      entry.color = normalizeColor(settings.foreground) ?? undefined;
    if (settings.background)
      entry.background_color = normalizeColor(settings.background) ?? undefined;
    if (settings.fontStyle != null) {
      const fs = settings.fontStyle.toLowerCase();
      if (fs.includes("italic")) entry.font_style = "italic";
      else if (fs.includes("oblique")) entry.font_style = "oblique";
      if (fs.includes("bold")) entry.font_weight = 700;
    }
    if (Object.keys(entry).length > 0) syntax[token] = entry;
  }

  const resolvedSemantic = new Map<string, string | TokenColorSettings>();
  const semanticEntries = Object.entries(semanticTokenColors);
  semanticEntries.sort((a, b) => {
    const aHasLang = a[0].includes(":");
    const bHasLang = b[0].includes(":");
    if (!aHasLang && bHasLang) return -1;
    if (aHasLang && !bHasLang) return 1;
    return a[0].length - b[0].length;
  });
  for (const [rawKey, value] of semanticEntries) {
    const baseKey = rawKey.split(":")[0]!;
    if (!resolvedSemantic.has(baseKey)) {
      resolvedSemantic.set(baseKey, value);
    }
  }

  for (const [semToken, zedToken] of Object.entries(SEMANTIC_TOKEN_TO_ZED)) {
    if (syntax[zedToken]) continue;
    const semValue = resolvedSemantic.get(semToken);
    if (!semValue) continue;
    if (typeof semValue === "string") {
      const color = normalizeColor(semValue);
      if (color) syntax[zedToken] = { color };
    } else if (semValue.foreground) {
      const entry: SyntaxEntry = {};
      entry.color = normalizeColor(semValue.foreground) ?? undefined;
      if (semValue.fontStyle) {
        const fs = semValue.fontStyle.toLowerCase();
        if (fs.includes("italic")) entry.font_style = "italic";
        if (fs.includes("bold")) entry.font_weight = 700;
      }
      if (Object.keys(entry).length > 0) syntax[zedToken] = entry;
    }
  }

  for (const [rawKey, value] of resolvedSemantic) {
    const dotIdx = rawKey.indexOf(".");
    const baseType = dotIdx >= 0 ? rawKey.slice(0, dotIdx) : rawKey;
    const zedToken = SEMANTIC_TOKEN_TO_ZED[baseType];
    if (!zedToken || syntax[zedToken]) continue;
    if (typeof value === "string") {
      const color = normalizeColor(value);
      if (color) syntax[zedToken] = { color };
    } else if (value.foreground) {
      const entry: SyntaxEntry = {};
      entry.color = normalizeColor(value.foreground) ?? undefined;
      if (value.fontStyle) {
        const fs = value.fontStyle.toLowerCase();
        if (fs.includes("italic")) entry.font_style = "italic";
        if (fs.includes("bold")) entry.font_weight = 700;
      }
      if (Object.keys(entry).length > 0) syntax[zedToken] = entry;
    }
  }

  if (defaultSettings?.settings?.foreground && !syntax["primary"]) {
    syntax["primary"] = {
      color: normalizeColor(defaultSettings.settings.foreground) ?? undefined,
    };
  }

  return syntax;
}

function convertTheme(
  vscodeTheme: VscodeTheme,
  familyName: string,
  appearance: Appearance,
): ZedTheme {
  const colors = vscodeTheme.colors ?? {};
  const tokenColors = vscodeTheme.tokenColors ?? [];
  const semanticTokenColors = vscodeTheme.semanticHighlighting
    ? (vscodeTheme.semanticTokenColors ?? {})
    : {};

  const editorBg =
    pick(colors, "editor.background") ??
    (appearance === "dark" ? "#1e1e1eff" : "#ffffffff");
  const editorFg =
    pick(colors, "editor.foreground") ??
    (appearance === "dark" ? "#d4d4d4ff" : "#333333ff");
  const fg = pick(colors, "foreground") ?? editorFg;
  const border =
    pick(colors, "panel.border", "editorGroup.border") ??
    (appearance === "dark" ? "#444444ff" : "#e5e5e5ff");
  const focusBorder = pick(colors, "focusBorder") ?? border;
  const mutedFg =
    pick(colors, "tab.inactiveForeground") ?? transparentize(fg, 0.6);
  const panelBg =
    pick(colors, "panel.background", "sideBar.background") ?? editorBg;
  const dropdownBg =
    pick(colors, "dropdown.background", "editorWidget.background") ?? panelBg;
  const buttonBg =
    pick(colors, "button.background") ??
    (appearance === "dark" ? "#0e639cff" : "#007accff");
  const hoverBg =
    pick(colors, "list.hoverBackground") ?? transparentize(editorFg, 0.05);
  const selectedBg =
    pick(colors, "list.activeSelectionBackground") ??
    (appearance === "dark" ? "#094771ff" : "#0060c0ff");
  const dropBg =
    pick(colors, "list.dropBackground") ?? transparentize(selectedBg, 0.4);
  const statusBg = pick(colors, "statusBar.background") ?? panelBg;
  const titleBg = pick(colors, "titleBar.activeBackground") ?? panelBg;
  const toolbarBg = pick(colors, "breadcrumb.background") ?? editorBg;
  const tabBarBg = pick(colors, "editorGroupHeader.tabsBackground") ?? panelBg;
  const tabInactiveBg = pick(colors, "tab.inactiveBackground") ?? tabBarBg;
  const tabActiveBg = pick(colors, "tab.activeBackground") ?? editorBg;
  const searchMatchBg =
    pick(
      colors,
      "editor.findMatchBackground",
      "editor.findMatchHighlightBackground",
    ) ?? transparentize(editorFg, 0.2);
  const paneGroupBorder = pick(colors, "editorGroup.border") ?? border;
  const scrollbarBg =
    pick(colors, "scrollbarSlider.background") ??
    transparentize(editorFg, 0.15);
  const scrollbarHover =
    pick(colors, "scrollbarSlider.hoverBackground") ??
    transparentize(editorFg, 0.25);
  const lineHighlight =
    pick(colors, "editor.lineHighlightBackground") ??
    transparentize(editorFg, 0.04);
  const lineNumber =
    pick(colors, "editorLineNumber.foreground") ??
    transparentize(editorFg, 0.4);
  const activeLineNumber =
    pick(colors, "editorLineNumber.activeForeground") ?? editorFg;
  const bracketBg =
    pick(colors, "editorBracketMatch.background") ??
    transparentize(editorFg, 0.1);
  const linkHover = pick(
    colors,
    "textLink.activeForeground",
    "textLink.foreground",
    "editorLink.activeForeground",
  );
  const indentGuide =
    pick(colors, "editorIndentGuide.background") ??
    transparentize(editorFg, 0.1);
  const indentGuideActive =
    pick(colors, "editorIndentGuide.activeBackground") ??
    transparentize(editorFg, 0.3);
  const whitespace =
    pick(colors, "editorWhitespace.foreground") ??
    transparentize(editorFg, 0.15);
  const cursorColor = pick(colors, "editorCursor.foreground") ?? editorFg;
  const selectionBg =
    pick(colors, "editor.selectionBackground") ?? transparentize(editorFg, 0.2);

  const isDark = appearance === "dark";
  const docHighlightRead =
    pick(
      colors,
      "editor.wordHighlightBackground",
      "editor.selectionHighlightBackground",
    ) ?? transparentize(isDark ? "#ffffff" : "#000000", isDark ? 0.15 : 0.1);
  const docHighlightWrite =
    pick(colors, "editor.wordHighlightStrongBackground") ??
    transparentize(isDark ? "#ffffff" : "#000000", isDark ? 0.2 : 0.15);

  const errorFg = pick(colors, "editorError.foreground") ?? "#f44747ff";
  const warningFg = pick(colors, "editorWarning.foreground") ?? "#cca700ff";
  const infoFg = pick(colors, "editorInfo.foreground") ?? "#3794ffff";
  const hintFg = pick(colors, "editorInlayHint.foreground") ?? "#969696ff";
  const successFg = pick(colors, "testing.iconPassed") ?? "#73c991ff";
  const conflictFg =
    pick(colors, "gitDecoration.conflictingResourceForeground") ?? "#e4676bff";
  const createdFg =
    pick(
      colors,
      "editorGutter.addedBackground",
      "gitDecoration.addedResourceForeground",
    ) ?? "#587c0cff";
  const deletedFg =
    pick(
      colors,
      "editorGutter.deletedBackground",
      "gitDecoration.deletedResourceForeground",
    ) ?? "#94151bff";
  const modifiedFg =
    pick(
      colors,
      "editorGutter.modifiedBackground",
      "gitDecoration.modifiedResourceForeground",
    ) ?? "#0c7d9dff";
  const ignoredFg =
    pick(colors, "gitDecoration.ignoredResourceForeground") ?? mutedFg;
  const renamedFg =
    pick(colors, "gitDecoration.renamedResourceForeground") ?? "#73c991ff";

  const style: Record<string, unknown> = {
    background: editorBg,
    "elevated_surface.background": dropdownBg,
    "surface.background": panelBg,
    "panel.background": panelBg,
    border,
    "border.variant": border,
    "border.focused": focusBorder,
    "border.selected": border,
    "border.transparent": transparentize(border, 0),
    "border.disabled": transparentize(border, 0.5),
    "pane_group.border": paneGroupBorder,
    "editor.background": editorBg,
    "editor.foreground": editorFg,
    "editor.gutter.background": editorBg,
    "editor.active_line.background": lineHighlight,
    "editor.active_line_number": activeLineNumber,
    "editor.line_number": lineNumber,
    "editor.indent_guide": indentGuide,
    "editor.indent_guide_active": indentGuideActive,
    "editor.invisible": whitespace,
    "editor.wrap_guide": border,
    "editor.active_wrap_guide": border,
    "editor.document_highlight.read_background": docHighlightRead,
    "editor.document_highlight.write_background": docHighlightWrite,
    "editor.document_highlight.bracket_background": bracketBg,
    "tab_bar.background": tabBarBg,
    "tab.active_background": tabActiveBg,
    "tab.inactive_background": tabInactiveBg,
    "status_bar.background": statusBg,
    "title_bar.background": titleBg,
    "toolbar.background": toolbarBg,
    "drop_target.background": dropBg,
    "search.match_background": searchMatchBg,
    "element.background": transparentize(buttonBg, 0.15),
    "element.hover": hoverBg,
    "element.active": transparentize(selectedBg, 0.8),
    "element.selected": selectedBg,
    "element.disabled": transparentize(editorFg, 0.05),
    "ghost_element.background": "#00000000",
    "ghost_element.hover": hoverBg,
    "ghost_element.active": transparentize(selectedBg, 0.6),
    "ghost_element.selected": transparentize(selectedBg, 0.5),
    "ghost_element.disabled": transparentize(editorFg, 0.05),
    text: fg,
    "text.muted": mutedFg,
    "text.placeholder": transparentize(fg, 0.4),
    "text.disabled": transparentize(fg, 0.3),
    "text.accent": pick(colors, "textLink.foreground") ?? buttonBg,
    icon: fg,
    "icon.muted": mutedFg,
    "icon.disabled": transparentize(fg, 0.3),
    "icon.placeholder": transparentize(fg, 0.4),
    "icon.accent": pick(colors, "textLink.foreground") ?? buttonBg,
    "scrollbar.thumb.background": scrollbarBg,
    "scrollbar.thumb.hover_background": scrollbarHover,
    "scrollbar.thumb.border": scrollbarBg,
    "scrollbar.track.background": editorBg,
    "scrollbar.track.border": editorBg,
    error: errorFg,
    "error.background":
      pick(colors, "editorError.background") ?? transparentize(errorFg, 0.1),
    "error.border": pick(colors, "editorError.border") ?? "#00000000",
    warning: warningFg,
    "warning.background":
      pick(colors, "editorWarning.background") ??
      transparentize(warningFg, 0.1),
    "warning.border": pick(colors, "editorWarning.border") ?? "#00000000",
    info: infoFg,
    "info.background":
      pick(colors, "editorInfo.background") ?? transparentize(infoFg, 0.1),
    "info.border": pick(colors, "editorInfo.border") ?? "#00000000",
    hint: hintFg,
    "hint.background": transparentize(hintFg, 0.1),
    "hint.border": pick(colors, "editorHint.border") ?? "#00000000",
    success: successFg,
    "success.background": transparentize(successFg, 0.1),
    "success.border": "#00000000",
    conflict: conflictFg,
    "conflict.background": transparentize(conflictFg, 0.1),
    "conflict.border": "#00000000",
    created: createdFg,
    "created.background": transparentize(createdFg, 0.1),
    "created.border": "#00000000",
    deleted: deletedFg,
    "deleted.background": transparentize(deletedFg, 0.1),
    "deleted.border": "#00000000",
    modified: modifiedFg,
    "modified.background": transparentize(modifiedFg, 0.1),
    "modified.border": "#00000000",
    renamed: renamedFg,
    "renamed.background": transparentize(renamedFg, 0.1),
    "renamed.border": "#00000000",
    ignored: ignoredFg,
    "ignored.background": transparentize(ignoredFg, 0.1),
    "ignored.border": "#00000000",
    hidden: transparentize(fg, 0.2),
    "hidden.background": transparentize(fg, 0.02),
    "hidden.border": "#00000000",
    predictive: transparentize(fg, 0.3),
    "predictive.background": "#00000000",
    "predictive.border": "#00000000",
    "terminal.background": pick(colors, "terminal.background") ?? editorBg,
    "terminal.foreground": pick(colors, "terminal.foreground") ?? editorFg,
    "terminal.bright_foreground":
      pick(colors, "terminal.foreground") ?? editorFg,
    "terminal.dim_foreground": transparentize(
      pick(colors, "terminal.foreground") ?? editorFg,
      0.5,
    ),
    "terminal.ansi.black": pick(colors, "terminal.ansiBlack") ?? "#000000ff",
    "terminal.ansi.red": pick(colors, "terminal.ansiRed") ?? "#cd3131ff",
    "terminal.ansi.green": pick(colors, "terminal.ansiGreen") ?? "#0dbc79ff",
    "terminal.ansi.yellow": pick(colors, "terminal.ansiYellow") ?? "#e5e510ff",
    "terminal.ansi.blue": pick(colors, "terminal.ansiBlue") ?? "#2472c8ff",
    "terminal.ansi.magenta":
      pick(colors, "terminal.ansiMagenta") ?? "#bc3fbcff",
    "terminal.ansi.cyan": pick(colors, "terminal.ansiCyan") ?? "#11a8cdff",
    "terminal.ansi.white": pick(colors, "terminal.ansiWhite") ?? "#e5e5e5ff",
    "terminal.ansi.bright_black":
      pick(colors, "terminal.ansiBrightBlack") ?? "#666666ff",
    "terminal.ansi.bright_red":
      pick(colors, "terminal.ansiBrightRed") ?? "#f14c4cff",
    "terminal.ansi.bright_green":
      pick(colors, "terminal.ansiBrightGreen") ?? "#23d18bff",
    "terminal.ansi.bright_yellow":
      pick(colors, "terminal.ansiBrightYellow") ?? "#f5f543ff",
    "terminal.ansi.bright_blue":
      pick(colors, "terminal.ansiBrightBlue") ?? "#3b8eeaff",
    "terminal.ansi.bright_magenta":
      pick(colors, "terminal.ansiBrightMagenta") ?? "#d670d6ff",
    "terminal.ansi.bright_cyan":
      pick(colors, "terminal.ansiBrightCyan") ?? "#29b8dbff",
    "terminal.ansi.bright_white":
      pick(colors, "terminal.ansiBrightWhite") ?? "#e5e5e5ff",
    "link_text.hover": linkHover ?? buttonBg,
    syntax: mapTokenColors(tokenColors, semanticTokenColors),
    players: derivePlayerColors(cursorColor, selectionBg),
  };

  for (const [key, val] of Object.entries(style)) {
    if (val === null || val === undefined) delete style[key];
  }

  return { name: familyName, appearance, style: style as ZedThemeStyle };
}

function cleanNulls(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(cleanNulls);
  if (obj && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const val = cleanNulls(v);
      if (val !== null && val !== undefined) cleaned[k] = val;
    }
    return cleaned;
  }
  return obj;
}

async function main(): Promise<void> {
  mkdirSync(THEMES_DIR, { recursive: true });
  let count = 0;

  for (const source of THEME_SOURCES) {
    process.stdout.write(`Converting ${source.family}...`);
    try {
      const vscodeTheme = await resolveTheme(source.url);
      const displayName = source.family + THEME_SUFFIX;
      const zedTheme = convertTheme(
        vscodeTheme,
        displayName,
        source.appearance,
      );

      const family = cleanNulls({
        $schema: "https://zed.dev/schema/themes/v0.2.0.json",
        name: displayName,
        author: "Alan",
        themes: [zedTheme],
      }) as ZedThemeFamily;

      const outputPath = join(THEMES_DIR, source.output);
      writeFileSync(outputPath, JSON.stringify(family, null, 2) + "\n");
      console.log(" done");
      count++;
    } catch (err) {
      console.error(` FAILED: ${(err as Error).message}`);
    }
  }

  console.log(`\nConverted ${count}/${THEME_SOURCES.length} themes.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
