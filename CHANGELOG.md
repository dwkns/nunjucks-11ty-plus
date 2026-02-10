# Changelog

All notable changes to **Nunjucks 11ty Plus** will be documented in this file.

## [0.0.5] - 2026-02-10

### Added
- **Nunjucks Dark Modern** colour theme with dedicated Nunjucks scope colours (delimiters, keywords, variables, filters, comments, strings, numbers, frontmatter).
- `nunjucks.associateHtml` setting — opt-in to treat `.html` files as Nunjucks.
- Nunjucks block folding (`{% block %}`, `{% if %}`, `{% for %}`, `{% macro %}`, etc.).
- Comprehensive SYNTAX-SCOPES.md reference for theme customisation.

### Fixed
- Removed `workbench.colorCustomizations` from `configurationDefaults` — the extension no longer overrides users' global editor colours.
- Fixed JS frontmatter (`---js`) formatter routing (was incorrectly treated as JSON).

### Removed
- Removed unused `nunjucks.formatter.autoInstall` setting.

### Changed
- Grammar: renamed `handlebars` scopes to `nunjucks` for specificity.
- Grammar: added `asyncEach`, `endasyncEach`, `asyncAll`, `endasyncAll`, `verbatim`, `endverbatim`, `super` keywords.
- Grammar: expanded filter list (`title`, `truncate`, `safe`, `dictsort`, `groupby`, etc.).
- Improved frontmatter regex precision.

## [0.0.4] - 2025-12-01

### Added
- **dprint** WASM-based formatting (HTML/Nunjucks via markup_fmt, TypeScript, JSON, Markdown).
- Frontmatter-aware formatting: YAML (`---`), JSON (`---json`), JS (`---js`).
- `<style>` block formatting via Prettier CSS parser.
- Range formatting support (Format Selection).
- `nunjucks.showFormatterInfo` command and output channel logging.

### Changed
- Replaced Prettier-only formatter with dprint + Prettier hybrid.

## [0.0.3] - 2024-10-01

### Added
- Initial release: Nunjucks syntax highlighting and Prettier-based formatting.
- Language configuration (brackets, auto-closing pairs, folding, indentation).
- Embedded language support for JavaScript, CSS, YAML, JSON in `.njk` files.
