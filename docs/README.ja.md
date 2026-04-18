# VS Code Classics for Zed

**Visual Studio Code の全 19 組み込みテーマを Zed に忠実に移植。**

翻訳: [English](../README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [Français](README.fr.md)

---

VS Code のお気に入りの見た目を Zed でも使いたい？この拡張機能は、VS Code の全組み込みカラーテーマを Zed に再現します — UI カラー、シンタックスハイライト、ターミナルパレットを VS Code ソースコードから直接変換。Zed は TextMate ではなく Tree-sitter を使用するため、一部のトークンの表示がわずかに異なる場合がありますが、全体的な見た目はオリジナルに近い仕上がりです。

## テーマ一覧

### ダーク

| テーマ | 説明 |
|--------|------|
| **Dark 2026 (VS Code)** | VS Code デフォルトダークテーマ (2026 リフレッシュ) |
| **Dark Modern (VS Code)** | VS Code デフォルトダークテーマ (2023+) |
| **Dark+ (VS Code)** | VS Code クラシックダークテーマ |
| **Visual Studio Dark (VS Code)** | オリジナルの VS ダークベース |
| **Monokai (VS Code)** | 定番の Monokai パレット |
| **Monokai Dimmed (VS Code)** | ソフトな Monokai |
| **Abyss (VS Code)** | ディープブルー、ハイコントラスト |
| **Kimbie Dark (VS Code)** | 暖かみのあるアーストーン |
| **Red (VS Code)** | 大胆なレッドアクセント |
| **Solarized Dark (VS Code)** | Ethan Schoonover のダークパレット |
| **Tomorrow Night Blue (VS Code)** | ディープブルー背景 |
| **High Contrast Dark (VS Code)** | アクセシビリティ重視ダーク |

### ライト

| テーマ | 説明 |
|--------|------|
| **Light 2026 (VS Code)** | VS Code デフォルトライトテーマ (2026 リフレッシュ) |
| **Light Modern (VS Code)** | VS Code デフォルトライトテーマ (2023+) |
| **Light+ (VS Code)** | VS Code クラシックライトテーマ |
| **Visual Studio Light (VS Code)** | オリジナルの VS ライトベース |
| **Quiet Light (VS Code)** | 目に優しいソフトなテーマ |
| **Solarized Light (VS Code)** | Ethan Schoonover のライトパレット |
| **High Contrast Light (VS Code)** | アクセシビリティ重視ライト |

## インストール

### Zed 拡張機能から

1. Zed を開く
2. コマンドパレットを開く (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. **"Extensions"** を検索
4. **"VS Code Classics"** を検索
5. **Install** をクリック

### 手動インストール

このリポジトリを Zed の拡張機能ディレクトリにクローン：

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

Zed を再起動するか、コマンドパレットから **"zed: reload extensions"** を実行。

### テーマの有効化

1. コマンドパレットを開く (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. **"theme"** を検索
3. リストからテーマを選択

または `settings.json` に直接追加：

```json
{
  "theme": {
    "mode": "system",
    "light": "Light Modern (VS Code)",
    "dark": "Dark Modern (VS Code)"
  }
}
```

## 仕組み

すべてのテーマは [VS Code ソースリポジトリ](https://github.com/microsoft/vscode)（デフォルト：`1.96.4`、`VSCODE_REF` で変更可能）から自動パイプラインで変換されます：

- `microsoft/vscode` の固定バージョンからオリジナルの JSONC テーマファイルを取得
- `include` チェーンを再帰的に解決（例: Dark Modern → Dark+ → VS Dark）
- VS Code のワークベンチカラーを Zed UI トークンにマッピング（厳選サブセット — Zed は約 100 トークン、VS Code は 500+）
- プレフィックスマッチングで TextMate スコープを Tree-sitter シンタックストークンに変換
- TextMate ルールでカバーされないトークンに VS Code セマンティックトークンカラーをフォールバック適用
- フォントスタイル（イタリック、ボールド）とターミナル ANSI パレットを保持

**既知の制限事項：**

- Zed は TextMate ではなく Tree-sitter を使用 — 一部のシンタックストークンのマッピングが異なるか、直接対応がない
- VS Code には約 500 のワークベンチカラーキーがあり、Zed には約 100 — すべての UI 詳細を表現できるわけではない
- セマンティックハイライトのカバレッジは各テーマの定義に依存

テーマを再生成（デフォルトは固定バージョン）：

```sh
make

# または最新の VS Code ソースを追跡：
VSCODE_REF=main make
```

## プロジェクト構造

```
vscode-themes-for-zed/
├── extension.toml          Zed 拡張マニフェスト
├── Makefile                ビルドオーケストレーション
├── LICENSE                 MIT
├── README.md               メインドキュメント
├── docs/                   翻訳版 README
├── themes/                 生成された Zed テーマファイル（19 ファイル）
└── scripts/
    ├── convert.ts          VS Code → Zed テーマコンバーター
    └── validate.ts         テーマ構造リンター
```

## コントリビュート

貢献を歓迎します。配色に問題がある場合、以下を含めて Issue を作成してください：

1. テーマ名
2. VS Code と Zed の比較スクリーンショット
3. 具体的な UI 要素またはシンタックストークン

すべてのテーマを再生成・検証：

```sh
make
```

## クレジット

- オリジナルテーマ：[Microsoft](https://github.com/microsoft/vscode)（[MIT ライセンス](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)）
- Solarized パレット：[Ethan Schoonover](https://ethanschoonover.com/solarized/)
- Monokai パレット：[Wimer Hazenberg](https://monokai.pro)

## ライセンス

[MIT](../LICENSE)
