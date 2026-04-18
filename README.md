# VS Code Classics for Zed

**All 19 built-in Visual Studio Code themes, ported to Zed.**

Translations: [简体中文](docs/README.zh-CN.md) | [Español](docs/README.es.md) | [Français](docs/README.fr.md) | [日本語](docs/README.ja.md)

---

Miss your favorite VS Code look? This extension brings every built-in VS Code color theme to Zed — UI colors, syntax highlighting, and terminal palettes converted directly from the VS Code source. Zed uses Tree-sitter instead of TextMate for syntax, so some tokens may render slightly differently, but the overall look and feel stays close to the original.

## Themes

### Dark

| Theme | Based on |
|-------|----------|
| **Dark 2026 (VS Code)** | VS Code default dark theme (2026 refresh) |
| **Dark Modern (VS Code)** | VS Code default dark theme (2023+) |
| **Dark+ (VS Code)** | VS Code classic dark theme |
| **Visual Studio Dark (VS Code)** | The original VS dark base |
| **Monokai (VS Code)** | The iconic Monokai palette |
| **Monokai Dimmed (VS Code)** | Monokai with softer tones |
| **Abyss (VS Code)** | Deep blue, high contrast |
| **Kimbie Dark (VS Code)** | Warm earthy tones |
| **Red (VS Code)** | Bold red accent |
| **Solarized Dark (VS Code)** | Ethan Schoonover's dark palette |
| **Tomorrow Night Blue (VS Code)** | Deep blue background |
| **High Contrast Dark (VS Code)** | Accessibility-first dark |

### Light

| Theme | Based on |
|-------|----------|
| **Light 2026 (VS Code)** | VS Code default light theme (2026 refresh) |
| **Light Modern (VS Code)** | VS Code default light theme (2023+) |
| **Light+ (VS Code)** | VS Code classic light theme |
| **Visual Studio Light (VS Code)** | The original VS light base |
| **Quiet Light (VS Code)** | Soft, easy on the eyes |
| **Solarized Light (VS Code)** | Ethan Schoonover's light palette |
| **High Contrast Light (VS Code)** | Accessibility-first light |

## Installation

### From Zed Extensions

1. Open Zed
2. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Search for **"Extensions"**
4. Search for **"VS Code Classics"**
5. Click **Install**

### Manual Installation

Clone this repository into your Zed extensions directory:

**macOS / Linux:**

```sh
git clone https://github.com/alanisme/vscode-themes-for-zed \
  ~/.local/share/zed/extensions/vscode-classics
```

**Windows:**

```powershell
git clone https://github.com/alanisme/vscode-themes-for-zed `
  "$env:APPDATA\Zed\extensions\vscode-classics"
```

Then restart Zed or run **"zed: reload extensions"** from the command palette.

### Activating a Theme

1. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search for **"theme"**
3. Pick any theme from the list

Or add it directly to your `settings.json`:

```json
{
  "theme": {
    "mode": "system",
    "light": "Light Modern (VS Code)",
    "dark": "Dark Modern (VS Code)"
  }
}
```

## How It Works

Themes are converted from the [VS Code source repository](https://github.com/microsoft/vscode) (default: `1.96.4`, configurable via `VSCODE_REF`) using an automated pipeline:

- Fetches original JSONC theme files from `microsoft/vscode` at the pinned version
- Recursively resolves the `include` chain (e.g., Dark Modern → Dark+ → VS Dark)
- Maps VS Code workbench colors to Zed UI tokens (curated subset — Zed has ~100 tokens vs VS Code's 500+)
- Translates TextMate scopes to Tree-sitter syntax tokens using prefix matching
- Applies VS Code semantic token colors as fallback for tokens not covered by TextMate rules
- Preserves font styles (italic, bold) and terminal ANSI palettes

**Known limitations:**

- Zed uses Tree-sitter, not TextMate — some syntax tokens map differently or lack a direct equivalent
- VS Code has ~500 workbench color keys; Zed has ~100. Not every UI detail can be represented
- Semantic highlighting coverage depends on what each theme defines

To re-generate themes (uses pinned version by default):

```sh
make

# or track latest VS Code source:
VSCODE_REF=main make
```

## Project Structure

```
vscode-themes-for-zed/
├── extension.toml          Zed extension manifest
├── Makefile                Build orchestration
├── LICENSE                 MIT
├── README.md               This file
├── docs/                   Translated READMEs
├── themes/                 Generated Zed theme files (19 files)
└── scripts/
    ├── convert.ts          VS Code → Zed theme converter
    └── validate.ts         Theme structural linter
```

## Contributing

Contributions are welcome. If a color looks off, open an issue with:

1. The theme name
2. A screenshot from VS Code and Zed side by side
3. The specific UI element or syntax token

To regenerate and validate all themes:

```sh
make
```

## Credits

- Original themes by [Microsoft](https://github.com/microsoft/vscode) under the [MIT License](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)
- Solarized palette by [Ethan Schoonover](https://ethanschoonover.com/solarized/)
- Monokai palette by [Wimer Hazenberg](https://monokai.pro)

## License

[MIT](LICENSE)
