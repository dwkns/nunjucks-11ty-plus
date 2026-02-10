# Nunjucks syntax scopes and theming

This extension assigns **TextMate scope names** to parts of `.njk` files. You can customise colours in VS Code by targeting these scopes in `editor.tokenColorCustomizations`.

Below are the main **Nunjucks-specific** scopes (not HTML/JS/CSS embedded blocks). Use them to theme tags, variables, filters, and comments.

---

## Scope reference

| Scope | Description | Theme colour |
|-------|-------------|-------------|
| `punctuation.definition.tag.begin.nunjucks` | Opening delimiters: `{%`, `{{`, `{#` | `#FFD700` gold |
| `punctuation.definition.tag.end.nunjucks` | Closing delimiters: `%}`, `}}`, `#}` | `#FFD700` gold |
| `punctuation.definition.tag.nunjucks` | Inline tag punctuation | `#FFD700` gold |
| `punctuation.section.group.begin.nunjucks` | `(` in expressions | `#FFD700` gold |
| `punctuation.section.group.end.nunjucks` | `)` in expressions | `#FFD700` gold |
| `punctuation.separator.parameter.nunjucks` | `,` in function/macro arguments | `#FFD700` gold |
| `keyword.control.nunjucks` | Control keywords: `for`, `if`, `else`, `elif`, `block`, `extends`, `include`, `set`, `macro`, `import`, `with`, `filter`, `raw`, `asyncEach`, `asyncAll`, `verbatim`, `super`, etc. | `#FF79C6` hot pink |
| `keyword.other.whitespace.nunjucks` | Whitespace-control dash in `{%-` or `-%}` | `#636D83` dim grey |
| `variable.nunjucks` | Variable names and dotted paths (e.g. `user.name`, `items`) | `#82AAFF` cornflower blue |
| `variable.parameter.nunjucks` | Macro parameters and object keys in tag arguments | `#F78C6C` coral |
| `entity.name.function.nunjucks` | Function or macro name (e.g. before `(`) | `#7EE787` bright green |
| `entity.name.function.filter.nunjucks` | Filter names: `capitalize`, `default`, `length`, `join`, `upper`, `lower`, etc. | `#D2A8FF` soft lavender |
| `string.quoted.single.nunjucks` | Single-quoted strings inside Nunjucks tags | `#E9D585` warm yellow |
| `string.quoted.double.nunjucks` | Double-quoted strings inside Nunjucks tags | `#E9D585` warm yellow |
| `constant.numeric.nunjucks` | Numbers | `#FFA657` orange |
| `comment.block.nunjucks` | Nunjucks comments: `{# ... #}` | `#6A9955` green, *italic* |
| `keyword.annotation.nunjucks` | Annotations in comments | `#636D83` dim grey |
| `entity.other.attribute-name.nunjucks` | Attribute names | `#82AAFF` cornflower blue |
| `entity.other.attribute-value.nunjucks` | Attribute values | `#82AAFF` cornflower blue |
| `punctuation.definition.tag.begin.frontmatter` | Frontmatter opening `---` | `#E5C07B` muted gold |
| `punctuation.definition.tag.end.frontmatter` | Frontmatter closing `---` | `#E5C07B` muted gold |
| `meta.tag.nunjucks` | Whole `{% ... %}` or `{{ ... }}` tag (meta scope) | — |
| `meta.structure.object.nunjucks` | Object literal `{ key: value }` inside tags | — |

---

## Customising in settings.json

Add this to your `settings.json` to override any scope colours when using a different theme:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      { "scope": "keyword.control.nunjucks", "settings": { "foreground": "#FF79C6" } },
      { "scope": "variable.nunjucks", "settings": { "foreground": "#82AAFF" } },
      { "scope": "entity.name.function.filter.nunjucks", "settings": { "foreground": "#D2A8FF" } },
      { "scope": "entity.name.function.nunjucks", "settings": { "foreground": "#7EE787" } },
      { "scope": "comment.block.nunjucks", "settings": { "foreground": "#6A9955", "fontStyle": "italic" } },
      { "scope": "string.quoted.single.nunjucks", "settings": { "foreground": "#E9D585" } },
      { "scope": "string.quoted.double.nunjucks", "settings": { "foreground": "#E9D585" } },
      { "scope": "constant.numeric.nunjucks", "settings": { "foreground": "#FFA657" } },
      {
        "scope": [
          "punctuation.definition.tag.begin.nunjucks",
          "punctuation.definition.tag.end.nunjucks",
          "punctuation.definition.tag.nunjucks"
        ],
        "settings": { "foreground": "#FFD700" }
      }
    ]
  }
}
```

To scope overrides to a specific theme, replace the outer key:

```json
{
  "editor.tokenColorCustomizations": {
    "[Default Dark Modern]": {
      "textMateRules": [
        ...
      ]
    }
  }
}
```

---

## Notes

- Scopes follow the **TextMate / VS Code** convention: `category.subcategory.item.language`.
- All Nunjucks-specific scopes end with `.nunjucks`; frontmatter uses `.frontmatter`.
- HTML, JavaScript, and CSS inside `<style>`, `<script>`, and frontmatter use their standard scopes (e.g. `entity.name.tag.html`, `variable.other.readwrite.js`). Theme those via your normal language rules.
- The **Nunjucks Dark Modern** theme bundled with this extension already applies all the colours listed above.
