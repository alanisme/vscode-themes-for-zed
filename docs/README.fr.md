# VS Code Classics pour Zed

**Les 19 thèmes intégrés de Visual Studio Code, fidèlement portés vers Zed.**

Traductions : [English](../README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [日本語](README.ja.md)

---

Vos thèmes VS Code vous manquent ? Cette extension apporte tous les thèmes de couleur intégrés de VS Code vers Zed — couleurs d'interface, coloration syntaxique et palettes de terminal convertis directement depuis le code source de VS Code. Zed utilise Tree-sitter au lieu de TextMate pour la syntaxe, donc certains tokens peuvent s'afficher légèrement différemment, mais l'apparence générale reste fidèle à l'original.

## Thèmes

### Sombres

| Thème | Basé sur |
|-------|----------|
| **Dark 2026 (VS Code)** | Thème sombre par défaut de VS Code (rafraîchissement 2026) |
| **Dark Modern (VS Code)** | Thème sombre par défaut de VS Code (2023+) |
| **Dark+ (VS Code)** | Thème sombre classique de VS Code |
| **Visual Studio Dark (VS Code)** | La base sombre originale de VS |
| **Monokai (VS Code)** | L'iconique palette Monokai |
| **Monokai Dimmed (VS Code)** | Monokai aux tons adoucis |
| **Abyss (VS Code)** | Bleu profond, haut contraste |
| **Kimbie Dark (VS Code)** | Tons chauds terreux |
| **Red (VS Code)** | Accent rouge audacieux |
| **Solarized Dark (VS Code)** | Palette sombre d'Ethan Schoonover |
| **Tomorrow Night Blue (VS Code)** | Fond bleu profond |
| **High Contrast Dark (VS Code)** | Sombre accessible |

### Clairs

| Thème | Basé sur |
|-------|----------|
| **Light 2026 (VS Code)** | Thème clair par défaut de VS Code (rafraîchissement 2026) |
| **Light Modern (VS Code)** | Thème clair par défaut de VS Code (2023+) |
| **Light+ (VS Code)** | Thème clair classique de VS Code |
| **Visual Studio Light (VS Code)** | La base claire originale de VS |
| **Quiet Light (VS Code)** | Doux, agréable pour les yeux |
| **Solarized Light (VS Code)** | Palette claire d'Ethan Schoonover |
| **High Contrast Light (VS Code)** | Clair accessible |

## Installation

### Depuis les extensions Zed

1. Ouvrez Zed
2. Ouvrez la palette de commandes (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Recherchez **"Extensions"**
4. Recherchez **"VS Code Classics"**
5. Cliquez sur **Install**

### Installation manuelle

Clonez ce dépôt dans le répertoire des extensions Zed :

**macOS / Linux :**

```sh
git clone https://github.com/alanisme/vscode-themes-for-zed \
  ~/.local/share/zed/extensions/vscode-classics
```

**Windows :**

```powershell
git clone https://github.com/alanisme/vscode-themes-for-zed `
  "$env:APPDATA\Zed\extensions\vscode-classics"
```

Redémarrez Zed ou exécutez **"zed: reload extensions"** depuis la palette de commandes.

### Activer un thème

1. Ouvrez la palette de commandes (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Recherchez **"theme"**
3. Choisissez un thème dans la liste

Ou ajoutez-le directement dans votre `settings.json` :

```json
{
  "theme": {
    "mode": "system",
    "light": "Light Modern (VS Code)",
    "dark": "Dark Modern (VS Code)"
  }
}
```

## Fonctionnement

Les thèmes sont convertis depuis le [dépôt source de VS Code](https://github.com/microsoft/vscode) (par défaut : `1.96.4`, configurable via `VSCODE_REF`) via un pipeline automatisé :

- Récupère les fichiers JSONC originaux depuis `microsoft/vscode` à la version fixée
- Résout récursivement la chaîne d'`include` (ex : Dark Modern → Dark+ → VS Dark)
- Mappe les couleurs du workbench VS Code vers les tokens UI de Zed (sous-ensemble curé — Zed a ~100 tokens contre 500+ pour VS Code)
- Traduit les scopes TextMate en tokens de syntaxe Tree-sitter par correspondance de préfixe
- Applique les couleurs de tokens sémantiques de VS Code en repli pour les tokens non couverts par les règles TextMate
- Préserve les styles de police (italique, gras) et les palettes ANSI du terminal

**Limitations connues :**

- Zed utilise Tree-sitter, pas TextMate — certains tokens de syntaxe se mappent différemment ou n'ont pas d'équivalent direct
- VS Code a ~500 clés de couleur du workbench ; Zed en a ~100. Tous les détails d'interface ne peuvent pas être représentés
- La couverture du surlignage sémantique dépend de ce que chaque thème définit

Pour régénérer les thèmes (utilise la version fixée par défaut) :

```sh
make

# ou suivre la dernière source VS Code :
VSCODE_REF=main make
```

## Structure du projet

```
vscode-themes-for-zed/
├── extension.toml          Manifeste d'extension Zed
├── Makefile                Orchestration du build
├── LICENSE                 MIT
├── README.md               Documentation principale
├── docs/                   READMEs traduits
├── themes/                 Fichiers de thème Zed générés (19 fichiers)
└── scripts/
    ├── convert.ts          Convertisseur VS Code → Zed
    └── validate.ts         Linter structurel de thèmes
```

## Contribuer

Les contributions sont les bienvenues. Si une couleur semble incorrecte, ouvrez une issue avec :

1. Le nom du thème
2. Une capture d'écran comparant VS Code et Zed
3. L'élément d'interface ou le token de syntaxe concerné

Pour régénérer et valider tous les thèmes :

```sh
make
```

## Crédits

- Thèmes originaux par [Microsoft](https://github.com/microsoft/vscode) sous [licence MIT](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)
- Palette Solarized par [Ethan Schoonover](https://ethanschoonover.com/solarized/)
- Palette Monokai par [Wimer Hazenberg](https://monokai.pro)

## Licence

[MIT](../LICENSE)
