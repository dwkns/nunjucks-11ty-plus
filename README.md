# Nunjucks 11ty Plus

A [VS Code](https://code.visualstudio.com/) extension that adds **syntax highlighting**, **formatting**, and a **colour theme** for [Nunjucks](https://mozilla.github.io/nunjucks/) templates (`.njk`), with first-class support for [Eleventy (11ty)](https://www.11ty.dev) projects.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dwkns/nunjucks-11ty-plus/blob/HEAD/LICENSE.txt)

---

## Features

| Feature | Description |
|---------|-------------|
| **Syntax highlighting** | Nunjucks tags, variables, filters, and embedded HTML in `.njk` files |
| **Embedded languages** | JavaScript and CSS in `<script>` / `<style>`; YAML, JSON, and JS in frontmatter (`---`, `---json`, `---js`) |
| **Format Document** | Format the whole file (`Shift+Alt+F` / `Shift+Option+F`) |
| **Format Selection** | Format only the selected range via the Command Palette or context menu |
| **Bundled formatters** | Uses bundled [dprint](https://dprint.dev/) WASM and [Prettier](https://prettier.io/) — no CLI or local install required |
| **Nunjucks Dark Modern** | Dark theme based on VS Code Dark Modern with dedicated colours for all Nunjucks scopes |

### What gets formatted

- **HTML / Nunjucks** — dprint markup plugin
- **JavaScript** in `<script>` and `---js` frontmatter — dprint
- **JSON** in `---json` frontmatter — dprint
- **YAML** in `---` frontmatter — Prettier
- **CSS** in `<style>` blocks — Prettier

---

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dwkns.nunjucks-11ty-plus) or from the command line:

```bash
code --install-extension dwkns.nunjucks-11ty-plus
```

---

## Usage

1. Open a `.njk` file — VS Code will use the Nunjucks language mode.
2. **Format Document:** `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS).
3. **Format Selection:** Select text, right-click, then **Format Selection**, or use the Command Palette.
4. **Colour theme:** **File → Preferences → Color Theme** → select **Nunjucks Dark Modern**.
5. **Formatter status:** Command Palette → **Nunjucks: Show Formatter Info** to check that formatters loaded correctly.

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `nunjucks.associateHtml` | `false` | Treat `.html` files as Nunjucks. When enabled, `.html` files open with Nunjucks syntax highlighting and formatting. |

---

## Customising syntax colours

The extension assigns TextMate scope names (e.g. `keyword.control.nunjucks`, `variable.nunjucks`, `entity.name.function.filter.nunjucks`) to Nunjucks tokens. You can override these in your `settings.json` via `editor.tokenColorCustomizations`.

See [SYNTAX-SCOPES.md](https://github.com/dwkns/nunjucks-11ty-plus/blob/HEAD/SYNTAX-SCOPES.md) for a complete table of scopes, their colours in the bundled theme, and copy-paste JSON for `settings.json`.

---

## Requirements

- **VS Code** `^1.95.0`
- No extra tools or runtimes — formatters are bundled.

---

## Troubleshooting

- **Formatting fails** — Run **Nunjucks: Show Formatter Info** from the Command Palette. The output channel shows whether dprint plugins loaded. If developing from source, run `npm install` so `node_modules` are present.
- **Syntax or formatting looks wrong** — File an [issue](https://github.com/dwkns/nunjucks-11ty-plus/issues) with a small example and your VS Code version.

---

## Contributing

Bug reports and feature requests are welcome on [GitHub Issues](https://github.com/dwkns/nunjucks-11ty-plus/issues). Pull requests appreciated — please run `npm test` before submitting.

---

## License

[MIT](https://github.com/dwkns/nunjucks-11ty-plus/blob/HEAD/LICENSE.txt)
