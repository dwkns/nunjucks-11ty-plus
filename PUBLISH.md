# Publishing Nunjucks 11ty Plus

## Prerequisites

```bash
npm install -g @vscode/vsce
npm install -g ovsx
```

---

## Tokens

You need two Personal Access Tokens stored as environment variables:

```bash
export VSCE_PAT="<your VS Code Marketplace PAT>"
export OVSX_PAT="<your Open VSX PAT>"
```

Generate them at:
- **VSCE:** https://dev.azure.com/dwkns/_usersSettings/tokens
- **OVSX:** https://open-vsx.org/user-settings/tokens

> Tip: add the exports to your `~/.zshrc` so they persist across sessions.

---

## Step 1 — Build the .vsix package

```bash
vsce package
```

This creates `nunjucks-11ty-plus-0.0.5.vsix` in the project root.

---

## Step 2 — Publish to VS Code Marketplace

```bash
vsce publish -p $VSCE_PAT
```

Verify at: https://marketplace.visualstudio.com/items?itemName=dwkns.nunjucks-11ty-plus

---

## Step 3 — Publish to Open VSX (Cursor Marketplace)

```bash
ovsx publish nunjucks-11ty-plus-0.0.5.vsix -p $OVSX_PAT
```

Verify at: https://open-vsx.org/extension/dwkns/nunjucks-11ty-plus

---

## All-in-one

```bash
vsce package && \
vsce publish -p $VSCE_PAT && \
ovsx publish nunjucks-11ty-plus-0.0.5.vsix -p $OVSX_PAT
```

---

## Updating version for future releases

1. Bump version in `package.json`
2. Update `CHANGELOG.md`
3. Commit and tag:
   ```bash
   git add -A && git commit -m "v0.0.X: description"
   git tag v0.0.X
   git push && git push --tags
   ```
4. Run the publish steps above

---

## Troubleshooting

- **"The Personal Access Token has expired"** — Regenerate at the links above
- **Missing dependencies** — Run `npm install` before `vsce package`
- **Files in .vsix you didn't expect** — Check `.vscodeignore`
- **Inspect package contents** — `vsce ls` shows what will be included
