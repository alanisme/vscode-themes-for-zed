export type Appearance = "dark" | "light";

export interface ThemeSource {
  family: string;
  appearance: Appearance;
  url: string;
  output: string;
}

export const VSCODE_REF = process.env.VSCODE_REF ?? "1.114.0";
const GITHUB_RAW = `https://raw.githubusercontent.com/microsoft/vscode/${VSCODE_REF}/extensions`;

export const THEME_SOURCES: ThemeSource[] = [
  {
    family: "Abyss",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-abyss/themes/abyss-color-theme.json`,
    output: "abyss.json",
  },
  {
    family: "Dark 2026",
    appearance: "dark",
    url: `${GITHUB_RAW}/theme-defaults/themes/2026-dark.json`,
    output: "dark-2026.json",
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
    family: "Light 2026",
    appearance: "light",
    url: `${GITHUB_RAW}/theme-defaults/themes/2026-light.json`,
    output: "light-2026.json",
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
