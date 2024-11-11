# nunjucks-11ty-plus

nunjucks-11ty-plus is a syntax highlighter for nunjucks files. 

Formatting can be done with [Nunjucks-prettier](https://marketplace.visualstudio.com/items?itemName=guapibai.nunjucks-prettier) however it will only really format the HTML in your file. The nunjucks code gets mangled. 

It has some additions that help when you're using [Eleventy (11ty)](http://11ty.dev/) as your website build tool.

> Warning: This extension is incomplete and there is much work to do. 

## Features

 - Native comments and Syntax highlight in: 
   - `<style>` tags 
   - `<script>` tags
   - `js`, `yaml` and `json` frontmatter.


## To do
Syntax highlighting
- [x] Detect nunjucks tags
- [x] Detect nunjucks variables
- [x] Detect HTML areas
- [ ] Less used tages `{%- -%}` `{{- -}}` etc
- [ ] quoted strings (single and double)
- [ ] objects `{ a: {}, b: "", "c": [] }` etc
- [ ] variable properties `student.score`
- [ ] Function names `field(name, value='', type='text')`
- [ ] Function properties `field(name, value='', type='text')`


Formatting
- [ ] Pretier plugin?
- [ ] Formating JS, JSON and YAML in frontmatter?
- [ ] Indentation (in laungage config?)



## Known Issues
- [ ] Bug: If you have front matter `Select all > Format` = bad

## scopes to format

copy/pasted from my setting until publication.
```json
      {
        "name": "Frontmatter open/close tags",
        "scope": "punctuation.definition.tag.begin.frontmatter,punctuation.definition.tag.end.frontmatter, keyword.other.whitespace.nunjucks",
        "settings": {
          "foreground": "#d4ae6e"
        }
      },
      {
        "name": "Nunjucks variable",
        "scope": "variable.nunjucks",
        "settings": {
          "foreground": "#02a489"
        }
      },
      {
        "name": "Nunjucks keyword",
        "scope": "keyword.control.nunjucks",
        "settings": {
          "foreground": "#ee6d0b"
        }
      },
      {
        "name": "Nunjucks open/close tags",
        "scope": "punctuation.definition.tag.nunjucks",
        "settings": {
          "foreground": "#ffde39"
        }
      },
      {
        "name": "????????????????",
        "scope": "entity.function.nunjucks",
        "settings": {
          "foreground": "#39ff3c"
        }
      },
      {
        "name": "Nunjucks Comments",
        "scope": "comment.block.nunjucks",
        "settings": {
          "foreground": "#6A9955",
          "fontStyle": "italic"
        }
      },
  ```