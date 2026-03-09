import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "..", "themes");

const REQUIRED_STYLE_KEYS = [
  "background",
  "editor.background",
  "editor.foreground",
  "text",
  "border",
  "terminal.ansi.black",
  "terminal.ansi.red",
  "terminal.ansi.green",
  "terminal.ansi.yellow",
  "terminal.ansi.blue",
  "terminal.ansi.magenta",
  "terminal.ansi.cyan",
  "terminal.ansi.white",
] as const;

const REQUIRED_SYNTAX_KEYS = [
  "comment",
  "string",
  "keyword",
  "function",
  "type",
  "number",
  "variable",
] as const;

const COLOR_RE = /^#[0-9a-f]{8}$/;

let errors = 0;
let warnings = 0;

function error(file: string, msg: string): void {
  console.error(`  ERROR ${file}: ${msg}`);
  errors++;
}

function warn(file: string, msg: string): void {
  console.warn(`  WARN  ${file}: ${msg}`);
  warnings++;
}

interface ThemeData {
  name?: string;
  author?: string;
  $schema?: string;
  themes?: Array<{
    name?: string;
    appearance?: string;
    style?: Record<string, unknown>;
  }>;
}

const files = readdirSync(THEMES_DIR).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
  console.error("No theme files found in themes/");
  process.exit(1);
}

for (const file of files) {
  const path = join(THEMES_DIR, file);
  let data: ThemeData;
  try {
    data = JSON.parse(readFileSync(path, "utf-8")) as ThemeData;
  } catch (e) {
    error(file, `Invalid JSON: ${(e as Error).message}`);
    continue;
  }

  if (!data.name) error(file, "Missing top-level 'name'");
  if (!data.author) error(file, "Missing top-level 'author'");
  if (!data.$schema) warn(file, "Missing '$schema'");

  if (!Array.isArray(data.themes) || data.themes.length === 0) {
    error(file, "Missing or empty 'themes' array");
    continue;
  }

  for (const theme of data.themes) {
    const label = `${file}/${theme.name ?? "?"}`;

    if (!theme.name) error(label, "Missing theme 'name'");
    if (!["dark", "light"].includes(theme.appearance ?? ""))
      error(label, `Invalid appearance: '${theme.appearance}'`);

    const style = (theme.style ?? {}) as Record<string, unknown>;

    for (const key of REQUIRED_STYLE_KEYS) {
      if (!style[key]) warn(label, `Missing style key '${key}'`);
    }

    const syntax = (style["syntax"] ?? {}) as Record<string, unknown>;
    for (const key of REQUIRED_SYNTAX_KEYS) {
      if (!syntax[key]) warn(label, `Missing syntax token '${key}'`);
    }

    if (!Array.isArray(style["players"]) || style["players"].length === 0)
      error(label, "Missing or empty 'players' array");

    const allColors: [string, string][] = [];
    function collectColors(obj: Record<string, unknown>, prefix: string): void {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "string" && v.startsWith("#"))
          allColors.push([`${prefix}${k}`, v]);
        else if (v && typeof v === "object" && !Array.isArray(v))
          collectColors(v as Record<string, unknown>, `${prefix}${k}.`);
      }
    }
    collectColors(style, "style.");

    for (const [key, val] of allColors) {
      if (!COLOR_RE.test(val))
        warn(label, `Non-standard color format at '${key}': ${val}`);
    }
  }
}

console.log(
  `\nValidated ${files.length} files: ${errors} errors, ${warnings} warnings`,
);
if (errors > 0) process.exit(1);
