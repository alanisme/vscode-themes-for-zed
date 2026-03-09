# VS Code Classics for Zed

**VS Code 全部 17 款内置主题，完整移植到 Zed。**

翻译: [English](../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [日本語](README.ja.md)

---

想在 Zed 里找回 VS Code 的熟悉感？这个扩展把 VS Code 的每一款内置配色方案都搬了过来——UI 配色、语法高亮和终端调色板，直接从 VS Code 源码转换。Zed 使用 Tree-sitter 而非 TextMate 进行语法解析，因此部分标记的渲染可能略有差异，但整体观感高度还原。

## 主题列表

### 深色

| 主题 | 说明 |
|------|------|
| **Dark Modern (VS Code)** | VS Code 默认深色主题 (2023+) |
| **Dark+ (VS Code)** | VS Code 经典深色主题 |
| **Visual Studio Dark (VS Code)** | 经典 VS 深色底色 |
| **Monokai (VS Code)** | 经典 Monokai 配色 |
| **Monokai Dimmed (VS Code)** | 柔和版 Monokai |
| **Abyss (VS Code)** | 深蓝高对比 |
| **Kimbie Dark (VS Code)** | 暖色大地色调 |
| **Red (VS Code)** | 醒目红色主题 |
| **Solarized Dark (VS Code)** | Solarized 深色方案 |
| **Tomorrow Night Blue (VS Code)** | 深蓝底色 |
| **High Contrast Dark (VS Code)** | 无障碍深色 |

### 浅色

| 主题 | 说明 |
|------|------|
| **Light Modern (VS Code)** | VS Code 默认浅色主题 (2023+) |
| **Light+ (VS Code)** | VS Code 经典浅色主题 |
| **Visual Studio Light (VS Code)** | 经典 VS 浅色底色 |
| **Quiet Light (VS Code)** | 柔和浅色主题 |
| **Solarized Light (VS Code)** | Solarized 浅色方案 |
| **High Contrast Light (VS Code)** | 无障碍浅色 |

## 安装

### 通过 Zed 扩展市场

1. 打开 Zed
2. 打开命令面板 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. 搜索 **"Extensions"**
4. 搜索 **"VS Code Classics"**
5. 点击 **Install**

### 手动安装

将仓库克隆到 Zed 扩展目录：

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

重启 Zed 或在命令面板中执行 **"zed: reload extensions"**。

### 切换主题

1. 打开命令面板 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. 搜索 **"theme"**
3. 选择任意主题

或在 `settings.json` 中直接设置：

```json
{
  "theme": {
    "mode": "system",
    "light": "Light Modern (VS Code)",
    "dark": "Dark Modern (VS Code)"
  }
}
```

## 工作原理

所有主题从 [VS Code 源码仓库](https://github.com/microsoft/vscode)（默认：`1.96.4`，可通过 `VSCODE_REF` 覆盖）通过自动化流水线转换生成：

- 从 `microsoft/vscode` 锁定版本获取原始 JSONC 主题文件
- 递归解析 `include` 继承链（如 Dark Modern → Dark+ → VS Dark）
- 将 VS Code 工作台颜色映射到 Zed UI 标记（精选子集——Zed 有约 100 个标记，VS Code 有 500+）
- 通过前缀匹配将 TextMate 作用域翻译为 Tree-sitter 语法标记
- 使用 VS Code 语义标记颜色作为 TextMate 规则未覆盖标记的补充
- 保留字体样式（斜体、粗体）和终端 ANSI 调色板

**已知限制：**

- Zed 使用 Tree-sitter 而非 TextMate——部分语法标记映射不同或缺少直接对应
- VS Code 有约 500 个工作台颜色键；Zed 有约 100 个，并非所有 UI 细节都能表示
- 语义高亮覆盖范围取决于每个主题的定义

重新生成主题（默认使用锁定版本）：

```sh
make

# 或跟踪最新 VS Code 源码：
VSCODE_REF=main make
```

## 项目结构

```
vscode-themes-for-zed/
├── extension.toml          Zed 扩展清单
├── Makefile                构建编排
├── LICENSE                 MIT
├── README.md               英文说明
├── docs/                   翻译版 README
├── themes/                 生成的 Zed 主题文件（17 个）
└── scripts/
    ├── convert.ts          VS Code → Zed 主题转换器
    └── validate.ts         主题结构检查器
```

## 参与贡献

欢迎贡献。如发现配色偏差，请提交 Issue 并附上：

1. 主题名称
2. VS Code 与 Zed 的对比截图
3. 具体的 UI 元素或语法标记

重新生成并验证所有主题：

```sh
make
```

## 致谢

- 原始主题由 [Microsoft](https://github.com/microsoft/vscode) 创建，采用 [MIT 许可证](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)
- Solarized 配色由 [Ethan Schoonover](https://ethanschoonover.com/solarized/) 设计
- Monokai 配色由 [Wimer Hazenberg](https://monokai.pro) 设计

## 许可证

[MIT](../LICENSE)
