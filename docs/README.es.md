# VS Code Classics para Zed

**Los 17 temas integrados de Visual Studio Code, fielmente portados a Zed.**

Traducciones: [English](../README.md) | [简体中文](README.zh-CN.md) | [Français](README.fr.md) | [日本語](README.ja.md)

---

¿Echas de menos tu aspecto favorito de VS Code? Esta extensión trae todos los temas de color integrados de VS Code a Zed — colores de interfaz, resaltado de sintaxis y paletas de terminal convertidos directamente desde el código fuente de VS Code. Zed usa Tree-sitter en lugar de TextMate para la sintaxis, por lo que algunos tokens pueden renderizarse ligeramente diferente, pero la apariencia general se mantiene fiel al original.

## Temas

### Oscuros

| Tema | Basado en |
|------|-----------|
| **Dark Modern (VS Code)** | Tema oscuro predeterminado de VS Code (2023+) |
| **Dark+ (VS Code)** | Tema oscuro clásico de VS Code |
| **Visual Studio Dark (VS Code)** | La base oscura original de VS |
| **Monokai (VS Code)** | La icónica paleta Monokai |
| **Monokai Dimmed (VS Code)** | Monokai con tonos suaves |
| **Abyss (VS Code)** | Azul profundo, alto contraste |
| **Kimbie Dark (VS Code)** | Tonos cálidos terrosos |
| **Red (VS Code)** | Acento rojo audaz |
| **Solarized Dark (VS Code)** | Paleta oscura de Ethan Schoonover |
| **Tomorrow Night Blue (VS Code)** | Fondo azul profundo |
| **High Contrast Dark (VS Code)** | Oscuro con accesibilidad |

### Claros

| Tema | Basado en |
|------|-----------|
| **Light Modern (VS Code)** | Tema claro predeterminado de VS Code (2023+) |
| **Light+ (VS Code)** | Tema claro clásico de VS Code |
| **Visual Studio Light (VS Code)** | La base clara original de VS |
| **Quiet Light (VS Code)** | Suave, fácil para la vista |
| **Solarized Light (VS Code)** | Paleta clara de Ethan Schoonover |
| **High Contrast Light (VS Code)** | Claro con accesibilidad |

## Instalación

### Desde las extensiones de Zed

1. Abre Zed
2. Abre la paleta de comandos (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Busca **"Extensions"**
4. Busca **"VS Code Classics"**
5. Haz clic en **Install**

### Instalación manual

Clona este repositorio en el directorio de extensiones de Zed:

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

Reinicia Zed o ejecuta **"zed: reload extensions"** desde la paleta de comandos.

### Activar un tema

1. Abre la paleta de comandos (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Busca **"theme"**
3. Elige cualquier tema de la lista

O agrégalo directamente en tu `settings.json`:

```json
{
  "theme": {
    "mode": "system",
    "light": "Light Modern (VS Code)",
    "dark": "Dark Modern (VS Code)"
  }
}
```

## Cómo funciona

Los temas se convierten desde el [repositorio fuente de VS Code](https://github.com/microsoft/vscode) (por defecto: `1.96.4`, configurable vía `VSCODE_REF`) mediante un pipeline automatizado:

- Obtiene los archivos JSONC originales desde `microsoft/vscode` en la versión fijada
- Resuelve recursivamente la cadena de `include` (ej: Dark Modern → Dark+ → VS Dark)
- Mapea los colores del workbench de VS Code a tokens de UI de Zed (subconjunto curado — Zed tiene ~100 tokens vs 500+ de VS Code)
- Traduce los scopes de TextMate a tokens de sintaxis Tree-sitter mediante coincidencia por prefijo
- Aplica colores de tokens semánticos de VS Code como respaldo para tokens no cubiertos por reglas TextMate
- Preserva estilos de fuente (cursiva, negrita) y paletas ANSI del terminal

**Limitaciones conocidas:**

- Zed usa Tree-sitter, no TextMate — algunos tokens de sintaxis se mapean diferente o carecen de equivalente directo
- VS Code tiene ~500 claves de color del workbench; Zed tiene ~100. No todos los detalles de UI se pueden representar
- La cobertura del resaltado semántico depende de lo que cada tema defina

Para regenerar los temas (usa la versión fijada por defecto):

```sh
make

# o seguir la fuente más reciente de VS Code:
VSCODE_REF=main make
```

## Estructura del proyecto

```
vscode-themes-for-zed/
├── extension.toml          Manifiesto de extensión Zed
├── Makefile                Orquestación de build
├── LICENSE                 MIT
├── README.md               Documentación principal
├── docs/                   READMEs traducidos
├── themes/                 Archivos de tema Zed generados (17 archivos)
└── scripts/
    ├── convert.ts          Convertidor VS Code → Zed
    └── validate.ts         Linter estructural de temas
```

## Contribuir

Las contribuciones son bienvenidas. Si un color se ve incorrecto, abre un issue con:

1. El nombre del tema
2. Una captura de pantalla comparando VS Code y Zed
3. El elemento de UI o token de sintaxis específico

Para regenerar y validar todos los temas:

```sh
make
```

## Créditos

- Temas originales por [Microsoft](https://github.com/microsoft/vscode) bajo [licencia MIT](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)
- Paleta Solarized por [Ethan Schoonover](https://ethanschoonover.com/solarized/)
- Paleta Monokai por [Wimer Hazenberg](https://monokai.pro)

## Licencia

[MIT](../LICENSE)
