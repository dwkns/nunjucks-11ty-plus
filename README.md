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

- [ ] Detect nunjucks tags
- [ ] Detect nunjucks variables
- [ ] Detect HTML areas
- [ ] Proper Formatting

## Known Issues

Pretty much nothing works yet so they are legion but specifically:

- If you have JS, YAML or JSON frontmatter and you select all > comment everything in your file, it will comment as if it was the format of your frontmatter. Don't know how to deal with this yet. 

## scopes to format

`comment.block.nunjucks` — comments